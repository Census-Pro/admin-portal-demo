'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { IconShield } from '@tabler/icons-react';
import { getRoles, assignRoleToAdmin } from '@/actions/common/role-actions';
import {
  getAdminRoles,
  removeRoleFromAdmin
} from '@/actions/common/admin-actions';
import { useRouter } from 'next/navigation';

interface UserRolesSectionProps {
  userId: string;
  user: {
    roleType?: string;
  };
}

interface Role {
  id: string;
  name: string;
  description?: string;
}

export function UserRolesSection({ userId, user }: UserRolesSectionProps) {
  const router = useRouter();
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [userRoleIds, setUserRoleIds] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const isSuperAdmin = user.roleType === 'SUPER_ADMIN';

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all available roles
        const rolesResult = await getRoles();
        if (rolesResult.success) {
          setAllRoles(rolesResult.data || []);
        }

        // Fetch user's current roles
        const userRolesResult = await getAdminRoles(userId);
        if (userRolesResult.success) {
          const roleIds = userRolesResult.data?.map((r: Role) => r.id) || [];
          setUserRoleIds(roleIds);
          // If super admin, select all available roles
          if (isSuperAdmin) {
            setSelectedRoles(rolesResult.data?.map((r: Role) => r.id) || []);
          } else {
            setSelectedRoles(roleIds);
          }
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast.error('Failed to load roles');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, user]);

  const handleRoleToggle = (roleId: string) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const rolesToAdd = selectedRoles.filter(
        (id) => !userRoleIds.includes(id)
      );
      const rolesToRemove = userRoleIds.filter(
        (id) => !selectedRoles.includes(id)
      );

      // Remove roles
      for (const roleId of rolesToRemove) {
        const result = await removeRoleFromAdmin({ adminId: userId, roleId });
        if (!result.success) {
          throw new Error(result.error || 'Failed to remove role');
        }
      }

      // Add roles
      for (const roleId of rolesToAdd) {
        const result = await assignRoleToAdmin({ adminId: userId, roleId });
        if (!result.success) {
          throw new Error(result.error || 'Failed to add role');
        }
      }

      toast.success('Roles updated successfully');

      // Refresh data
      router.refresh();
    } catch (error) {
      console.error('Failed to update roles:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to update roles'
      );
      // Reset to original state on error
      setSelectedRoles(userRoleIds);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setSelectedRoles(userRoleIds);
  };

  const hasChanges =
    JSON.stringify([...selectedRoles].sort()) !==
    JSON.stringify([...userRoleIds].sort());

  if (loading) {
    return (
      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center gap-2">
          <IconShield className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Role Assignments</h3>
        </div>
        <div className="text-muted-foreground mt-4 text-center text-sm">
          Loading roles...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border p-6">
      <div className="mb-4 flex items-center gap-2">
        <IconShield className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Role Assignments</h3>
      </div>

      <p className="text-muted-foreground mb-4 text-sm">
        {user.roleType === 'SUPER_ADMIN'
          ? 'Super Admin has access to all roles and permissions by default'
          : 'Select roles to grant this user access to specific features and permissions'}
      </p>

      {allRoles.length === 0 ? (
        <div className="text-muted-foreground rounded-lg border border-dashed p-8 text-center text-sm">
          No roles available. Create roles first from Role Management.
        </div>
      ) : (
        <>
          <div className="mb-6 flex flex-wrap gap-3">
            {allRoles.map((role) => (
              <div
                key={role.id}
                className={`hover:bg-muted/50 inline-flex items-center space-x-3 rounded-lg border px-4 py-3 transition-colors ${
                  selectedRoles.includes(role.id)
                    ? 'border-primary bg-primary/5'
                    : ''
                }`}
              >
                <Checkbox
                  id={`role-${role.id}`}
                  checked={selectedRoles.includes(role.id)}
                  onCheckedChange={() => handleRoleToggle(role.id)}
                  disabled={saving || user.roleType === 'SUPER_ADMIN'}
                />
                <Label
                  htmlFor={`role-${role.id}`}
                  className="cursor-pointer text-sm font-medium"
                >
                  {role.name}
                </Label>
              </div>
            ))}
          </div>

          {hasChanges && (
            <div className="flex justify-end gap-2 border-t pt-4">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
