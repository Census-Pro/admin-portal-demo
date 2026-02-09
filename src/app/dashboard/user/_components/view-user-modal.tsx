'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { User } from '@/types/user';
import { toast } from 'sonner';
import {
  IconUser,
  IconMail,
  IconPhone,
  IconBuilding,
  IconMapPin
} from '@tabler/icons-react';
import { assignRoleToAdmin } from '@/actions/common/role-actions';

interface ViewUserModalProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Role {
  id: string;
  name: string;
}

export function ViewUserModal({
  user,
  open,
  onOpenChange
}: ViewUserModalProps) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch all roles and user's current roles
  useEffect(() => {
    if (open) {
      fetchRolesAndUserRoles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, user.id]);

  const fetchRolesAndUserRoles = async () => {
    setLoading(true);
    try {
      // Fetch all roles using the correct endpoint: GET /roles/all
      const rolesResponse = await fetch('/api/roles/all');
      const rolesData = await rolesResponse.json();

      if (rolesResponse.ok && rolesData.success) {
        setRoles(rolesData.data || []);
      }

      // Fetch user's current roles by getting admin details
      const adminResponse = await fetch(`/api/admin/${user.id}`);
      const adminData = await adminResponse.json();

      if (adminResponse.ok && adminData.success && adminData.data) {
        // Extract role IDs from admin's adminRoles array
        const currentRoleIds =
          adminData.data.adminRoles
            ?.map((ar: any) => ar.role?.id)
            .filter(Boolean) || [];
        setUserRoles(currentRoleIds);
        setSelectedRoles(currentRoleIds);
      }
    } catch (error) {
      console.error('Failed to fetch roles:', error);
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
      // Get roles to add and remove
      const rolesToAdd = selectedRoles.filter((id) => !userRoles.includes(id));
      const rolesToRemove = userRoles.filter(
        (id) => !selectedRoles.includes(id)
      );

      // Remove roles using the correct backend endpoint
      for (const roleId of rolesToRemove) {
        const response = await fetch(
          `/api/admin-role/admin/${user.id}/role/${roleId}`,
          {
            method: 'DELETE'
          }
        );
        if (!response.ok) {
          throw new Error('Failed to remove role');
        }
      }

      // Add roles using the server action
      for (const roleId of rolesToAdd) {
        const result = await assignRoleToAdmin({
          adminId: user.id,
          roleId
        });

        if (!result.success) {
          throw new Error(result.error || 'Failed to add role');
        }
      }

      toast.success('Roles updated successfully');
      setUserRoles(selectedRoles);
      onOpenChange(false);

      // Refresh the page to update the list
      window.location.reload();
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
    JSON.stringify(selectedRoles.sort()) !== JSON.stringify(userRoles.sort());

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Details & Role Assignment</DialogTitle>
          <DialogDescription>
            View user information and assign roles to control their permissions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Information */}
          <div className="space-y-3 rounded-lg border p-4">
            <h3 className="text-sm font-semibold">User Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <IconUser className="text-muted-foreground h-4 w-4" />
                <div>
                  <p className="text-muted-foreground text-xs">Full Name</p>
                  <p className="text-sm font-medium">{user.name || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <IconUser className="text-muted-foreground h-4 w-4" />
                <div>
                  <p className="text-muted-foreground text-xs">CID Number</p>
                  <p className="text-sm font-medium">{user.cidNo || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <IconMail className="text-muted-foreground h-4 w-4" />
                <div>
                  <p className="text-muted-foreground text-xs">Email</p>
                  <p className="text-sm font-medium">{user.email || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <IconPhone className="text-muted-foreground h-4 w-4" />
                <div>
                  <p className="text-muted-foreground text-xs">Mobile</p>
                  <p className="text-sm font-medium">
                    {(user as any).mobileNo || 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <IconBuilding className="text-muted-foreground h-4 w-4" />
                <div>
                  <p className="text-muted-foreground text-xs">Agency</p>
                  <p className="text-sm font-medium">
                    {user.agencyName || 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <IconMapPin className="text-muted-foreground h-4 w-4" />
                <div>
                  <p className="text-muted-foreground text-xs">
                    Office Location
                  </p>
                  <p className="text-sm font-medium">
                    {user.officeLocationName || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground mb-1 text-xs">Role Type</p>
              <Badge
                variant={
                  (user as any).roleType === 'SUPER_ADMIN'
                    ? 'default'
                    : 'secondary'
                }
              >
                {(user as any).roleType || 'ADMIN'}
              </Badge>
            </div>
          </div>

          {/* Role Assignment */}
          <div className="space-y-3 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Assign Roles</h3>
              <Badge variant="outline">{selectedRoles.length} selected</Badge>
            </div>
            <p className="text-muted-foreground text-xs">
              Select roles to grant this user access to specific features and
              permissions
            </p>

            {loading ? (
              <div className="text-muted-foreground py-8 text-center text-sm">
                Loading roles...
              </div>
            ) : roles.length === 0 ? (
              <div className="text-muted-foreground py-8 text-center text-sm">
                No roles available. Create roles first from Role Management.
              </div>
            ) : (
              <div className="grid max-h-96 grid-cols-2 gap-3 overflow-y-auto p-2">
                {roles.map((role) => (
                  <div
                    key={role.id}
                    className="hover:bg-muted/50 flex items-center space-x-2 rounded-md border p-3 transition-colors"
                  >
                    <Checkbox
                      id={`role-${role.id}`}
                      checked={selectedRoles.includes(role.id)}
                      onCheckedChange={() => handleRoleToggle(role.id)}
                      disabled={saving}
                    />
                    <Label
                      htmlFor={`role-${role.id}`}
                      className="flex-1 cursor-pointer text-sm font-normal"
                    >
                      {role.name}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || saving || loading}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
