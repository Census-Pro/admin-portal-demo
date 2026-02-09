import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

/**
 * GET /api/admin/[id]/roles
 * Get all roles assigned to an admin
 * Note: The backend doesn't have a dedicated /admin/{id}/roles endpoint
 * Instead, we fetch the full admin object which includes adminRoles
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: adminId } = await params;
    const authServiceUrl =
      process.env.AUTH_SERVICE_URL || 'http://localhost:5001';

    console.log(
      '[GET /api/admin/[id]/roles] Fetching from:',
      `${authServiceUrl}/admin/${adminId}`
    );

    // Fetch the full admin object which includes adminRoles relation
    const response = await fetch(`${authServiceUrl}/admin/${adminId}`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(
      '[GET /api/admin/[id]/roles] Response status:',
      response.status
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        '[GET /api/admin/[id]/roles] Auth service error:',
        errorText
      );
      return NextResponse.json(
        { error: `Failed to fetch admin: ${response.status}` },
        { status: response.status }
      );
    }

    const adminData = await response.json();

    // Return in the expected format with roles array
    return NextResponse.json({
      roles: adminData.adminRoles || []
    });
  } catch (error) {
    console.error('Error fetching admin roles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin roles' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/[id]/roles
 * Assign a role to an admin
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: adminId } = await params;
    const body = await request.json();
    const { roleId } = body;

    if (!roleId) {
      return NextResponse.json(
        { error: 'roleId is required' },
        { status: 400 }
      );
    }

    const authServiceUrl =
      process.env.AUTH_SERVICE_URL || 'http://localhost:5001';

    console.log(
      '[POST /api/admin/[id]/roles] Posting to:',
      `${authServiceUrl}/admin-role`
    );
    console.log('[POST /api/admin/[id]/roles] Body:', { adminId, roleId });

    const response = await fetch(`${authServiceUrl}/admin-role`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        adminId,
        roleId
      })
    });

    console.log(
      '[POST /api/admin/[id]/roles] Response status:',
      response.status
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        '[POST /api/admin/[id]/roles] Auth service error:',
        errorText
      );
      return NextResponse.json(
        { error: `Failed to assign role: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error assigning role:', error);
    return NextResponse.json(
      { error: 'Failed to assign role' },
      { status: 500 }
    );
  }
}
