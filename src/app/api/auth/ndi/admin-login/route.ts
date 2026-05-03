import { NextRequest, NextResponse } from 'next/server';

const AUTH_SERVICE = process.env.AUTH_SERVICE || 'http://localhost:5001';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('🔐 [NDI Admin Login] Forwarding request to auth service...');
    console.log('🔐 Auth Service URL:', `${AUTH_SERVICE}/auth/ndi/admin-login`);

    const response = await fetch(`${AUTH_SERVICE}/auth/ndi/admin-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    console.log('🔐 [NDI Admin Login] Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [NDI Admin Login] Request failed:', errorText);
      return NextResponse.json(
        {
          error: 'Failed to create NDI proof request',
          details: errorText
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ [NDI Admin Login] Success:', {
      hasThreadId: !!data.proofRequestThreadId,
      hasQrUrl: !!data.proofRequestURL,
      hasDeepLink: !!data.deepLinkURL
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ [NDI Admin Login] Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
