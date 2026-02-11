'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import {
  IconArrowLeft,
  IconDeviceFloppy,
  IconLoader2
} from '@tabler/icons-react';
import { getPermissions } from '@/actions/common/permission-actions';
import {
  getRoleById,
  assignPermissionToRole,
  updateRole
} from '@/actions/common/role-actions';
import PageContainer from '@/components/layout/page-container';

interface Permission {
  id: string;
  name: string;
  actions: string | string[]; // Can be string (from backend) or array
  subjects: string | string[]; // Can be string (from backend) or array
}

interface Role {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  permissions?: Permission[];
}

export function RoleDetailsClient({ roleId }: { roleId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [role, setRole] = useState<Role | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchRoleDetails();
    fetchPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleId]);

  const fetchRoleDetails = async () => {
    try {
      const result = await getRoleById(roleId);
      if (result.success && result.data) {
        setRole(result.data);
        setFormData({
          name: result.data.name,
          description: result.data.description || ''
        });
        // Set initially selected permissions
        const rolePermissionIds =
          result.data.permissions?.map((p: any) => p.id) || [];
        setSelectedPermissions(rolePermissionIds);
      } else {
        toast.error('Failed to load role details');
      }
    } catch (error) {
      console.error('Error fetching role:', error);
      toast.error('Unable to load role details');
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const result = await getPermissions();
      if (result.success && result.data) {
        const mappedPermissions = result.data.map((p: any) => ({
          id: p.id,
          name: p.name || p.permissionName || 'Unknown Permission',
          // Convert string to array if needed (backend returns comma-separated string)
          actions:
            typeof p.actions === 'string'
              ? p.actions
                  .split(',')
                  .map((a: string) => a.trim())
                  .filter(Boolean)
              : p.actions || [],
          subjects:
            typeof p.subjects === 'string'
              ? p.subjects
                  .split(',')
                  .map((s: string) => s.trim())
                  .filter(Boolean)
              : p.subjects || []
        }));
        setPermissions(mappedPermissions);
      }
    } catch (error) {
      console.error('Error fetching permissions:', error);
    }
  };

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
      // Update role details if edited
      if (isEditing) {
        const updateResult = await updateRole({
          id: roleId,
          name: formData.name,
          description: formData.description
        });

        if (!updateResult.success) {
          toast.error(updateResult.error || 'Failed to update role');
          setSaving(false);
          return;
        }
      }

      // Update permissions
      let successCount = 0;
      for (const permissionId of selectedPermissions) {
        const result = await assignPermissionToRole({
          roleId,
          permissionId
        });
        if (result.success) successCount++;
      }

      if (successCount > 0 || isEditing) {
        toast.success('Role updated successfully');
        setIsEditing(false);
        await fetchRoleDetails(); // Refresh data
      } else {
        toast.error('Failed to update role');
      }
    } catch (error) {
      console.error('Error saving role:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-12">
          <IconLoader2 className="text-muted-foreground h-8 w-8 animate-spin" />
        </div>
      </PageContainer>
    );
  }

  if (!role) {
    return (
      <PageContainer>
        <div className="py-12 text-center">
          <p className="text-muted-foreground">Role not found</p>
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/roles')}
            className="mt-4"
          >
            <IconArrowLeft className="mr-2 h-4 w-4" />
            Back to Roles
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer scrollable>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push('/dashboard/roles')}
            >
              <IconArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Role Details
              </h1>
              <p className="text-muted-foreground">
                Change role (edit and save)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing && (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            )}
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <IconDeviceFloppy className="mr-2 h-4 w-4" />
                  Save
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Role Information */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base font-semibold">
                  Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  disabled={!isEditing}
                  className="text-base"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-base font-semibold"
                >
                  Desc
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  disabled={!isEditing}
                  rows={3}
                  placeholder="Enter role description..."
                  className="text-base"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Permissions Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <Label className="text-base font-semibold">Permissions</Label>
              {permissions.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No permissions available. Please create permissions first.
                </p>
              ) : (
                <div className="space-y-2">
                  {permissions.map((permission) => (
                    <div
                      key={permission.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={permission.id}
                        checked={selectedPermissions.includes(permission.id)}
                        onCheckedChange={() =>
                          handlePermissionToggle(permission.id)
                        }
                      />
                      <Label
                        htmlFor={permission.id}
                        className="cursor-pointer text-sm font-normal"
                      >
                        {permission.name}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
