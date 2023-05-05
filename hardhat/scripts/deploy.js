const hre = require("hardhat");

async function main() {
  const escrowContract = await hre.ethers.getContractFactory("Escrow");

  const deployedEscrowContract = await escrowContract.deploy();

  await deployedEscrowContract.deployed();

  console.log("Escrow Contract Address:", deployedEscrowContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
  console.error(error);
  process.exit(1);
})