import { NextRequest, NextResponse } from 'next/server';
import { computeSha256 } from '@/lib/hashing';
import { hederaClient } from '@/lib/hedera';
import { HPKProvenancePayload, RegisterProvenanceRequest } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body: RegisterProvenanceRequest = await req.json();

    if (!body.artifactId || !body.artifactTitle || body.content === undefined) {
      return NextResponse.json(
        { error: 'Missing mandatory fields: artifactId, artifactTitle, and content are required.' },
        { status: 400 }
      );
    }

    // 1. Calculate deterministic SHA-256
    const { hash: contentHash, byteLength, canonicalString } = computeSha256(body.content);

    // 2. Build minimal public provenance payload
    const payload: HPKProvenancePayload = {
      schema: 'hpk.provenance.v1',
      artifactId: body.artifactId.trim(),
      artifactType: body.artifactType || 'document',
      artifactTitle: body.artifactTitle.trim(),
      artifactVersion: body.artifactVersion?.trim() || '1.0.0',
      hashAlgorithm: 'SHA-256',
      contentHash,
      timestamp: new Date().toISOString(),
      privacy: body.privacy || 'public-provenance',
      source: 'Hedera Provenance Kit',
      actorId: body.actorId || 'HPK_OPERATOR'
    };

    // 3. Anchor to Hedera Consensus Service
    const anchorResult = await hederaClient.submitProvenance(payload);

    return NextResponse.json({
      success: true,
      record: {
        id: `prv-${Date.now()}`,
        schema: 'hpk.provenance.v1',
        artifactId: payload.artifactId,
        artifactType: payload.artifactType,
        artifactTitle: payload.artifactTitle,
        artifactVersion: payload.artifactVersion,
        contentHash,
        hashAlgorithm: 'SHA-256',
        canonicalString,
        privacy: payload.privacy,
        network: hederaClient.getStatus().network,
        topicId: anchorResult.topicId,
        sequenceNumber: anchorResult.sequenceNumber,
        transactionId: anchorResult.transactionId,
        formattedTransactionId: anchorResult.formattedTransactionId,
        consensusTimestamp: anchorResult.consensusTimestamp,
        runningHash: anchorResult.runningHash,
        hashscanUrl: anchorResult.hashscanUrl,
        mirrorNodeEndpoint: `https://testnet.mirrornode.hedera.com/api/v1/topics/${anchorResult.topicId}/messages/${anchorResult.sequenceNumber}`,
        verificationStatus: 'VERIFIED',
        lastVerifiedAt: new Date().toISOString(),
        isMock: anchorResult.isMock,
        metadata: {
          ...body.metadata,
          byteLength
        }
      }
    });

  } catch (err: any) {
    console.error('Provenance registration error:', err);
    return NextResponse.json({ error: err.message || 'Registration failed' }, { status: 500 });
  }
}
