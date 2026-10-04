import { NextRequest, NextResponse } from 'next/server';
import { computeSha256 } from '@/lib/hashing';
import { hederaClient } from '@/lib/hedera';
import { verifyProvenance } from '@/lib/mirrorNode';
import { VerifyProvenanceRequest } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body: VerifyProvenanceRequest = await req.json();

    let computedHash = body.expectedHash;
    if (body.content !== undefined) {
      computedHash = computeSha256(body.content).hash;
    }

    if (!computedHash) {
      return NextResponse.json(
        { error: 'Either content or expectedHash must be provided to perform verification.' },
        { status: 400 }
      );
    }

    const topicId = hederaClient.getTopicId();
    const mirrorUrl = hederaClient.getMirrorNodeUrl();
    const network = hederaClient.getStatus().network;

    // Perform real Mirror Node verification
    const result = await verifyProvenance({
      topicId,
      expectedHash: computedHash,
      network,
      mirrorNodeUrl: mirrorUrl,
      artifactId: body.artifactId || 'UNKNOWN'
    });

    return NextResponse.json(result);

  } catch (err: any) {
    console.error('Provenance verification error:', err);
    return NextResponse.json({ error: err.message || 'Verification failed' }, { status: 500 });
  }
}
