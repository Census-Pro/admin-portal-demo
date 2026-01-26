'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MultiSelect } from '@/components/ui/multi-select';
import { getPermissions } from '@/actions/common/permission-actions';
import { assignPermissionToRole } from '@/actions/common/role-actions';
import { toast } from 'sonner';

interface ManagePermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  role: {
    id: string;
    name: string;
  };
}

export function ManagePermissionsModal({
  isOpen,
  onClose,
  onSuccess,
  role
}: ManagePermissionsModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [permissions, setPermissions] = useState<
    { id: string; name: string }[]
  >([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [loadingPermissions, setLoadingPermissions] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchPermissions();
    }
  }, [isOpen]);

  const fetchPermissions = async () => {
    setLoadingPermissions(true);
    try {
      console.log('[ManagePermissionsModal] Fetching permissions...');
      const result = await getPermissions();
      console.log('[ManagePermissionsModal] Permissions result:', result);

      if (result.success) {
        console.log('[ManagePermissionsModal] Permissions data:', result.data);
        console.log(
          '[ManagePermissionsModal] Number of permissions:',
          result.data?.length
        );

        // Log the first permission to see its structure
        if (result.data && result.data.length > 0) {
          console.log(
            '[ManagePermissionsModal] First permission structure:',
            result.data[0]
          );
          console.log(
            '[ManagePermissionsModal] First permission keys:',
            Object.keys(result.data[0])
          );
        }

        // Map permissions to handle different field names
        const mappedPermissions = (result.data || []).map(
          (permission: any) => ({
            id: permission.id,
            name:
              permission.name ||
              permission.permissionName ||
              permission.permission_name ||
              'Unknown Permission'
          })
        );

        console.log(
          '[ManagePermissionsModal] Mapped permissions:',
          mappedPermissions
        );
        setPermissions(mappedPermissions);
      } else {
        console.error(
          '[ManagePermissionsModal] Failed to fetch permissions:',
          result.error
        );
        toast.error(result.error || 'Failed to fetch permissions');
      }
    } catch (error) {
      console.error('[ManagePermissionsModal] Fetch permissions error:', error);
      toast.error('Unable to load permissions');
    } finally {
      setLoadingPermissions(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedPermissions.length === 0) {
      toast.error('Please select at least one permission');
      return;
    }

    setIsLoading(true);

    try {
      // Assign each permission to the role
      let successCount = 0;

      for (const permissionId of selectedPermissions) {
        const result = await assignPermissionToRole({
          roleId: role.id,
          permissionId
        });

        if (result.success) {
          successCount++;
        } else {
          console.error('Failed to assign permission:', result.error);
        }
      }

      if (successCount > 0) {
        toast.success(
          `Successfully assigned ${successCount} permission(s) to ${role.name}`
        );
        onSuccess();
        handleClose();
      } else {
        toast.error('Failed to assign permissions');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Assign permissions error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedPermissions([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Manage Permissions for {role.name}</DialogTitle>
          <DialogDescription>
            Select permissions to assign to this role. Users with this role will
            inherit these permissions.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            {loadingPermissions && (
              <p className="text-muted-foreground text-sm">
                Loading permissions...
              </p>
            )}
            {!loadingPermissions && permissions.length === 0 && (
              <div className="space-y-2">
                <p className="text-destructive text-sm">
                  No permissions available. Please create permissions first.
                </p>
                <p className="text-muted-foreground text-xs">
                  Check browser console for detailed logs.
                </p>
              </div>
            )}
            {!loadingPermissions && permissions.length > 0 && (
              <p className="text-muted-foreground text-sm">
                {permissions.length} permission(s) available
              </p>
            )}

            {/* Debug info - remove in production */}
            {/* {!loadingPermissions && permissions.length > 0 && (
              <details className="text-xs">
                <summary className="text-muted-foreground cursor-pointer">
                  Debug: View loaded permissions
                </summary>
                <pre className="bg-muted mt-2 max-h-32 overflow-auto rounded p-2">
                  {JSON.stringify(permissions, null, 2)}
                </pre>
              </details>
            )} */}

            <MultiSelect
              options={permissions.map((permission) => ({
                label: permission.name,
                value: permission.id
              }))}
              selected={selectedPermissions}
              onChange={setSelectedPermissions}
              placeholder={
                loadingPermissions
                  ? 'Loading permissions...'
                  : 'Select permissions...'
              }
              emptyMessage="No permissions available"
              className="w-full"
            />
            <p className="text-muted-foreground text-sm">
              Selected: {selectedPermissions.length} permission(s)
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || loadingPermissions}>
              {isLoading ? 'Assigning...' : 'Assign Permissions'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
