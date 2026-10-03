import { expect } from "chai";
import { ethers } from "hardhat";

describe("ProvenanceAnchorRegistry", function () {
  it("Should register an anchor and verify matching content hash", async function () {
    const ProvenanceAnchorRegistry = await ethers.getContractFactory("ProvenanceAnchorRegistry");
    const registry = await ProvenanceAnchorRegistry.deploy();
    await registry.waitForDeployment();

    const artifactId = "art-test-spec-01";
    const sampleHash = ethers.keccak256(ethers.toUtf8Bytes("Hedera Provenance Test Data"));
    const artifactType = "research";
    const hcsSeq = 1042;

    await registry.registerAnchor(artifactId, sampleHash, artifactType, hcsSeq);

    const isMatch = await registry.verifyHash(artifactId, sampleHash);
    expect(isMatch).to.equal(true);

    const wrongHash = ethers.keccak256(ethers.toUtf8Bytes("Tampered Data"));
    const isMismatch = await registry.verifyHash(artifactId, wrongHash);
    expect(isMismatch).to.equal(false);
  });
});
