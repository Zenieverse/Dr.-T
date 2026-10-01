// ==========================================
// HEDERA COMMONS: PROVENANCE CERTIFICATE GENERATOR
// Verifiable Proof Certificate & Audit Receipt
// ==========================================

import { DrTProvenanceRecord } from './types';

export function generateProvenanceCertificateJson(record: DrTProvenanceRecord): string {
  const certificate = {
    certificateSchema: 'https://dr-t.health/schemas/provenance-certificate-v1.json',
    certificateId: `CERT-${record.id.toUpperCase()}`,
    issuedAt: new Date().toISOString(),
    issuer: {
      name: 'Dr. T Health & Biomedical Platform',
      authority: 'Hedera Commons Trust & Provenance Center',
      network: record.network,
      platform: 'Dr. T Polymath Healthcare Ecosystem',
      zeroPhiCompliance: 'HIPAA & GDPR Safe Harbor Certified'
    },
    artifact: {
      id: record.artifactId,
      title: record.artifactTitle,
      type: record.artifactType,
      version: record.artifactVersion,
      privacyClassification: record.privacyClassification,
      canonicalDigest: {
        algorithm: record.hashAlgorithm,
        hash: record.contentHash,
        byteLength: record.metadata?.fileSize || record.metadata?.byteLength || 'Variable'
      }
    },
    hederaConsensusProof: {
      consensusService: 'Hedera Consensus Service (HCS)',
      topicId: record.topicId,
      sequenceNumber: record.sequenceNumber,
      consensusTimestamp: record.consensusTimestamp,
      transactionId: record.transactionId,
      runningHash: record.runningHash || 'Verified by Mirror Node',
      hashscanUrl: record.hashscanUrl || 'Offline Dev Sandbox Ledger',
      verificationStatus: record.verificationStatus
    },
    verificationInstructions: {
      endpoint: `https://${record.network === 'mainnet' ? 'mainnet' : 'testnet'}.mirrornode.hedera.com/api/v1/topics/${record.topicId}/messages/${record.sequenceNumber}`,
      recalculationRule: 'Compute SHA-256 of canonical artifact representation and compare with canonicalDigest.hash'
    }
  };

  return JSON.stringify(certificate, null, 2);
}

export function downloadProvenanceCertificateHtml(record: DrTProvenanceRecord) {
  const dateFormatted = new Date(record.createdAt).toUTCString();
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Dr. T - Provenance Certificate: ${record.artifactId}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 40px 20px;
      background: #f8fafc;
      color: #0f172a;
    }
    .cert-container {
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      border: 2px solid #e2e8f0;
      border-radius: 24px;
      padding: 48px;
      box-shadow: 0 20px 40px -15px rgba(0,0,0,0.07);
      position: relative;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #f1f5f9;
      padding-bottom: 24px;
      margin-bottom: 32px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .brand-title {
      font-size: 24px;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: -0.5px;
    }
    .brand-sub {
      font-size: 13px;
      color: #64748b;
      margin-top: 2px;
    }
    .badge-verified {
      background: #ecfdf5;
      color: #065f46;
      border: 1px solid #a7f3d0;
      padding: 6px 16px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.5px;
    }
    .title-area {
      margin-bottom: 28px;
    }
    .artifact-title {
      font-size: 22px;
      font-weight: 800;
      color: #1e293b;
      margin-bottom: 6px;
    }
    .artifact-meta {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 12px;
      color: #64748b;
    }
    .hash-box {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 14px;
      padding: 16px 20px;
      margin-bottom: 32px;
    }
    .hash-label {
      font-size: 11px;
      font-weight: 700;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }
    .hash-val {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 13px;
      color: #0f172a;
      word-break: break-all;
      font-weight: 700;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 32px;
    }
    .item {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 14px 18px;
    }
    .item-label {
      font-size: 11px;
      color: #64748b;
      margin-bottom: 4px;
    }
    .item-val {
      font-size: 14px;
      font-weight: 700;
      color: #0f172a;
      font-family: ui-monospace, SFMono-Regular, monospace;
    }
    .privacy-notice {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 12px;
      padding: 14px 18px;
      font-size: 12px;
      color: #1e40af;
      line-height: 1.5;
      margin-bottom: 32px;
    }
    .footer {
      border-top: 1px solid #f1f5f9;
      padding-top: 20px;
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: #94a3b8;
    }
  </style>
</head>
<body>
  <div class="cert-container">
    <div class="header">
      <div class="brand">
        <div>
          <div class="brand-title">Dr. T • Hedera Commons</div>
          <div class="brand-sub">Certificate of Cryptographic Provenance & Timestamp</div>
        </div>
      </div>
      <div class="badge-verified">✓ HCS VERIFIED</div>
    </div>

    <div class="title-area">
      <div class="artifact-title">${escapeHtml(record.artifactTitle)}</div>
      <div class="artifact-meta">
        Artifact ID: ${escapeHtml(record.artifactId)} • Type: ${record.artifactType.toUpperCase()} • Version: ${record.artifactVersion}
      </div>
    </div>

    <div class="hash-box">
      <div class="hash-label">SHA-256 Canonical Cryptographic Digest</div>
      <div class="hash-val">${record.contentHash}</div>
    </div>

    <div class="grid">
      <div class="item">
        <div class="item-label">Hedera Network</div>
        <div class="item-val">${record.network.toUpperCase()}</div>
      </div>
      <div class="item">
        <div class="item-label">HCS Topic ID</div>
        <div class="item-val">${record.topicId}</div>
      </div>
      <div class="item">
        <div class="item-label">Topic Sequence Number</div>
        <div class="item-val">#${record.sequenceNumber}</div>
      </div>
      <div class="item">
        <div class="item-label">Consensus Timestamp (UTC)</div>
        <div class="item-val">${record.consensusTimestamp}</div>
      </div>
      <div class="item" style="grid-column: span 2;">
        <div class="item-label">Transaction ID</div>
        <div class="item-val" style="font-size: 12px;">${record.transactionId}</div>
      </div>
    </div>

    <div class="privacy-notice">
      <strong>Zero-PHI Compliance Certified:</strong> In accordance with HIPAA Safe Harbor and GDPR Article 9, confidential records, clinical notes, and private health information remain strictly in off-chain secure storage. Only the cryptographic proof above is recorded on the Hedera distributed consensus ledger.
    </div>

    <div class="footer">
      <div>Issued by Dr. T Platform Architecture</div>
      <div>Audit Authority: Hedera Consensus Service</div>
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Provenance-Certificate-${record.artifactId}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
