import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

/**
 * DELETE /api/admin/[id]/roles/[roleId]
 * Remove a role from an admin
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; roleId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: adminId, roleId } = await params;
    const authServiceUrl =
      process.env.AUTH_SERVICE_URL || 'http://localhost:5001';

    // First, get the admin-role relationship ID
    const rolesResponse = await fetch(
      `${authServiceUrl}/admin/${adminId}/roles`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!rolesResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch admin roles' },
        { status: rolesResponse.status }
      );
    }

    const rolesData = await rolesResponse.json();
    const adminRole = rolesData.roles?.find((r: any) => r.role?.id === roleId);

    if (!adminRole) {
      return NextResponse.json(
        { error: 'Role not found for this admin' },
        { status: 404 }
      );
    }

    // Delete the admin-role relationship
    const deleteResponse = await fetch(
      `${authServiceUrl}/admin-role/${adminRole.id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!deleteResponse.ok) {
      const errorText = await deleteResponse.text();
      console.error('Auth service error:', errorText);
      return NextResponse.json(
        { error: `Failed to remove role: ${deleteResponse.status}` },
        { status: deleteResponse.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Role removed successfully'
    });
  } catch (error) {
    console.error('Error removing role:', error);
    return NextResponse.json(
      { error: 'Failed to remove role' },
      { status: 500 }
    );
  }
}
