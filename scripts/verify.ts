const hre = require('hardhat');
import { ethers } from 'hardhat';
// import * as addresses from '../addresses.json';


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


async function main() {
  await hre.run('verify:verify', {
    address: "0x3dfa8693acFe64aC38d60c808e63624204d2035c",
    constructorArguments: [
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
  })
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});