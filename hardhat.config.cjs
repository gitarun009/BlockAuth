require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/2bb2387d39ba48929207f0ee7c4cc116",
      accounts: ["ecf67c7dfa6412c9a1264084e01881e5d49700af40b8c91f62bba94ce67e2dba"] // Replace with your test wallet private key (no 0x prefix)
    }
  }
};
