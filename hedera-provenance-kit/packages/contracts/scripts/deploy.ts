import { ethers } from "hardhat";

async function main() {
  console.log("Deploying ProvenanceAnchorRegistry contract to Hedera network...");

  const ProvenanceAnchorRegistry = await ethers.getContractFactory("ProvenanceAnchorRegistry");
  const registry = await ProvenanceAnchorRegistry.deploy();

  await registry.waitForDeployment();

  const address = await registry.getAddress();
  console.log(`ProvenanceAnchorRegistry deployed to: ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
