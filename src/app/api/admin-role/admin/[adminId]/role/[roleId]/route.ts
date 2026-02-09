import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE || 'http://localhost:5001';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { adminId: string; roleId: string } }
) {
  try {
    const session = await auth();

    if (!session?.accessToken) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { adminId, roleId } = params;

    // Call the backend DELETE endpoint: /admin-role/admin/:adminId/role/:roleId
    const response = await fetch(
      `${AUTH_SERVICE_URL}/admin-role/admin/${adminId}/role/${roleId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.message || 'Failed to remove role from admin'
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: data.message || 'Role removed successfully'
    });
  } catch (error) {
    console.error(
      '[DELETE /api/admin-role/admin/[adminId]/role/[roleId]] Error:',
      error
    );
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  }
}
