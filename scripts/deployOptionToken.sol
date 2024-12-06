// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {DiscountExercise} from "../src/exercise/DiscountExercise.sol";
import {SwapProps, ExchangeType} from "../src/helpers/SwapHelper.sol";
import {IOptionsToken} from "../src/interfaces/IOptionsToken.sol";


contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        SwapProps memory props = SwapProps({
            swapper: address(0xB207899f7eEc978Eb1B30Fd8Eb95b69d5B984B61),
            exchangeAddress: address(0x3a63171DD9BebF4D07BC782FECC7eb0b890C2A45),
            exchangeTypes: ExchangeType.VeloSolid,
            maxSwapSlippage: 500
        });

        DiscountExercise exercise = new DiscountExercise(
            address(0x3B2BEF39ad1Fca11222Ff11eC3eAF6bBb239Be80),
            address(0x63701b759EaFDcDC0817d0721603151f93e2Cffd),
            address(0xDfc7C877a950e49D2610114102175A06C2e3167a),
            address(0x95177295A394f2b9B04545FFf58f4aF0673E839d),
            address(0xDaA2c821428f62e1B08009a69CE824253CCEE5f9),
            5000,
            1000,
            1000000000000000,
            address(0xd93E25A8B1D645b15f8c736E1419b4819Ff9e6EF),
            "10000",
            props
        );

        vm.stopBroadcast();
    }
}