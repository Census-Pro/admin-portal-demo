import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

/**
 * GET /api/admin/list
 *
 * Fetch all admins with their abilities
 * Only accessible by SUPER_ADMIN or admins with manage:admin permission
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    console.log(
      'Session:',
      session?.user?.email,
      'Role:',
      session?.user?.roleType
    );

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user can manage admins
    const canManageAdmins =
      session.user.roleType === 'SUPER_ADMIN' ||
      (session.user.ability &&
        Array.isArray(session.user.ability) &&
        session.user.ability.some((a) =>
          typeof a === 'string'
            ? a === 'manage:admin'
            : a.action?.includes('manage') &&
              (a.subject === 'Admin' || a.subject?.includes?.('Admin'))
        ));

    console.log('Can manage admins:', canManageAdmins);

    if (!canManageAdmins) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have permission to manage admins' },
        { status: 403 }
      );
    }

    // Call auth service to get all admins (without pagination)
    const authServiceUrl =
      process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
    console.log('Auth service URL:', authServiceUrl);

    const response = await fetch(`${authServiceUrl}/admin/all/list`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Auth service response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Auth service error:', errorText);
      return NextResponse.json(
        { error: `Auth service error: ${response.status} - ${errorText}` },
        { status: 500 }
      );
    }

    const data = await response.json();

    // For each admin, fetch their abilities
    const adminsWithAbilities = await Promise.all(
      data.map(async (admin: any) => {
        try {
          // Get admin roles and permissions
          const rolesResponse = await fetch(
            `${authServiceUrl}/admin/${admin.id}/roles`,
            {
              headers: {
                Authorization: `Bearer ${session.accessToken}`
              }
            }
          );

          if (rolesResponse.ok) {
            const rolesData = await rolesResponse.json();

            // Build abilities array from roles and permissions
            const abilities: any[] = [];
            const permissionsMap = new Map();

            rolesData.roles?.forEach((roleAssignment: any) => {
              roleAssignment.role?.rolePermissions?.forEach((rp: any) => {
                const permission = rp.permission;
                if (permission && !permissionsMap.has(permission.name)) {
                  abilities.push({
                    name: permission.name,
                    action: permission.actions || [],
                    subject: permission.subjects || []
                  });
                  permissionsMap.set(permission.name, true);
                }
              });
            });

            return {
              ...admin,
              roles: rolesData.roles?.map((r: any) => r.role?.name) || [],
              abilities
            };
          }

          return {
            ...admin,
            roles: [],
            abilities: []
          };
        } catch (error) {
          console.error(
            `Error fetching abilities for admin ${admin.id}:`,
            error
          );
          return {
            ...admin,
            roles: [],
            abilities: []
          };
        }
      })
    );

    return NextResponse.json({ admins: adminsWithAbilities });
  } catch (error) {
    console.error('Error fetching admins:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admins' },
      { status: 500 }
    );
  }
}
