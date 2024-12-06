import '@nomicfoundation/hardhat-toolbox';
import 'dotenv/config';
import '@openzeppelin/hardhat-upgrades';
import { HardhatUserConfig } from 'hardhat/types';
const fs = require('fs');

const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY;

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.23",
        settings: {
          optimizer: { enabled: true, runs: 200 },
        },
      },
      {
        version: "0.8.17",
        settings: {
          optimizer: { enabled: true, runs: 200 },
        },
      },
      {
        version: '0.7.5',
        settings: {
          optimizer: { enabled: true, runs: 200 },
        },
      },
      {
        version: '0.6.12',
        settings: {
          optimizer: { enabled: true, runs: 200 },
        },
      },
      {
        version: '0.6.6',
        settings: {
          optimizer: { enabled: true, runs: 200 },
        },
      }
    ],
  },
  networks: {
    optimism: {
      url: `https://practical-distinguished-liquid.optimism.quiknode.pro/5ba91236248cf53ba23d21e3053392c98859b488`,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    arbitrum: {
      url: `https://newest-skilled-orb.arbitrum-mainnet.quiknode.pro`,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    base: {
      url: `https://black-virulent-bridge.base-mainnet.quiknode.pro/7f957b1ba6611d10b0d94af6774ec569ae5fdd9b`,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    linea: {
      url: `https://rpc.linea.build`,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    fantom: {
      url: `https://twilight-green-season.fantom.quiknode.pro`,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    metis: {
      url: `https://andromeda.metis.io/?owner=1088`,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    bsc: {
      url: `https://binance.llamarpc.com`,
      accounts: [`0x${PRIVATE_KEY}`],
      gasPrice: 3000000000
    },
    avalanche: {
      url: `https://api.avax.network/ext/bc/C/rpc`,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    ethereum: {
      url: `https://fabled-omniscient-morning.quiknode.pro`,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    mode: {
      url: `https://mainnet.mode.network`,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    horizen: {
      url: `https://eon-rpc.horizenlabs.io/ethv1`,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    mantle: {
      url: `https://rpc.mantle.xyz/`,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    fraxtal: {
      url: `https://rpc.frax.com/`,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    scroll: {
      url: `https://rpc.scroll.io/`,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    camp: {
      url: `https://rpc-campnetwork.xyz`,
      accounts: [`0x${PRIVATE_KEY}`],
    }
  },
  etherscan: {
    apiKey: {
      optimisticEthereum: 'RQSEH3I7U7BJ49AGQWJP7BI3UG5GVDQ6CJ',
      arbitrumOne: '61TQ5142RIE81XQGY18JSV6XXWTP5I4P6J',
      base: '18GK6W4J9K7BDSMUSN987K14GWVUPKHVYC',
      linea: '96HBV63KSCAR33B9JQYG95JTIWHPRAJ6RQ',
      opera: '9C8KVUXYJ1WD8TN1MA12Y13WWV466361T6',
      metis: 'api-key',
      bsc: '747QHRDDIKV3VD9YQTJBX8TI6CYF7HZJRZ',
      avalanche: '627R3DXTXY49ACS46ZQJZPUPV8EEXI23P6',
      mainnet: 'KBSC8DJQJKXMG1KNV8J5Y77GRACUBMP16Y',
      mode: 'ABC123ABC123ABC123ABC123ABC123ABC1',
      horizen: 'ABC123ABC123ABC123ABC123ABC123ABC1',
      mantle: 'ABC123ABC123ABC123ABC123ABC123ABC1',
      fraxtal: '1REHCNBXZJ6HJJDSMST6THFGH8G45SP61M',
      scroll: 'N71W5629XJM2S3NPVPQQ3HG869SU62AAX8',
      camp: 'ABC123ABC123ABC123ABC123ABC123ABC1'
    },
    customChains: [
      {
        network: 'metis',
        chainId: 1088,
        urls: {
          apiURL: 'https://andromeda-explorer.metis.io/api',
          browserURL: 'https://andromeda-explorer.metis.io'
        }
      },
      {
        network: 'base',
        chainId: 8453,
        urls: {
          apiURL: 'https://api.basescan.org/api',
          browserURL: 'https://basescan.org'
        }
      },
      {
        network: 'linea',
        chainId: 59144,
        urls: {
          apiURL: 'https://api.lineascan.build/api',
          browserURL: 'https://lineascan.build'
        }
      },
      {
        network: 'mode',
        chainId: 34443,
        urls: {
          apiURL: 'https://explorer.mode.network/api',
          browserURL: 'https://explorer.mode.network'
        }
      },
      {
        network: 'horizen',
        chainId: 7332,
        urls: {
          apiURL: 'https://eon-explorer.horizenlabs.io/api',
          browserURL: 'https://eon-explorer.horizenlabs.io/'
        }
      },
      {
        network: 'mantle',
        chainId: 5000,
        urls: {
          apiURL: 'https://explorer.mantle.xyz/api',
          browserURL: 'https://explorer.mantle.xyz/'
        }
      },
      {
        network: 'fraxtal',
        chainId: 252,
        urls: {
          apiURL: 'https://api.fraxscan.com/api',
          browserURL: 'https://fraxscan.com/'
        }
      },
      {
        network: 'scroll',
        chainId: 534352,
        urls: {
          apiURL: 'https://api.scrollscan.com/api',
          browserURL: 'https://scrollscan.com/'
        }
      },
      {
        network: 'camp',
        chainId: 325000,
        urls: {
          apiURL: 'https://camp-network-testnet.blockscout.com/api',
          browserURL: 'https://camp-network-testnet.blockscout.com/'
        }
      },
      {
        network: 'bsc',
        chainId: 56,
        urls: {
          apiURL: 'https://api.bscscan.com/api',
          browserURL: 'https://bscscan.com/'
        }
      }
    ]
  },
  paths: {
    // sources: './contracts',
    sources: "./src",
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
};

export default config;