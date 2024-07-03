import { ethers, upgrades } from "hardhat";
import { getImplementationAddress } from '@openzeppelin/upgrades-core';
import config from './config.json';

async function main() {
  const thenaPair = config.ORACLE_SOURCE;
  const targetToken = config.OT_UNDERLYING_TOKEN;
  const owner = config.OWNER;
  const secs = config.ORACLE_SECS;
  const minPrice = config.ORACLE_MIN_PRICE;

  const strategists: string[] = [
    "0x1E71AEE6081f62053123140aacC7a06021D77348", // bongo
    "0x81876677843D00a7D792E1617459aC2E93202576", // degenicus
    "0x4C3490dF15edFa178333445ce568EC6D99b5d71c", // eidolon
    "0xb26cd6633db6b0c9ae919049c1437271ae496d15", // zokunei
    "0x60BC5E0440C867eEb4CbcE84bB1123fad2b262B1", // goober
  ];
  const multisigRoles: string[] = [
    "0x90c75c11735A7eeeD06E993fC7aF6838d86A1Ba7", // super admin
    "0xC17DfA7Eb4300871D5f022c107E07F98c750472e", // admin
    "0x30d65Ae22BBbe44208Dd8964DDE31Def0Fc1B9ee", // guardian
  ];

  const veloRouter = "0x3a63171DD9BebF4D07BC782FECC7eb0b890C2A45";
  const addressProvider = "0xEDc83309549e36f3c7FD8c2C5C54B4c8e5FA00FC";

  // ReaperSwapper
  const Swapper = await ethers.getContractFactory("ReaperSwapper");
  const initializerArguments = [
    strategists,
    multisigRoles[2],
    multisigRoles[0],
  ];
  const swapper = await upgrades.deployProxy(
    Swapper,
    initializerArguments,
    { kind: "uups", timeout: 0 },
  );

  await swapper.waitForDeployment();
  console.log("Swapper deployed to:", await swapper.getAddress());

  //Oracle
  const oracle = await ethers.deployContract(
    "ThenaOracle",
    [thenaPair, targetToken, owner, secs, minPrice]
  );
  await oracle.waitForDeployment();
  console.log(`Oracle deployed to: ${await oracle.getAddress()}`);
  
  // OptionsToken
  const tokenName = config.OT_NAME;
  const symbol = config.OT_SYMBOL;
  const tokenAdmin = config.OT_TOKEN_ADMIN;
  const OptionsToken = await ethers.getContractFactory("OptionsToken");
  const optionsToken = await upgrades.deployProxy(
    OptionsToken,
    [tokenName, symbol, tokenAdmin],
    { kind: "uups", initializer: "initialize" }
  );

  await optionsToken.waitForDeployment();
  console.log(`OptionsToken deployed to: ${await optionsToken.getAddress()}`);
  console.log(`Implementation: ${await getImplementationAddress(ethers.provider, await optionsToken.getAddress())}`);

  // Exercise
  const paymentToken = config.OT_PAYMENT_TOKEN;
  const multiplier = config.MULTIPLIER;
  const feeRecipients = String(config.FEE_RECIPIENTS).split(",");
  const feeBps = String(config.FEE_BPS).split(",");
  const instantExitFee = config.INSTANT_EXIT_FEE;
  const minAmountToTriggerSwap = config.MIN_AMOUNT_TO_TRIGGER_SWAP;

  const swapProps = {
    swapper: await swapper.getAddress(),
    exchangeAddress: veloRouter,
    exchangeTypes: 2, /* VeloSolid */
    maxSwapSlippage: 500 /* 5% */
  };

  const exercise = await ethers.deployContract(
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

  //OptionsCompounder
  // const swapper = "0xe9A46021305B67Dbd6b35a4277FF0207E29320C2";
  // const oracle = "0xd36917a9e3a3bAE753b9503B251640703500aAFE";//await ethers.getContractAt("IOracle", "0xd36917a9e3a3bAE753b9503B251640703500aAFE");
  // const optionsToken = "0xe3F95Bc8Fd7b54C4D7a464A44b47E0e7d17F3940";

  const OptionsCompounder = await ethers.getContractFactory("OptionsCompounder");
  
  // console.log("Proxy deployment: ", [optionsToken, addressProvider, swapper, swapProps, oracle]);
  console.log("Proxy deployment: ", [await optionsToken.getAddress(), addressProvider, await swapper.getAddress(), swapProps, await oracle.getAddress()]);
  
  const optionsCompounder = await upgrades.deployProxy(
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

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
