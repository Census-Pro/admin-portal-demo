import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

/**
 * GET /api/roles/list
 * Fetch all roles without pagination
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const authServiceUrl =
      process.env.AUTH_SERVICE_URL || 'http://localhost:5001';

    const response = await fetch(`${authServiceUrl}/roles?page=1&take=100`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Auth service error:', errorText);
      return NextResponse.json(
        { error: `Failed to fetch roles: ${response.status}` },
        { status: response.status }
      );
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      data: result.data || []
    });
  } catch (error) {
    console.error('Error fetching roles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch roles' },
      { status: 500 }
    );
  }
}
