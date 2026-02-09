import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

/**
 * PUT /api/admin/[id]/abilities
 *
 * Update an admin's abilities by assigning roles with permissions
 * This controls what the admin can see in their sidebar/menu
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: adminId } = await params;

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

    if (!canManageAdmins) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have permission to manage admins' },
        { status: 403 }
      );
    }

    const { abilities } = await request.json();

    const authServiceUrl =
      process.env.AUTH_SERVICE_URL || 'http://localhost:3000';

    // Strategy: Create/update roles based on abilities and assign to admin
    // Each unique combination of permissions becomes a role

    // Step 1: Get or create permissions for each ability
    const permissionIds: string[] = [];

    for (const ability of abilities) {
      try {
        // Try to find existing permission
        const searchResponse = await fetch(
          `${authServiceUrl}/permissions?name=${encodeURIComponent(ability.name)}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`
            }
          }
        );

        let permissionId;

        if (searchResponse.ok) {
          const existingPermissions = await searchResponse.json();
          if (existingPermissions.length > 0) {
            permissionId = existingPermissions[0].id;

            // Update existing permission
            await fetch(`${authServiceUrl}/permissions/${permissionId}`, {
              method: 'PATCH',
              headers: {
                Authorization: `Bearer ${session.accessToken}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                name: ability.name,
                description: `Auto-generated permission for ${ability.name}`,
                actions: ability.action,
                subjects: ability.subject
              })
            });
          }
        }

        if (!permissionId) {
          // Create new permission
          const createResponse = await fetch(`${authServiceUrl}/permissions`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: ability.name,
              description: `Auto-generated permission for ${ability.name}`,
              actions: ability.action,
              subjects: ability.subject
            })
          });

          if (createResponse.ok) {
            const newPermission = await createResponse.json();
            permissionId = newPermission.id;
          }
        }

        if (permissionId) {
          permissionIds.push(permissionId);
        }
      } catch (error) {
        console.error(
          `Error creating/updating permission for ${ability.name}:`,
          error
        );
      }
    }

    // Step 2: Create or get a custom role for this admin
    const roleName = `Custom_Role_${adminId.substring(0, 8)}`;
    let roleId;

    // Try to find existing role
    const roleSearchResponse = await fetch(
      `${authServiceUrl}/roles?name=${encodeURIComponent(roleName)}`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`
        }
      }
    );

    if (roleSearchResponse.ok) {
      const existingRoles = await roleSearchResponse.json();
      if (existingRoles.length > 0) {
        roleId = existingRoles[0].id;
      }
    }

    if (!roleId) {
      // Create new role
      const createRoleResponse = await fetch(`${authServiceUrl}/roles`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: roleName,
          description: `Custom role with assigned abilities`
        })
      });

      if (createRoleResponse.ok) {
        const newRole = await createRoleResponse.json();
        roleId = newRole.id;
      }
    }

    // Step 3: Assign permissions to role
    if (roleId && permissionIds.length > 0) {
      await fetch(`${authServiceUrl}/role-permission/assign`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          roleId,
          permissionIds
        })
      });
    }

    // Step 4: Clear existing roles and assign new role to admin
    // First, get current roles
    const currentRolesResponse = await fetch(
      `${authServiceUrl}/admin/${adminId}/roles`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`
        }
      }
    );

    if (currentRolesResponse.ok) {
      const currentRolesData = await currentRolesResponse.json();

      // Remove all non-system roles (keep SUPER_ADMIN if exists)
      for (const roleAssignment of currentRolesData.roles || []) {
        if (!roleAssignment.role.name.includes('SUPER_ADMIN')) {
          await fetch(`${authServiceUrl}/admin-role/${roleAssignment.id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${session.accessToken}`
            }
          });
        }
      }
    }

    // Assign new role
    if (roleId) {
      await fetch(`${authServiceUrl}/admin-role/assign`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          adminId,
          roleIds: [roleId]
        })
      });
    }

    return NextResponse.json({
      success: true,
      message:
        'Abilities updated successfully. Admin will see changes on next login.'
    });
  } catch (error) {
    console.error('Error updating admin abilities:', error);
    return NextResponse.json(
      { error: 'Failed to update admin abilities' },
      { status: 500 }
    );
  }
}
