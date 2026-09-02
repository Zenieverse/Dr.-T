// ============================================================================
// 🩺 DR. T READIT — SECURE UNIVERSAL AI DOCUMENT READER TYPES
// "Upload it. Scan it. Dr. T reads it."
// Principle: NO UNTRUSTED FILE GOES DIRECTLY TO THE AI.
// ============================================================================

export type SecurityState = 
  | 'UPLOADING'
  | 'QUARANTINED'
  | 'VALIDATING'
  | 'SCANNING'
  | 'SCAN_FAILED'
  | 'THREAT_DETECTED'
  | 'UNSUPPORTED'
  | 'PROCESSING'
  | 'OCR_PROCESSING'
  | 'READY'
  | 'FAILED'
  | 'DELETED';

export type DocumentType = 
  | 'pdf'
  | 'docx'
  | 'xlsx'
  | 'pptx'
  | 'txt'
  | 'markdown'
  | 'csv'
  | 'rtf'
  | 'jpg'
  | 'png'
  | 'webp'
  | 'tiff'
  | 'unsupported';

export interface MagicByteCheck {
  expectedMime: string;
  detectedMime: string;
  magicHeaderHex: string;
  matchesSignature: boolean;
  notes: string;
}

export interface SecurityScanResult {
  passed: boolean;
  status: 'SAFE' | 'THREAT_DETECTED' | 'SCAN_FAILED' | 'UNSUPPORTED';
  scannerName: string;
  scannerVersion: string;
  isProductionScanner: boolean;
  threatsFound: string[];
  heuristicAlerts: string[];
  scanDurationMs: number;
  certificationMessage: string;
  timestamp: string;
  magicCheck: MagicByteCheck;
}

export interface DocumentSection {
  id: string;
  title: string;
  level: number;
  pageNumber: number;
  content: string;
}

export interface ExtractedTable {
  id: string;
  pageNumber: number;
  title?: string;
  headers: string[];
  rows: string[][];
}

export interface DocumentPage {
  pageNumber: number;
  text: string;
  headings: string[];
  tables: ExtractedTable[];
  ocrConfidence?: number; // 0 to 1
  isScannedImage?: boolean;
  wordCount: number;
}

export interface ProvenanceChunk {
  chunkId: string;
  documentId: string;
  pageNumber: number;
  section: string;
  sourcePosition: { startChar: number; endChar: number };
  text: string;
  isTable?: boolean;
}

// Medical specific extraction
export interface LabResultItem {
  name: string;
  value: string | number;
  unit: string;
  referenceRange: string;
  status: 'NORMAL' | 'LOW' | 'HIGH' | 'CRITICAL';
  pageNumber: number;
  ocrConfidence: number;
  clinicalContext?: string;
}

export interface MedicationItem {
  name: string;
  dosage: string;
  frequency: string;
  route?: string;
  pageNumber: number;
}

export interface MedicalDocumentData {
  isMedical: boolean;
  specialty?: string;
  patientName?: string;
  recordDate?: string;
  orderingPhysician?: string;
  labResults: LabResultItem[];
  medications: MedicationItem[];
  diagnosesStatedInDocument: string[];
  physicianRecommendations: string[];
  safetyDisclaimer: string;
}

export interface NormalizedDocument {
  id: string;
  userId: string;
  filename: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  detectedMimeType: string;
  sha256: string;
  type: DocumentType;
  pageCount: number;
  language: string;
  title: string;
  summary?: {
    oneSentence: string;
    fiveBullets: string[];
    detailed: string;
  };
  sections: DocumentSection[];
  pages: DocumentPage[];
  chunks: ProvenanceChunk[];
  tables: ExtractedTable[];
  metadata: {
    author?: string;
    creationDate?: string;
    modificationDate?: string;
    producer?: string;
    pageDimensions?: string;
    extractedAt: string;
  };
  securityStatus: SecurityState;
  securityScanResult: SecurityScanResult;
  medicalData?: MedicalDocumentData;
  sourceUrl?: string;
  sourceType?: 'UPLOAD' | 'URL';
  storageKey: string;
  createdAt: string;
  updatedAt: string;
}

export interface SecurityAuditRecord {
  id: string;
  documentId: string;
  filename: string;
  eventType: 
    | 'UPLOAD'
    | 'QUARANTINE'
    | 'URL_FETCH_STARTED'
    | 'URL_FETCH_COMPLETED'
    | 'URL_SSRF_BLOCKED'
    | 'URL_FETCH_FAILED'
    | 'SCAN_STARTED'
    | 'SCAN_PASSED'
    | 'SCAN_FAILED'
    | 'THREAT_DETECTED'
    | 'PROCESSING_STARTED'
    | 'PROCESSING_COMPLETED'
    | 'DOCUMENT_VIEWED'
    | 'DOCUMENT_DELETED'
    | 'PROMPT_INJECTION_DEFLECTED';
  timestamp: string;
  actor: string;
  details: string;
  sha256: string;
}

export interface ReadItChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: string;
  sources?: Array<{
    pageNumber: number;
    section: string;
    snippet: string;
  }>;
  isPromptInjectionDeflected?: boolean;
  medicalContext?: {
    whatDocumentSays: string;
    drTExplanation: string;
  };
}

export interface ReadItLimitsConfig {
  maxUploadSizeBytes: number; // e.g. 50 MB
  maxPageCount: number; // e.g. 300 pages
  maxProcessingTimeMs: number;
  maxOcrTimeMs: number;
  maxConcurrentDocuments: number;
  retentionDays: number;
  allowedExtensions: string[];
}

export interface ReadAloudState {
  isPlaying: boolean;
  isPaused: boolean;
  currentPage: number;
  currentChunkIndex: number;
  totalChunks: number;
  speed: number; // 0.75, 1.0, 1.25, 1.5, 2.0
  pitch: number;
  voice: string;
  language: string;
  mode: 'full' | 'page' | 'selection' | 'summary' | 'ai_reply';
  currentlySpokenText?: string;
}
