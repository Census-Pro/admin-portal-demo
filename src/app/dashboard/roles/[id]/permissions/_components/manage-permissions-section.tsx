'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { getPermissions } from '@/actions/common/permission-actions';
import {
  assignPermissionToRole,
  getRolePermissions,
  removePermissionFromRole
} from '@/actions/common/role-actions';
import { toast } from 'sonner';
import { IconShield } from '@tabler/icons-react';

interface ManagePermissionsSectionProps {
  role: {
    id: string;
    name: string;
  };
}

interface Permission {
  id: string;
  name: string;
  description?: string;
}

export function ManagePermissionsSection({
  role
}: ManagePermissionsSectionProps) {
  const router = useRouter();
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [rolePermissionIds, setRolePermissionIds] = useState<string[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all available permissions
        const permissionsResult = await getPermissions();
        if (permissionsResult.success) {
          // Map permissions to handle different field names
          const mappedPermissions = (permissionsResult.data || []).map(
            (permission: any) => ({
              id: permission.id,
              name:
                permission.name ||
                permission.permissionName ||
                permission.permission_name ||
                'Unknown Permission',
              description: permission.description || ''
            })
          );
          setAllPermissions(mappedPermissions);
        }

        // Fetch role's current permissions
        const rolePermissionsResult = await getRolePermissions(role.id);
        console.log(
          '[ManagePermissionsSection] Role permissions result:',
          rolePermissionsResult
        );
        if (rolePermissionsResult.success) {
          // Handle different permission object structures
          const permissions = rolePermissionsResult.data || [];
          console.log(
            '[ManagePermissionsSection] Permissions array:',
            permissions
          );

          const permissionIds = permissions
            .map((p: any) => {
              // Handle different structures: direct permission object or nested in permission property
              const permissionObj = p.permission || p;
              return permissionObj.id || p.permissionId || p.id;
            })
            .filter(Boolean);

          console.log(
            '[ManagePermissionsSection] Extracted permission IDs:',
            permissionIds
          );
          setRolePermissionIds(permissionIds);
          setSelectedPermissions(permissionIds);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast.error('Failed to load permissions');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [role.id]);

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const permissionsToAdd = selectedPermissions.filter(
        (id) => !rolePermissionIds.includes(id)
      );
      const permissionsToRemove = rolePermissionIds.filter(
        (id) => !selectedPermissions.includes(id)
      );

      let successCount = 0;
      let errorCount = 0;

      // Remove permissions
      for (const permissionId of permissionsToRemove) {
        const result = await removePermissionFromRole({
          roleId: role.id,
          permissionId
        });
        if (result.success) {
          successCount++;
        } else {
          errorCount++;
          console.error('Failed to remove permission:', result.error);
        }
      }

      // Add permissions
      for (const permissionId of permissionsToAdd) {
        const result = await assignPermissionToRole({
          roleId: role.id,
          permissionId
        });
        if (result.success) {
          successCount++;
        } else {
          errorCount++;
          console.error('Failed to add permission:', result.error);
        }
      }

      if (successCount > 0) {
        toast.success(
          `Successfully updated ${successCount} permission(s) for ${role.name}`
        );
        // Refresh data by re-fetching
        setLoading(true);
        try {
          const permissionsResult = await getPermissions();
          if (permissionsResult.success) {
            const mappedPermissions = (permissionsResult.data || []).map(
              (permission: any) => ({
                id: permission.id,
                name:
                  permission.name ||
                  permission.permissionName ||
                  permission.permission_name ||
                  'Unknown Permission',
                description: permission.description || ''
              })
            );
            setAllPermissions(mappedPermissions);
          }

          const rolePermissionsResult = await getRolePermissions(role.id);
          if (rolePermissionsResult.success) {
            const permissions = rolePermissionsResult.data || [];
            const permissionIds = permissions
              .map((p: any) => {
                const permissionObj = p.permission || p;
                return permissionObj.id || p.permissionId || p.id;
              })
              .filter(Boolean);
            setRolePermissionIds(permissionIds);
            setSelectedPermissions(permissionIds);
          }
        } finally {
          setLoading(false);
        }
        router.refresh();
      }

      if (errorCount > 0) {
        toast.error(`Failed to update ${errorCount} permission(s)`);
      }

      if (successCount === 0 && errorCount === 0) {
        toast.info('No changes to save');
      }
    } catch (error) {
      console.error('Failed to update permissions:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to update permissions'
      );
      // Reset to original state on error
      setSelectedPermissions(rolePermissionIds);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setSelectedPermissions(rolePermissionIds);
    router.push('/dashboard/roles');
  };

  const hasChanges =
    JSON.stringify([...selectedPermissions].sort()) !==
    JSON.stringify([...rolePermissionIds].sort());

  if (loading) {
    return (
      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center gap-2">
          <IconShield className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Loading Permissions...</h3>
        </div>
        <div className="text-muted-foreground mt-4 text-center text-sm">
          Please wait while we load the permissions...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border p-6">
      <div className="mb-4 flex items-center gap-2">
        <IconShield className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Available Permissions</h3>
      </div>

      <p className="text-muted-foreground mb-6 text-sm">
        {allPermissions.length} permission(s) available. Select the permissions
        you want to assign to this role.
      </p>

      {allPermissions.length === 0 ? (
        <div className="text-muted-foreground rounded-lg border border-dashed p-8 text-center text-sm">
          No permissions available. Create permissions first from Permission
          Management.
        </div>
      ) : (
        <>
          <div className="mb-6 flex flex-wrap gap-2">
            {allPermissions.map((permission) => {
              const isSelected = selectedPermissions.includes(permission.id);
              return (
                <div
                  key={permission.id}
                  className={`hover:bg-muted/50 inline-flex items-center gap-2 rounded-md border px-3 py-2 transition-colors ${
                    isSelected ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  <Checkbox
                    id={`permission-${permission.id}`}
                    checked={isSelected}
                    onCheckedChange={() =>
                      handlePermissionToggle(permission.id)
                    }
                    disabled={saving}
                  />
                  <Label
                    htmlFor={`permission-${permission.id}`}
                    className="cursor-pointer text-sm leading-none font-medium"
                  >
                    {permission.name}
                  </Label>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between border-t pt-4">
            <p className="text-muted-foreground text-sm">
              Selected: {selectedPermissions.length} of {allPermissions.length}{' '}
              permission(s)
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving || !hasChanges}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
