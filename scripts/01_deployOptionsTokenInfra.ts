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
  // let oracle;
  // if(contractsToDeploy.includes("ThenaOracle")){
  //   oracle = await ethers.deployContract(
  //     "ThenaOracle",
  //     [thenaPair, targetToken, owner, secs, minPrice]
  //   );
  //   await oracle.waitForDeployment();
  //   console.log(`Oracle deployed to: ${await oracle.getAddress()}`);
  // }
  // else{
  //   try{
  //     oracle = await ethers.getContractAt("ThenaOracle", config.ORACLE);
  //   }
  //   catch(error){
  //     console.log("ThenaOracle NOT available due to lack of configuration");
  //   }
  // }
 
  // OptionsToken
  // let optionsToken;
  // if(contractsToDeploy.includes("OptionsToken")){
  //   const tokenName = config.OT_NAME;
  //   const symbol = config.OT_SYMBOL;
  //   const tokenAdmin = config.OT_TOKEN_ADMIN;
  //   const OptionsToken = await ethers.getContractFactory("OptionsToken");
  //   optionsToken = await upgrades.deployProxy(
  //     OptionsToken,
  //     [tokenName, symbol, tokenAdmin],
  //     { kind: "uups", initializer: "initialize" }
  //   );
  
  //   await optionsToken.waitForDeployment();
  //   console.log(`OptionsToken deployed to: ${await optionsToken.getAddress()}`);
  //   console.log(`Implementation: ${await getImplementationAddress(ethers.provider, await optionsToken.getAddress())}`);
  // }
  // else{
  //   try{
  //     optionsToken = await ethers.getContractAt("OptionsToken", config.OPTIONS_TOKEN);
  //   }
  //   catch(error){
  //     console.log("OptionsToken NOT available due to lack of configuration");
  //   }    
  // }

  // // SCROLL
  const optionsTokenAddress = "0x66920C838Bd38bB46995aa5faEBCe3904aD94Da4";
  const deployerAddress = "0x63701b759EaFDcDC0817d0721603151f93e2Cffd";
  const paymentTokenAddress = "0x5300000000000000000000000000000000000004";
  const underlyingTokenAddress = "0x549423E69576b80E91dC836ae37e04209660c4ec";
  const oracleAddress = "0x85be9bc0D401b97179A155398F6FeaE70918806d";
  const multiplier = 5000;
  const instantExitFee = 1000;
  const minAmountToTriggerSwap = 1000000000000000;
  const feeRecipients = "0xaf473B0EA053949018510783d1164f537717fDf3";
  const feeBPS = "10000";
  //   const swapProps = [
  //     "0x13155Ea5D9b3471ad31A47Bc82672f0538FA142E",
  //     "0xAAA45c8F5ef92a000a121d102F4e89278a711Faa",
  //     2,
  //     500
  //   ];

  const swapProps = {
    swapper: "0x13155Ea5D9b3471ad31A47Bc82672f0538FA142E",
    exchangeAddress: "0xAAA45c8F5ef92a000a121d102F4e89278a711Faa",
    exchangeTypes: 2, /* VeloSolid */
    maxSwapSlippage: 500 /* 5% */
  };

  // // SCROLL

  // // MODE
  // const optionsTokenAddress = "0x3B2BEF39ad1Fca11222Ff11eC3eAF6bBb239Be80";
  // const deployerAddress = "0x63701b759EaFDcDC0817d0721603151f93e2Cffd";
  // const paymentTokenAddress = "0xDfc7C877a950e49D2610114102175A06C2e3167a";
  // const underlyingTokenAddress = "0x95177295A394f2b9B04545FFf58f4aF0673E839d";
  // const oracleAddress = "0xDaA2c821428f62e1B08009a69CE824253CCEE5f9";
  // const multiplier = 5000;
  // const instantExitFee = 1000;
  // const minAmountToTriggerSwap = 1000000000000000;
  // const feeRecipients = "0xd93E25A8B1D645b15f8c736E1419b4819Ff9e6EF";
  // const feeBPS = "10000";

  // const swapProps = {
  //   swapper: "0xB207899f7eEc978Eb1B30Fd8Eb95b69d5B984B61",
  //   exchangeAddress: "0x3a63171DD9BebF4D07BC782FECC7eb0b890C2A45",
  //   exchangeTypes: 2, /* VeloSolid */
  //   maxSwapSlippage: 500 /* 5% */
  // };
  // // MODE

  // Exercise
  let exercise;
  // if(contractsToDeploy.includes("DiscountExercise")){
    // const paymentToken = config.OT_PAYMENT_TOKEN;
    // const multiplier = config.MULTIPLIER;
    // const feeRecipients = String(config.FEE_RECIPIENTS).split(",");
    // const feeBps = String(config.FEE_BPS).split(",");
    // const instantExitFee = config.INSTANT_EXIT_FEE;
    // const minAmountToTriggerSwap = config.MIN_AMOUNT_TO_TRIGGER_SWAP;
  
    exercise = await ethers.deployContract(
      "DiscountExercise",
      [
        optionsTokenAddress,
        deployerAddress,
        paymentTokenAddress,
        underlyingTokenAddress,
        oracleAddress,
        multiplier,
        instantExitFee,
        minAmountToTriggerSwap,
        [feeRecipients],
        [feeBPS],
        swapProps
      ]
    );
    await exercise.waitForDeployment();
    console.log(`Exercise deployed to: ${await exercise.getAddress()}`);
  
    // Set exercise
    // const exerciseAddress = await exercise.getAddress();
    // await optionsToken.setExerciseContract(exerciseAddress, true);
    // console.log(`Exercise set to: ${exerciseAddress}`);
  // }
  // else{
  //   try{
  //     exercise = await ethers.getContractAt("DiscountExercise", config.DISCOUNT_EXERCISE);
  //   }
  //   catch(error){
  //     console.log("DiscountExercise NOT available due to lack of configuration");
  //   }

  // }


  // OptionsCompounder
  // let optionsCompounder;
  // const strats = String(config.STRATS).split(",");
  // if(contractsToDeploy.includes("OptionsCompounder")){

  //   const OptionsCompounder = await ethers.getContractFactory("OptionsCompounder");
  
  //   // console.log("Proxy deployment: ", [optionsToken, addressProvider, swapper, swapProps, oracle]);
  //   console.log("Proxy deployment: ", [await optionsToken.getAddress(), addressProvider, await swapper.getAddress(), swapProps, await oracle.getAddress(), strats]);
    
  //   optionsCompounder = await upgrades.deployProxy(
  //     OptionsCompounder,
  //     [await optionsToken.getAddress(), addressProvider, await swapper.getAddress(), swapProps, await oracle.getAddress(), strats],
  //     { kind: "uups", initializer: "initialize" }
  //   );
  
    // const optionsCompounder = await upgrades.deployProxy(
    //   OptionsCompounder,
    //   [optionsToken, addressProvider, swapper, swapProps, oracle],
    //   { kind: "uups", initializer: "initialize" }
    // );
  
  //   await optionsCompounder.waitForDeployment();
  //   console.log(`OptionsCompounder deployed to: ${await optionsCompounder.getAddress()}`);
  //   console.log(`Implementation: ${await getImplementationAddress(ethers.provider, await optionsCompounder.getAddress())}`);
  // }
  // else{
  //   try{
  //     optionsCompounder = await ethers.getContractAt("OptionsCompounder", config.OPTIONS_COMPOUNDER);
  //     await optionsCompounder.setStrats(strats);
  //   }
  //   catch(error){
  //     console.log("OptionsCompounder NOT available due to lack of configuration");
  //   }
  // }

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
