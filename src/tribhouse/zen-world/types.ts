// =========================================================================
// ZEN WORLD: SOVEREIGN DIGITAL LIBRARY & FEDERATED CONNECTED NODES
// Types for Zen Online Reading, Connected Libraries, Threat & Virus Scans
// =========================================================================

export type LibraryNodeType = 
  | 'TEMPLE_VAULT' 
  | 'MONASTERY_ARCHIVE' 
  | 'UNIVERSITY_CENTER' 
  | 'FEDERATED_COMMONS' 
  | 'HERMITAGE_NODE';

export interface ConnectedLibrary {
  id: string;
  name: string;
  nativeScript?: string;
  location: string;
  country: string;
  flag: string;
  nodeType: LibraryNodeType;
  status: 'ONLINE' | 'SYNCING' | 'SECURED';
  latencyMs: number;
  protocol: string;
  collectionCount: number;
  description: string;
  trustScore: number;
  lastSync: string;
  shaCertificateFingerprint: string;
  accentColor: string;
}

export type ZenCategory = 
  | 'ALL'
  | 'FOUNDATIONAL_KOANS'
  | 'MINDFUL_LIVING'
  | 'FOREST_POETRY'
  | 'MIND_SCIENCES'
  | 'DAO_HARMONY'
  | 'PALM_LEAF_SUTRAS';

export interface ZenChapter {
  id: string;
  title: string;
  subtitle?: string;
  originalVerse?: string;
  readTimeMinutes: number;
  content: string;
  meditationPrompt?: string;
}

export interface ZenFileMeta {
  format: 'PDF' | 'EPUB' | 'MD' | 'SCROLL';
  fileSize: string;
  mimeType: string;
  originalHash: string;
  downloadName: string;
  totalWords: number;
}

export interface ZenBook {
  id: string;
  title: string;
  originalTitle?: string;
  kanjiScript?: string;
  author: string;
  authorBio?: string;
  lineage: string;
  connectedLibraryId: string;
  connectedLibraryName: string;
  category: ZenCategory;
  coverImage: string;
  year: number | string;
  scrollsOrPages: string;
  language: string;
  originalLanguage: string;
  description: string;
  quote: string;
  keyTeachings: string[];
  chapters: ZenChapter[];
  fileMeta: ZenFileMeta;
  tags: string[];
  verifiedClean: boolean;
}

export interface ThreatScanEngine {
  id: string;
  name: string;
  category: 'ANTIVIRUS' | 'HEURISTIC' | 'CDR_SANDBOX' | 'SIGNATURE' | 'INTEGRITY';
  version: string;
  status: 'PENDING' | 'SCANNING' | 'CLEAN' | 'WARNING';
  details: string;
  signatureVersion: string;
  durationMs: number;
}

export interface VirusScanReport {
  scanId: string;
  bookId: string;
  bookTitle: string;
  timestamp: string;
  threatsFound: number;
  threatScore: 'SAFE' | 'SUSPICIOUS' | 'DANGEROUS';
  macroStatus: 'NO_MACROS_FOUND' | 'DISARMED';
  embeddedScriptStatus: 'ZERO_MALICIOUS_JS' | 'SANITIZED';
  mimeValidation: 'VERIFIED_CORRECT' | 'MISMATCH_DETECTED';
  sha256Hash: string;
  digitalCertificateId: string;
  engines: ThreatScanEngine[];
  downloadUnlocked: boolean;
}

// =========================================================================
// FEDERATED MESH TYPES
// Decentralized P2P Gossip, Multi-Node Verification, & Routing Topology
// =========================================================================

export type GossipEventType = 
  | 'PEER_HANDSHAKE'
  | 'BLOCK_CONSENSUS'
  | 'CATALOG_MANIFEST_SYNC'
  | 'ZERO_DAY_THREAT_UPDATE'
  | 'KEY_ROTATION'
  | 'NODE_JOIN';

export interface MeshGossipPacket {
  id: string;
  timestamp: string;
  eventType: GossipEventType;
  sourceNodeId: string;
  sourceNodeName: string;
  targetNodeId?: string;
  targetNodeName?: string;
  blockHeight: number;
  payloadDigest: string;
  message: string;
  bytesTransferred: number;
  verified: boolean;
}

export interface MeshTopologyLink {
  id: string;
  sourceId: string;
  targetId: string;
  bandwidthMbps: number;
  protocol: string;
  activeLatencyMs: number;
  state: 'ACTIVE' | 'SYNCING' | 'IDLE';
}

export interface MeshHealthMetrics {
  totalNodes: number;
  activePeers: number;
  avgLatencyMs: number;
  meshReliability: number; // e.g. 99.98%
  totalManuscriptsIndexed: number;
  currentBlockHeight: number;
  totalGossipPackets: number;
  zeroTrustScore: number;
}

