import { NextResponse } from 'next/server';
import { hederaClient } from '@/lib/hedera';

export async function GET() {
  try {
    const status = hederaClient.getStatus();
    return NextResponse.json(status);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
