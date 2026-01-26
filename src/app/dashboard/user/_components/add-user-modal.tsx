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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { MultiSelect } from '@/components/ui/multi-select';
import { createUser } from '@/actions/common/user-actions';
import { getRoles, assignRoleToAdmin } from '@/actions/common/role-actions';
import { toast } from 'sonner';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Agency {
  id: string;
  name: string;
}

interface BackendAgency {
  id: string;
  name?: string;
  agencyName?: string;
  agency_name?: string;
}

interface OfficeLocation {
  id: string;
  name: string;
}

interface BackendOfficeLocation {
  id: string;
  name?: string;
  locationName?: string;
  location_name?: string;
}

export function AddUserModal({
  isOpen,
  onClose,
  onSuccess
}: AddUserModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    cidNo: '',
    email: '',
    password: '',
    mobileNo: '',
    officeLocationId: '',
    agencyId: ''
  });
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loadingAgencies, setLoadingAgencies] = useState(false);
  const [officeLocations, setOfficeLocations] = useState<OfficeLocation[]>([]);
  const [loadingOfficeLocations, setLoadingOfficeLocations] = useState(false);

  // State for roles
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);

  // Fetch agencies, office locations, and roles when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchAgencies();
      fetchOfficeLocations();
      fetchRoles();
    }
  }, [isOpen]);
  const fetchAgencies = async () => {
    setLoadingAgencies(true);
    try {
      const response = await fetch('/api/agencies');
      const data = await response.json();

      if (response.ok && data.success) {
        const mappedAgencies = (data.data || []).map(
          (agency: BackendAgency) => ({
            id: agency.id,
            name:
              agency.name ||
              agency.agencyName ||
              agency.agency_name ||
              'Unknown Agency'
          })
        );
        setAgencies(mappedAgencies);
      } else {
        toast.error(data.error || 'Failed to fetch agencies');
      }
    } catch (error) {
      toast.error('Unable to load agencies. Please try again.');
      console.error('Fetch agencies error:', error);
    } finally {
      setLoadingAgencies(false);
    }
  };

  const fetchOfficeLocations = async () => {
    setLoadingOfficeLocations(true);
    try {
      const response = await fetch('/api/office-locations');
      const data = await response.json();

      if (response.ok && data.success) {
        const mappedLocations = (data.data || []).map(
          (location: BackendOfficeLocation) => ({
            id: location.id,
            name:
              location.name ||
              location.locationName ||
              location.location_name ||
              'Unknown Location'
          })
        );
        setOfficeLocations(mappedLocations);
      } else {
        console.error('Office locations error:', data.error);
      }
    } catch (error) {
      console.error('Fetch office locations error:', error);
    } finally {
      setLoadingOfficeLocations(false);
    }
  };

  const fetchRoles = async () => {
    setLoadingRoles(true);
    try {
      const result = await getRoles();
      if (result.success) {
        setRoles(result.data || []);
      } else {
        toast.error(result.error || 'Failed to fetch roles');
      }
    } catch (error) {
      console.error('Fetch roles error:', error);
      toast.error('Unable to load roles');
    } finally {
      setLoadingRoles(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Prepend +975 to mobile number before sending
      const submitData = {
        ...formData,
        mobileNo: `+975${formData.mobileNo}`
      };

      // Create the user
      const result = await createUser(submitData);

      if (!result.success) {
        toast.error(result.error || 'Failed to create user');
        setIsLoading(false);
        return;
      }

      const createdUserId = result.data?.id;

      if (!createdUserId) {
        toast.error('User created but ID not returned');
        setIsLoading(false);
        return;
      }

      // Assign roles to the admin
      if (selectedRoles.length > 0) {
        for (const roleId of selectedRoles) {
          const roleResult = await assignRoleToAdmin({
            adminId: createdUserId,
            roleId
          });

          if (!roleResult.success) {
            console.error('Failed to assign role:', roleResult.error);
            // Don't fail the entire process, just log the error
          }
        }
      }

      toast.success('User created successfully with roles assigned');
      onSuccess();
      onClose();
      // Reset form
      setFormData({
        cidNo: '',
        email: '',
        password: '',
        mobileNo: '',
        officeLocationId: '',
        agencyId: ''
      });
      setSelectedRoles([]);
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Create user error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Create a new user account with the required information.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="cidNo">CID Number *</Label>
            <Input
              id="cidNo"
              required
              value={formData.cidNo}
              onChange={(e) =>
                setFormData({ ...formData, cidNo: e.target.value })
              }
              placeholder="Enter CID number"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Enter email address"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Enter password"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="mobileNo">Mobile Number *</Label>
            <div className="flex">
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400">
                +975
              </span>
              <Input
                id="mobileNo"
                required
                value={formData.mobileNo}
                onChange={(e) => {
                  // Only allow numbers
                  const value = e.target.value.replace(/\D/g, '');
                  setFormData({ ...formData, mobileNo: value });
                }}
                placeholder="17123456"
                className="rounded-l-none"
                maxLength={8}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="agencyId">Select Agency *</Label>
              <Select
                value={formData.agencyId}
                onValueChange={(value) =>
                  setFormData({ ...formData, agencyId: value })
                }
                disabled={loadingAgencies}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      loadingAgencies
                        ? 'Loading agencies...'
                        : 'Select an agency'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {agencies.length === 0 && !loadingAgencies && (
                    <SelectItem value="no-agencies" disabled>
                      No agencies available
                    </SelectItem>
                  )}
                  {agencies.map((agency) => (
                    <SelectItem key={agency.id} value={agency.id}>
                      {agency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="officeLocationId">Select Office Location *</Label>
              <Select
                value={formData.officeLocationId}
                onValueChange={(value) =>
                  setFormData({ ...formData, officeLocationId: value })
                }
                disabled={loadingOfficeLocations}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      loadingOfficeLocations
                        ? 'Loading locations...'
                        : 'Select an office location'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {officeLocations.length === 0 && !loadingOfficeLocations && (
                    <SelectItem value="no-locations" disabled>
                      No office locations available
                    </SelectItem>
                  )}
                  {officeLocations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="roles">Assign Roles</Label>
            <MultiSelect
              options={roles.map((role) => ({
                label: role.name,
                value: role.id
              }))}
              selected={selectedRoles}
              onChange={setSelectedRoles}
              placeholder={
                loadingRoles ? 'Loading roles...' : 'Select roles...'
              }
              emptyMessage="No roles available"
              className="w-full"
            />
            <p className="text-muted-foreground text-sm">
              Select one or more roles to assign to this user. Users will
              inherit all permissions from their assigned roles.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create User'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
