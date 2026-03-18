import { type NextRequest, NextResponse } from 'next/server';
import { instance } from '@/actions/instance';

const BIRTH_DEATH_API_URL =
  process.env.BIRTH_DEATH_SERVICE || 'http://localhost:5004';

/**
 * GET /api/birth-applications/[id]/certificate
 *
 * Proxies the birth certificate PDF from the birth-death service so the
 * browser can display it inline without exposing the raw MinIO key or
 * requiring the browser to authenticate directly to the backend.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const headers = await instance();

    const response = await fetch(
      `${BIRTH_DEATH_API_URL}/birth-applications/${id}/certificate`,
      { headers, cache: 'no-store' }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Certificate not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: 'Failed to fetch certificate' },
        { status: response.status }
      );
    }

    const arrayBuffer = await response.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="birth-certificate-${id}.pdf"`,
        'Cache-Control': 'private, no-cache'
      }
    });
  } catch (error) {
    console.error('[GET /api/birth-applications/[id]/certificate]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
