import { expect } from "chai";
import { ethers } from "hardhat";

describe("ProvenanceAnchorRegistry", function () {
  async function deployFixture() {
    const [owner, otherAccount] = await ethers.getSigners();
    const ProvenanceAnchorRegistry = await ethers.getContractFactory("ProvenanceAnchorRegistry");
    const registry = await ProvenanceAnchorRegistry.deploy();
    await registry.waitForDeployment();
    return { registry, owner, otherAccount };
  }

  it("1. Deployment succeeds and contract has a valid address", async function () {
    const { registry } = await deployFixture();
    const address = await registry.getAddress();
    expect(address).to.properAddress;
  });

  it("2. registerAnchor succeeds and stores correct metadata", async function () {
    const { registry, owner } = await deployFixture();
    const artifactId = "art-test-spec-01";
    const sampleHash = ethers.keccak256(ethers.toUtf8Bytes("Hedera Provenance Test Data"));
    const artifactType = "research";
    const hcsSeq = 1042;

    await registry.registerAnchor(artifactId, sampleHash, artifactType, hcsSeq);

    const anchor = await registry.anchors(artifactId);
    expect(anchor.contentHash).to.equal(sampleHash);
    expect(anchor.artifactId).to.equal(artifactId);
    expect(anchor.artifactType).to.equal(artifactType);
    expect(anchor.hcsSequenceNumber).to.equal(hcsSeq);
    expect(anchor.registrar).to.equal(owner.address);
    expect(anchor.timestamp).to.be.gt(0);
  });

  it("3. registerAnchor emits ProvenanceAnchored event with expected values", async function () {
    const { registry, owner } = await deployFixture();
    const artifactId = "art-event-spec-02";
    const sampleHash = ethers.keccak256(ethers.toUtf8Bytes("Event Verification Data"));
    const artifactType = "clinical";
    const hcsSeq = 2084;

    await expect(registry.registerAnchor(artifactId, sampleHash, artifactType, hcsSeq))
      .to.emit(registry, "ProvenanceAnchored")
      .withArgs(artifactId, sampleHash, hcsSeq, (val: any) => val > 0, owner.address);
  });

  it("4. Stored anchor can be retrieved and presence is tracked in hashRegistered", async function () {
    const { registry } = await deployFixture();
    const artifactId = "art-lookup-spec-03";
    const sampleHash = ethers.keccak256(ethers.toUtf8Bytes("Lookup Verification Data"));

    expect(await registry.hashRegistered(sampleHash)).to.equal(false);
    await registry.registerAnchor(artifactId, sampleHash, "code", 3001);
    expect(await registry.hashRegistered(sampleHash)).to.equal(true);
  });

  it("5. verifyHash returns true for matching registered hash", async function () {
    const { registry } = await deployFixture();
    const artifactId = "art-verify-spec-04";
    const sampleHash = ethers.keccak256(ethers.toUtf8Bytes("Matching Hash Data"));

    await registry.registerAnchor(artifactId, sampleHash, "model", 4001);
    const isMatch = await registry.verifyHash(artifactId, sampleHash);
    expect(isMatch).to.equal(true);
  });

  it("6. verifyHash returns false for a different or tampered hash", async function () {
    const { registry } = await deployFixture();
    const artifactId = "art-verify-spec-05";
    const sampleHash = ethers.keccak256(ethers.toUtf8Bytes("Authentic Data"));
    const tamperedHash = ethers.keccak256(ethers.toUtf8Bytes("Tampered Data"));

    await registry.registerAnchor(artifactId, sampleHash, "model", 5001);
    const isMismatch = await registry.verifyHash(artifactId, tamperedHash);
    expect(isMismatch).to.equal(false);
  });

  it("7. registerAnchor reverts if artifactId is empty", async function () {
    const { registry } = await deployFixture();
    const sampleHash = ethers.keccak256(ethers.toUtf8Bytes("Non-empty Hash"));

    await expect(
      registry.registerAnchor("", sampleHash, "data", 6001)
    ).to.be.revertedWith("Artifact ID cannot be empty");
  });

  it("8. registerAnchor reverts if contentHash is bytes32(0)", async function () {
    const { registry } = await deployFixture();

    await expect(
      registry.registerAnchor("art-invalid-01", ethers.ZeroHash, "data", 7001)
    ).to.be.revertedWith("Content hash cannot be zero");
  });
});
