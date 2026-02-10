'use client';

import { Badge } from '@/components/ui/badge';
import {
  IconUser,
  IconMail,
  IconPhone,
  IconBuilding,
  IconMapPin,
  IconShield
} from '@tabler/icons-react';

interface UserDetailsCardProps {
  user: any;
}

export function UserDetailsCard({ user }: UserDetailsCardProps) {
  return (
    <div className="space-y-4 rounded-lg border p-6">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold">
          {user.name?.charAt(0).toUpperCase() || user.cidNo?.charAt(0) || 'U'}
        </div>
        <div>
          <h2 className="text-xl font-semibold">{user.name || 'N/A'}</h2>
          <p className="text-muted-foreground text-sm">{user.email || 'N/A'}</p>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="mb-3 text-sm font-semibold">Personal Information</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <IconUser className="text-muted-foreground mt-0.5 h-4 w-4" />
            <div className="flex-1">
              <p className="text-muted-foreground text-xs">CID Number</p>
              <p className="text-sm font-medium">{user.cidNo || 'N/A'}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <IconMail className="text-muted-foreground mt-0.5 h-4 w-4" />
            <div className="flex-1">
              <p className="text-muted-foreground text-xs">Email Address</p>
              <p className="text-sm font-medium">{user.email || 'N/A'}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <IconPhone className="text-muted-foreground mt-0.5 h-4 w-4" />
            <div className="flex-1">
              <p className="text-muted-foreground text-xs">Mobile Number</p>
              <p className="text-sm font-medium">{user.mobileNo || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="mb-3 text-sm font-semibold">Organization Details</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <IconBuilding className="text-muted-foreground mt-0.5 h-4 w-4" />
            <div className="flex-1">
              <p className="text-muted-foreground text-xs">Agency</p>
              <p className="text-sm font-medium">
                {user.agency?.name || user.agency?.agencyName || 'N/A'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <IconMapPin className="text-muted-foreground mt-0.5 h-4 w-4" />
            <div className="flex-1">
              <p className="text-muted-foreground text-xs">Office Location</p>
              <p className="text-sm font-medium">
                {user.officeLocation?.name ||
                  user.officeLocation?.locationName ||
                  'N/A'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <IconShield className="text-muted-foreground mt-0.5 h-4 w-4" />
            <div className="flex-1">
              <p className="text-muted-foreground text-xs">Role Type</p>
              <div className="mt-1">
                <Badge
                  variant={
                    user.roleType === 'SUPER_ADMIN' ? 'default' : 'secondary'
                  }
                >
                  {user.roleType || 'ADMIN'}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
