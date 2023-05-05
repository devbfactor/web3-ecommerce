require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const ALCHEMY_HTTP_URL = process.env.ALCHEMY_HTTP_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const MUMBAI_API = process.env.MUMBAI_API;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    mumbai: {
      url: ALCHEMY_HTTP_URL,
      accounts: [PRIVATE_KEY],
    }
  },
  etherscan: {
    apiKey: MUMBAI_API,
  }
};
