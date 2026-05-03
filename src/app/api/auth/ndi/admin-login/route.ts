import { NextResponse } from 'next/server';

// NDI login is disabled in demo mode
export async function POST() {
  return NextResponse.json(
    { error: 'NDI login is not available in demo mode' },
    { status: 503 }
  );
}
