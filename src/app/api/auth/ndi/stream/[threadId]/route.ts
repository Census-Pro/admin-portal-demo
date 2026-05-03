import { NextResponse } from 'next/server';

// NDI stream is disabled in demo mode
export async function GET() {
  return NextResponse.json(
    { error: 'NDI stream is not available in demo mode' },
    { status: 503 }
  );
}
