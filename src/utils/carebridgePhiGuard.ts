// ============================================================================
// DR. T — CAREBRIDGE SHARED PHI DETECTION & REDACTION GUARD
// Deterministic pattern detection + privacy-preserving redaction used across
// both client UI and Express / Forge server layers.
// Ensures real sensitive identifiers & clinical values are blocked/redacted
// while harmless non-patient disclaimers (e.g. "medical record number, contact")
// do not trigger false positives.
// ============================================================================

export interface CareBridgePhiMatch {
  category:
    | 'ssn'
    | 'mrn'
    | 'dob'
    | 'contact_info'
    | 'diagnosis'
    | 'lab_result'
    | 'clinical_measurement';
  reason: string;
  replacement: string;
}

export interface CareBridgePhiScanResult {
  safe: boolean;
  categories: CareBridgePhiMatch['category'][];
  warnings: string[];
  redactedText: string;
  matchCount: number;
}

interface PhiRule {
  category: CareBridgePhiMatch['category'];
  pattern: RegExp;
  reason: string;
  replacement: string;
}

const PHI_RULES: PhiRule[] = [
  {
    category: 'ssn',
    pattern: /\b(?:\d{3}-\d{2}-\d{4}|(?:ssn|social security(?:\s+number)?)\s*[:#-]?\s*(?:\*{2,3}[-\s]?\*{2}[-\s]?)?\d{4,9})\b/gi,
    reason: 'Social Security Number (SSN) pattern detected',
    replacement: '[REDACTED_SSN]',
  },
  {
    category: 'mrn',
    pattern:
      /\b(?:(?:mrn|medical record(?:\s+number|\s+id)?|med\s*rec)\s*[:#-]?\s*(?=[a-z0-9-]*\d)[a-z0-9-]{4,}|(?:mrn|medical record)\s*[:#-]\s*[a-z0-9-]{4,})\b/gi,
    reason: 'Medical Record Number (MRN) detected',
    replacement: '[REDACTED_MRN]',
  },
  {
    category: 'dob',
    pattern:
      /\b(?:dob|date of birth|born on|birth\s*date)\s*[:#-]?\s*(?:\d{1,4}[/-]\d{1,2}[/-]\d{1,4}|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\s+\d{1,2},?\s+\d{4})\b/gi,
    reason: 'Date of Birth (DOB) detected',
    replacement: '[REDACTED_DOB]',
  },
  {
    category: 'contact_info',
    pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
    reason: 'Personal email address detected',
    replacement: '[REDACTED_EMAIL]',
  },
  {
    category: 'contact_info',
    pattern:
      /(?:\b(?:phone|tel|cell|mobile)\s*[:#-]\s*)?(?:\+?1[-.\s]?)?(?:\(\d{3}\)|\b\d{3})[-.\s]\d{3}[-.\s]\d{4}\b/gi,
    reason: 'Personal phone number detected',
    replacement: '[REDACTED_PHONE]',
  },
  {
    category: 'contact_info',
    pattern:
      /\b\d{1,5}\s+(?:[A-Za-z0-9.]+\s+){1,3}(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Court|Ct|Way|Terrace|Ter|Place|Pl|Circle|Cir|Parkway|Pkwy)\b\.?(?:\s*(?:Apt|Unit|#)\s*[A-Za-z0-9-]+)?/gi,
    reason: 'Personal street address detected',
    replacement: '[REDACTED_ADDRESS]',
  },
  {
    category: 'diagnosis',
    pattern:
      /\b(?:icd-?10(?:-cm)?\s*[:#-]?\s*[a-z]\d{2}(?:\.[a-z0-9]{1,4})?|diagnosed with\s+[a-z0-9\s-]{3,32}|diagnosis\s*(?:of|:)\s*[a-z0-9\s-]{3,32}|(?:type\s*[12]\s*diabetes|hypertension|malignant|carcinoma|biopsy\s+(?:positive|negative|result|showed)|pathology\s+(?:report|positive)|prescribed\s+[a-z0-9-]+|prescription for\s+[a-z0-9-]+))\b/gi,
    reason: 'Clinical diagnosis or prescription detail detected',
    replacement: '[REDACTED_CLINICAL_NOTE]',
  },
  {
    category: 'lab_result',
    pattern:
      /\b(?:hba1c|a1c|ferritin|egfr|creatinine|hemoglobin|wbc|platelet(?:s)?|ldl|hdl|triglycerides|tsh|troponin|d-dimer|bilirubin)\s*(?:is|was|[:#=])?\s*\d+(?:\.\d+)?(?:\s*(?:%|mg\/dl|g\/dl|ng\/ml|u\/l|mmol\/l|miu\/l))?\b/gi,
    reason: 'Laboratory measurement or biomarker value detected',
    replacement: '[REDACTED_LAB_VALUE]',
  },
  {
    category: 'clinical_measurement',
    pattern:
      /\b(?:(?:bp|blood pressure)\s*(?:is|was|[:#=])?\s*\d{2,3}\s*\/\s*\d{2,3}(?:\s*mmhg)?|\d{2,3}\s*\/\s*\d{2,3}\s*mmhg|(?:spo2|o2 sat|oxygen saturation|heart rate|hr|pulse|temp|temperature|bmi|glucose)\s*(?:is|was|[:#=])?\s*\d{2,3}(?:\.\d+)?(?:\s*(?:%|bpm|f|c|°f|°c|mg\/dl|mmol\/l))?|\d+(?:\.\d+)?\s*(?:mg\/dl|mmol\/l|ng\/ml|mmhg|bpm))\b/gi,
    reason: 'Clinical vital sign or measurement detected',
    replacement: '[REDACTED_CLINICAL_MEASUREMENT]',
  },
];

export function scanAndRedactCareBridgePhi(rawText: string): CareBridgePhiScanResult {
  const input = String(rawText || '');
  let redacted = input;
  const categoriesSet = new Set<CareBridgePhiMatch['category']>();
  const warningsSet = new Set<string>();
  let matchCount = 0;

  for (const rule of PHI_RULES) {
    const regex = new RegExp(rule.pattern.source, rule.pattern.flags);
    const matches = redacted.match(regex);
    if (matches && matches.length > 0) {
      matchCount += matches.length;
      categoriesSet.add(rule.category);
      warningsSet.add(rule.reason);
      redacted = redacted.replace(regex, rule.replacement);
    }
  }

  return {
    safe: matchCount === 0,
    categories: Array.from(categoriesSet),
    warnings: Array.from(warningsSet),
    redactedText: redacted,
    matchCount,
  };
}
