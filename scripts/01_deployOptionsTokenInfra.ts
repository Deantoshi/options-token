import { ethers, upgrades } from "hardhat";
import { getImplementationAddress } from '@openzeppelin/upgrades-core';
import config from './config.json';



async function main() {
  const swapper = await ethers.getContractAt("ReaperSwapper", config.SWAPPER);
  const contractsToDeploy = config.CONTRACTS_TO_DEPLOY;
  const thenaPair = config.ORACLE_SOURCE;
  const targetToken = config.OT_UNDERLYING_TOKEN;
  const owner = config.OWNER;
  const secs = config.ORACLE_SECS;
  const minPrice = config.ORACLE_MIN_PRICE;

  const veloRouter = config.VELO_ROUTER;
  const addressProvider = config.ADDRESS_PROVIDER;

  //Oracle
  let oracle;
  if(contractsToDeploy.includes("ThenaOracle")){
    oracle = await ethers.deployContract(
      "ThenaOracle",
      [thenaPair, targetToken, owner, secs, minPrice]
    );
    await oracle.waitForDeployment();
    console.log(`Oracle deployed to: ${await oracle.getAddress()}`);
  }
  else{
    oracle = await ethers.getContractAt("ThenaOracle", config.ORACLE);
  }
 
  // OptionsToken
  let optionsToken;
  if(contractsToDeploy.includes("OptionsToken")){
    const tokenName = config.OT_NAME;
    const symbol = config.OT_SYMBOL;
    const tokenAdmin = config.OT_TOKEN_ADMIN;
    const OptionsToken = await ethers.getContractFactory("OptionsToken");
    optionsToken = await upgrades.deployProxy(
      OptionsToken,
      [tokenName, symbol, tokenAdmin],
      { kind: "uups", initializer: "initialize" }
    );
  
    await optionsToken.waitForDeployment();
    console.log(`OptionsToken deployed to: ${await optionsToken.getAddress()}`);
    console.log(`Implementation: ${await getImplementationAddress(ethers.provider, await optionsToken.getAddress())}`);
  }
  else{
    optionsToken = await ethers.getContractAt("OptionsToken", config.OPTIONS_TOKEN);
  }

  const swapProps = {
    swapper: await swapper.getAddress(),
    exchangeAddress: veloRouter,
    exchangeTypes: 2, /* VeloSolid */
    maxSwapSlippage: 500 /* 5% */
  };

  // Exercise
  let exercise;
  if(contractsToDeploy.includes("DiscountExercise")){
    const paymentToken = config.OT_PAYMENT_TOKEN;
    const multiplier = config.MULTIPLIER;
    const feeRecipients = String(config.FEE_RECIPIENTS).split(",");
    const feeBps = String(config.FEE_BPS).split(",");
    const instantExitFee = config.INSTANT_EXIT_FEE;
    const minAmountToTriggerSwap = config.MIN_AMOUNT_TO_TRIGGER_SWAP;
  
    exercise = await ethers.deployContract(
      "DiscountExercise",
      [
        await optionsToken.getAddress(),
        owner,
        paymentToken,
        targetToken,
        await oracle.getAddress(),
        multiplier,
        instantExitFee,
        minAmountToTriggerSwap,
        feeRecipients,
        feeBps,
        swapProps
      ]
    );
    await exercise.waitForDeployment();
    console.log(`Exercise deployed to: ${await exercise.getAddress()}`);
  
    // Set exercise
    const exerciseAddress = await exercise.getAddress();
    await optionsToken.setExerciseContract(exerciseAddress, true);
    console.log(`Exercise set to: ${exerciseAddress}`);
  }
  else{
    exercise = await ethers.getContractAt("DiscountExercise", config.DISCOUNT_EXERCISE);
  }


  // OptionsCompounder
  let optionsCompounder;

  if(contractsToDeploy.includes("OptionsCompounder")){
    const OptionsCompounder = await ethers.getContractFactory("OptionsCompounder");
  
    // console.log("Proxy deployment: ", [optionsToken, addressProvider, swapper, swapProps, oracle]);
    console.log("Proxy deployment: ", [await optionsToken.getAddress(), addressProvider, await swapper.getAddress(), swapProps, await oracle.getAddress()]);
    
    optionsCompounder = await upgrades.deployProxy(
      OptionsCompounder,
      [await optionsToken.getAddress(), addressProvider, await swapper.getAddress(), swapProps, await oracle.getAddress()],
      { kind: "uups", initializer: "initialize" }
    );
  
    // const optionsCompounder = await upgrades.deployProxy(
    //   OptionsCompounder,
    //   [optionsToken, addressProvider, swapper, swapProps, oracle],
    //   { kind: "uups", initializer: "initialize" }
    // );
  
    await optionsCompounder.waitForDeployment();
    console.log(`OptionsCompounder deployed to: ${await optionsCompounder.getAddress()}`);
    console.log(`Implementation: ${await getImplementationAddress(ethers.provider, await optionsCompounder.getAddress())}`);
  }
  else{
    optionsCompounder = await ethers.getContractAt("OptionsCompounder", config.OPTIONS_COMPOUNDER);
  }

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
