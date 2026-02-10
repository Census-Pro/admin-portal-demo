'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { IconShield, IconPlus } from '@tabler/icons-react';
import { getRoles, assignRoleToAdmin } from '@/actions/common/role-actions';
import {
  getAdminRoles,
  removeRoleFromAdmin
} from '@/actions/common/admin-actions';
import { useRouter } from 'next/navigation';

interface UserRolesCardProps {
  userId: string;
}

interface Role {
  id: string;
  name: string;
  description?: string;
}

export function UserRolesCard({ userId }: UserRolesCardProps) {
  const router = useRouter();
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [userRoles, setUserRoles] = useState<Role[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAssignForm, setShowAssignForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, [userId]);

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
        const roles = userRolesResult.data || [];
        setUserRoles(roles);
        setSelectedRoles(roles.map((r: Role) => r.id));
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to load roles');
    } finally {
      setLoading(false);
    }
  };

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
      const currentRoleIds = userRoles.map((r) => r.id);
      const rolesToAdd = selectedRoles.filter(
        (id) => !currentRoleIds.includes(id)
      );
      const rolesToRemove = currentRoleIds.filter(
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
      setShowAssignForm(false);

      // Refresh data
      await fetchData();
      router.refresh();
    } catch (error) {
      console.error('Failed to update roles:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to update roles'
      );
    } finally {
      setSaving(false);
    }
  };

  const hasChanges =
    JSON.stringify(selectedRoles.sort()) !==
    JSON.stringify(userRoles.map((r) => r.id).sort());

  if (loading) {
    return (
      <div className="rounded-lg border p-6">
        <div className="text-muted-foreground text-center text-sm">
          Loading roles...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-lg border p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconShield className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Assigned Roles</h3>
        </div>
        {!showAssignForm && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowAssignForm(true)}
          >
            <IconPlus className="mr-2 h-4 w-4" />
            Manage Roles
          </Button>
        )}
      </div>

      {!showAssignForm ? (
        <div className="space-y-2">
          {userRoles.length === 0 ? (
            <div className="text-muted-foreground rounded-lg border border-dashed p-8 text-center text-sm">
              <p>No roles assigned yet</p>
              <p className="mt-1 text-xs">
                Click "Manage Roles" to assign roles to this user
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {userRoles.map((role) => (
                <div
                  key={role.id}
                  className="flex items-start justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">{role.name}</p>
                    {role.description && (
                      <p className="text-muted-foreground mt-1 text-xs">
                        {role.description}
                      </p>
                    )}
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Select roles to grant this user access to specific features and
            permissions
          </p>

          {allRoles.length === 0 ? (
            <div className="text-muted-foreground rounded-lg border border-dashed p-8 text-center text-sm">
              No roles available. Create roles first from Role Management.
            </div>
          ) : (
            <div className="max-h-96 space-y-2 overflow-y-auto">
              {allRoles.map((role) => (
                <div
                  key={role.id}
                  className="hover:bg-muted/50 flex items-start space-x-3 rounded-md border p-3 transition-colors"
                >
                  <Checkbox
                    id={`role-${role.id}`}
                    checked={selectedRoles.includes(role.id)}
                    onCheckedChange={() => handleRoleToggle(role.id)}
                    disabled={saving}
                  />
                  <Label
                    htmlFor={`role-${role.id}`}
                    className="flex-1 cursor-pointer"
                  >
                    <p className="font-medium">{role.name}</p>
                    {role.description && (
                      <p className="text-muted-foreground mt-1 text-xs">
                        {role.description}
                      </p>
                    )}
                  </Label>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-2 border-t pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowAssignForm(false);
                setSelectedRoles(userRoles.map((r) => r.id));
              }}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!hasChanges || saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
