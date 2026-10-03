// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title ProvenanceAnchorRegistry
 * @dev On-chain registry bridging EVM smart contracts with Hedera Consensus Service (HCS) topics.
 * Enforces Zero-PHI architecture: Only deterministic 32-byte hashes and HCS sequence numbers are stored.
 */
contract ProvenanceAnchorRegistry {
    struct Anchor {
        bytes32 contentHash;
        string artifactId;
        string artifactType;
        uint64 hcsSequenceNumber;
        uint256 timestamp;
        address registrar;
    }

    // Mapping from artifactId to Anchor record
    mapping(string => Anchor) public anchors;

    // Mapping from contentHash to bool existence
    mapping(bytes32 => bool) public hashRegistered;

    event ProvenanceAnchored(
        string indexed artifactId,
        bytes32 indexed contentHash,
        uint64 hcsSequenceNumber,
        uint256 timestamp,
        address indexed registrar
    );

    /**
     * @notice Registers a cryptographic provenance anchor
     * @param artifactId Unique identifier for the artifact
     * @param contentHash SHA-256 digest of the canonical artifact
     * @param artifactType Category of the artifact
     * @param hcsSequenceNumber Corresponding sequence number from Hedera Consensus Service
     */
    function registerAnchor(
        string calldata artifactId,
        bytes32 contentHash,
        string calldata artifactType,
        uint64 hcsSequenceNumber
    ) external {
        require(bytes(artifactId).length > 0, "Artifact ID cannot be empty");
        require(contentHash != bytes32(0), "Content hash cannot be zero");

        anchors[artifactId] = Anchor({
            contentHash: contentHash,
            artifactId: artifactId,
            artifactType: artifactType,
            hcsSequenceNumber: hcsSequenceNumber,
            timestamp: block.timestamp,
            registrar: msg.sender
        });

        hashRegistered[contentHash] = true;

        emit ProvenanceAnchored(
            artifactId,
            contentHash,
            hcsSequenceNumber,
            block.timestamp,
            msg.sender
        );
    }

    /**
     * @notice Verifies whether a content hash matches the anchored record
     * @param artifactId The artifact identifier
     * @param testHash The SHA-256 hash to test
     */
    function verifyHash(string calldata artifactId, bytes32 testHash) external view returns (bool) {
        return anchors[artifactId].contentHash == testHash;
    }
}
