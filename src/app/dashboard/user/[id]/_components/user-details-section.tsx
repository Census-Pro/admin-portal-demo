'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  IconUser,
  IconMail,
  IconPhone,
  IconBuilding,
  IconMapPin,
  IconShield,
  IconEdit,
  IconCheck,
  IconX,
  IconKey
} from '@tabler/icons-react';
import { updateAdmin } from '@/actions/common/admin-actions';
import { getAgencies, getOfficeLocations } from '@/actions/common/user-actions';
import { toast } from 'sonner';
import { ResetPasswordDialog } from './reset-password-dialog';

interface UserDetailsSectionProps {
  user: any;
}

interface Agency {
  id: string;
  name: string;
}

interface OfficeLocation {
  id: string;
  name: string;
}

export function UserDetailsSection({ user }: UserDetailsSectionProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [officeLocations, setOfficeLocations] = useState<OfficeLocation[]>([]);
  const [formData, setFormData] = useState({
    cidNo: user.cidNo || '',
    fullName: user.fullName || user.name || '',
    roleType: user.roleType || 'ADMIN',
    password: '',
    officeLocationId: user.officeLocation?.id || '',
    agencyId: user.agency?.id || '',
    mobileNo: user.mobileNo || '',
    email: user.email || ''
  });

  useEffect(() => {
    if (isEditing) {
      const fetchData = async () => {
        try {
          const [agenciesResult, locationsResult] = await Promise.all([
            getAgencies(),
            getOfficeLocations()
          ]);

          if (agenciesResult.success) {
            setAgencies(agenciesResult.data || []);
          }
          if (locationsResult.success) {
            setOfficeLocations(locationsResult.data || []);
          }
        } catch (error) {
          console.error('Failed to fetch agencies and locations:', error);
        }
      };

      fetchData();
    }
  }, [isEditing]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Build the update payload conditionally
      const updatePayload: any = {
        cidNo: formData.cidNo,
        fullName: formData.fullName,
        roleType: formData.roleType,
        officeLocationId: formData.officeLocationId,
        agencyId: formData.agencyId,
        mobileNo: formData.mobileNo,
        email: formData.email
      };

      // Only include password if it's not empty
      if (formData.password) {
        updatePayload.password = formData.password;
      }

      const result = await updateAdmin(user.id, updatePayload);

      if (result.success) {
        toast.success('Admin updated successfully');
        setIsEditing(false);
        // Refresh the page to get updated data
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to update admin');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      cidNo: user.cidNo || '',
      fullName: user.fullName || user.name || '',
      roleType: user.roleType || 'ADMIN',
      password: '',
      officeLocationId: user.officeLocation?.id || '',
      agencyId: user.agency?.id || '',
      mobileNo: user.mobileNo || '',
      email: user.email || ''
    });
    setIsEditing(false);
  };

  const displayName = user.fullName || user.name || user.cidNo || 'N/A';
  const initial = displayName?.charAt(0)?.toUpperCase() || 'U';

  // Check if current user is super admin
  const isSuperAdmin = session?.user?.roleType === 'SUPER_ADMIN';
  // Don't allow super admin to reset their own password (they should use change password)
  const canResetPassword = isSuperAdmin && session?.user?.id !== user.id;

  return (
    <>
      <ResetPasswordDialog
        open={resetPasswordOpen}
        onOpenChange={setResetPasswordOpen}
        adminId={user.id}
        adminName={displayName}
      />
      <div className="bg-card rounded-lg border p-6">
        {/* User Header */}
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 text-primary flex h-16 w-16 items-center justify-center rounded-full text-2xl font-semibold">
              {initial}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                {isEditing ? (
                  <Input
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        fullName: e.target.value
                      }))
                    }
                    className="h-auto w-full border-none p-0 text-2xl font-bold shadow-none"
                    placeholder="Full Name"
                  />
                ) : (
                  <h2 className="text-2xl font-bold">{displayName}</h2>
                )}
                <Badge
                  variant={
                    user.roleType === 'SUPER_ADMIN' ? 'default' : 'secondary'
                  }
                >
                  {user.roleType || 'ADMIN'}
                </Badge>
              </div>
              {isEditing ? (
                <Input
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="text-muted-foreground mt-1 w-full"
                  placeholder="Email"
                  type="email"
                />
              ) : (
                <p className="text-muted-foreground mt-1">
                  {user.email || 'No email provided'}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button onClick={handleSave} disabled={isLoading} size="sm">
                  <IconCheck className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  size="sm"
                  disabled={isLoading}
                >
                  <IconX className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </>
            ) : (
              <>
                {canResetPassword && (
                  <Button
                    onClick={() => setResetPasswordOpen(true)}
                    variant="outline"
                    size="sm"
                    className="text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
                  >
                    <IconKey className="mr-2 h-4 w-4" />
                    Reset Password
                  </Button>
                )}
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  size="sm"
                >
                  <IconEdit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </>
            )}
          </div>
        </div>

        {/* User Information Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* CID Number */}
          <div className="flex items-start gap-3">
            <div className="bg-muted/50 flex h-10 w-10 items-center justify-center rounded-lg">
              <IconUser className="text-muted-foreground h-5 w-5" />
            </div>
            <div className="flex-1">
              <Label className="text-muted-foreground text-xs font-medium uppercase">
                CID Number
              </Label>
              {isEditing ? (
                <Input
                  value={formData.cidNo}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, cidNo: e.target.value }))
                  }
                  className="mt-1 w-full"
                  placeholder="CID Number"
                />
              ) : (
                <p className="mt-1 text-sm font-medium">
                  {user.cidNo || 'Not provided'}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-3">
            <div className="bg-muted/50 flex h-10 w-10 items-center justify-center rounded-lg">
              <IconMail className="text-muted-foreground h-5 w-5" />
            </div>
            <div className="flex-1">
              <Label className="text-muted-foreground text-xs font-medium uppercase">
                Email Address
              </Label>
              {isEditing ? (
                <Input
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="mt-1 w-full"
                  placeholder="Email Address"
                  type="email"
                />
              ) : (
                <p className="mt-1 text-sm font-medium">
                  {user.email || 'Not provided'}
                </p>
              )}
            </div>
          </div>

          {/* Mobile Number */}
          <div className="flex items-start gap-3">
            <div className="bg-muted/50 flex h-10 w-10 items-center justify-center rounded-lg">
              <IconPhone className="text-muted-foreground h-5 w-5" />
            </div>
            <div className="flex-1">
              <Label className="text-muted-foreground text-xs font-medium uppercase">
                Mobile Number
              </Label>
              {isEditing ? (
                <Input
                  value={formData.mobileNo}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      mobileNo: e.target.value
                    }))
                  }
                  className="mt-1 w-full"
                  placeholder="Mobile Number"
                />
              ) : (
                <p className="mt-1 text-sm font-medium">
                  {user.mobileNo || 'Not provided'}
                </p>
              )}
            </div>
          </div>

          {/* Agency */}
          <div className="flex items-start gap-3">
            <div className="bg-muted/50 flex h-10 w-10 items-center justify-center rounded-lg">
              <IconBuilding className="text-muted-foreground h-5 w-5" />
            </div>
            <div className="flex-1">
              <Label className="text-muted-foreground text-xs font-medium uppercase">
                Agency
              </Label>
              {isEditing ? (
                <Select
                  value={formData.agencyId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, agencyId: value }))
                  }
                >
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue placeholder="Select Agency" />
                  </SelectTrigger>
                  <SelectContent>
                    {agencies.map((agency) => (
                      <SelectItem key={agency.id} value={agency.id}>
                        {agency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="mt-1 text-sm font-medium">
                  {user.agency?.name ||
                    user.agency?.agencyName ||
                    'Not assigned'}
                </p>
              )}
            </div>
          </div>

          {/* Office Location */}
          <div className="flex items-start gap-3">
            <div className="bg-muted/50 flex h-10 w-10 items-center justify-center rounded-lg">
              <IconMapPin className="text-muted-foreground h-5 w-5" />
            </div>
            <div className="flex-1">
              <Label className="text-muted-foreground text-xs font-medium uppercase">
                Office Location
              </Label>
              {isEditing ? (
                <Select
                  value={formData.officeLocationId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      officeLocationId: value
                    }))
                  }
                >
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue placeholder="Select Office Location" />
                  </SelectTrigger>
                  <SelectContent>
                    {officeLocations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="mt-1 text-sm font-medium">
                  {user.officeLocation?.name ||
                    user.officeLocation?.locationName ||
                    'Not assigned'}
                </p>
              )}
            </div>
          </div>

          {/* Role Type */}
          <div className="flex items-start gap-3">
            <div className="bg-muted/50 flex h-10 w-10 items-center justify-center rounded-lg">
              <IconShield className="text-muted-foreground h-5 w-5" />
            </div>
            <div className="flex-1">
              <Label className="text-muted-foreground text-xs font-medium uppercase">
                Account Type
              </Label>
              {isEditing ? (
                <Select
                  value={formData.roleType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, roleType: value }))
                  }
                >
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Administrator</SelectItem>
                    <SelectItem value="SUPER_ADMIN">
                      Super Administrator
                    </SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="mt-1 text-sm font-medium">
                  {user.roleType === 'SUPER_ADMIN'
                    ? 'Super Administrator'
                    : 'Administrator'}
                </p>
              )}
            </div>
          </div>

          {/* Password (only in edit mode) */}
          {isEditing && (
            <div className="flex items-start gap-3">
              <div className="bg-muted/50 flex h-10 w-10 items-center justify-center rounded-lg">
                <IconShield className="text-muted-foreground h-5 w-5" />
              </div>
              <div className="flex-1">
                <Label className="text-muted-foreground text-xs font-medium uppercase">
                  New Password{' '}
                  <span className="text-orange-500">(Optional)</span>
                </Label>
                <Input
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value
                    }))
                  }
                  className="mt-1 w-full"
                  placeholder="Leave empty to keep current password"
                  type="password"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
