'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import PageContainer from '@/components/layout/page-container';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IconShield, IconUser, IconEdit } from '@tabler/icons-react';
import { AssignAbilitiesModal } from './_components/assign-abilities-modal';

/**
 * Admin Permission Management Page
 *
 * This page allows SUPER_ADMIN or admins with manage:admin permission
 * to control what other admins can see in their sidebar/menu.
 *
 * Features:
 * - View all admins and their assigned abilities
 * - Assign/modify abilities for each admin
 * - Preview what an admin's sidebar will look like
 * - Manage roles and permissions
 */

interface Admin {
  id: string;
  cidNo: string;
  fullName?: string;
  email?: string;
  roleType: string;
  roles: string[];
  abilities: Array<{
    name: string;
    action: string[];
    subject: string | string[];
  }>;
}

export default function AdminPermissionsPage() {
  const { data: session } = useSession();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if current user can manage admin permissions
  const canManageAdmins =
    session?.user?.roleType === 'SUPER_ADMIN' ||
    (session?.user?.ability &&
      Array.isArray(session.user.ability) &&
      session.user.ability.some((a) =>
        typeof a === 'string'
          ? a === 'manage:admin'
          : a.action?.includes('manage') &&
            (a.subject === 'Admin' || a.subject?.includes?.('Admin'))
      ));

  useEffect(() => {
    if (canManageAdmins) {
      fetchAdmins();
    }
  }, [canManageAdmins]);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/list');

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to fetch admins:', errorData);
        toast.error(errorData.error || 'Failed to fetch admins');
        return;
      }

      const data = await response.json();
      console.log('Fetched admins:', data);
      setAdmins(data.admins || []);
    } catch (error) {
      console.error('Failed to fetch admins:', error);
      toast.error('An error occurred while fetching admins');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignAbilities = (admin: Admin) => {
    setSelectedAdmin(admin);
    setIsModalOpen(true);
  };

  const handleSaveAbilities = async (adminId: string, abilities: any[]) => {
    try {
      const response = await fetch(`/api/admin/${adminId}/abilities`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ abilities })
      });

      if (response.ok) {
        // Refresh admin list
        await fetchAdmins();
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Failed to save abilities:', error);
    }
  };

  if (!canManageAdmins) {
    return (
      <PageContainer
        pageTitle="Access Denied"
        pageDescription="You don't have permission to manage admin permissions"
      >
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">
              Only SUPER_ADMIN or admins with "manage:admin" permission can
              access this page.
            </p>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      pageTitle="Admin Permission Management"
      pageDescription="Control what each admin can see and do in the system"
    >
      <div className="space-y-6">
        {/* Overview Card */}
        <Card>
          <CardHeader>
            <CardTitle>Permission Control</CardTitle>
            <CardDescription>
              Assign abilities to admins to control their sidebar menu access
              and actions. Each ability consists of actions (read, create,
              update, etc.) and subjects (Birth Registration, Admin, etc.)
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Admins List */}
        <div className="grid gap-4">
          {loading ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground text-center">
                  Loading admins...
                </p>
              </CardContent>
            </Card>
          ) : admins.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground text-center">
                  No admins found. Create an admin user first from the User
                  Management page.
                </p>
              </CardContent>
            </Card>
          ) : (
            admins.map((admin) => (
              <Card
                key={admin.id}
                className="transition-shadow hover:shadow-md"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
                        <IconUser className="text-primary h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">
                            {admin.fullName || `Admin ${admin.cidNo}`}
                          </CardTitle>
                          <Badge
                            variant={
                              admin.roleType === 'SUPER_ADMIN'
                                ? 'default'
                                : 'secondary'
                            }
                          >
                            {admin.roleType}
                          </Badge>
                        </div>
                        <CardDescription>
                          CID: {admin.cidNo} {admin.email && `• ${admin.email}`}
                        </CardDescription>
                        {admin.roles.length > 0 && (
                          <div className="mt-2 flex gap-2">
                            {admin.roles.map((role) => (
                              <Badge
                                key={role}
                                variant="outline"
                                className="text-xs"
                              >
                                {role}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAssignAbilities(admin)}
                      >
                        <IconEdit className="mr-2 h-4 w-4" />
                        Manage Abilities
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <IconShield className="h-4 w-4" />
                      Current Abilities ({admin.abilities?.length || 0})
                    </div>
                    {admin.abilities && admin.abilities.length > 0 ? (
                      <div className="grid gap-2">
                        {admin.abilities.map((ability, index) => (
                          <div
                            key={index}
                            className="bg-muted/50 rounded-lg border p-3 text-sm"
                          >
                            <div className="mb-1 font-medium">
                              {ability.name}
                            </div>
                            <div className="text-muted-foreground flex flex-wrap gap-2 text-xs">
                              <span className="font-semibold">Actions:</span>
                              {ability.action.map((action) => (
                                <Badge
                                  key={action}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {action}
                                </Badge>
                              ))}
                            </div>
                            <div className="text-muted-foreground mt-1 flex flex-wrap gap-2 text-xs">
                              <span className="font-semibold">Subjects:</span>
                              {Array.isArray(ability.subject) ? (
                                ability.subject.map((subj) => (
                                  <Badge
                                    key={subj}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {subj}
                                  </Badge>
                                ))
                              ) : (
                                <Badge variant="outline" className="text-xs">
                                  {ability.subject}
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">
                        {admin.roleType === 'SUPER_ADMIN'
                          ? 'Full system access (SUPER_ADMIN)'
                          : 'No abilities assigned yet'}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Assign Abilities Modal */}
      {selectedAdmin && (
        <AssignAbilitiesModal
          admin={selectedAdmin}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onSave={handleSaveAbilities}
        />
      )}
    </PageContainer>
  );
}
