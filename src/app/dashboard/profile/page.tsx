import { auth } from '@/auth';
import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ChangePasswordForm } from './change-password-form';
import { redirect } from 'next/navigation';
import {
  IconUser,
  IconId,
  IconMail,
  IconPhone,
  IconMapPin,
  IconBuildingCommunity,
  IconShieldLock
} from '@tabler/icons-react';

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/');
  }

  const user = session.user;

  return (
    <PageContainer scrollable>
      <div className="space-y-6">
        <Breadcrumbs />

        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
            <p className="text-muted-foreground">
              View and manage your account details and security settings.
            </p>
          </div>
        </div>

        <Separator />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Card className="border-muted shadow-sm lg:col-span-4">
            <CardHeader className="pb-3">
              <div className="text-primary flex items-center gap-2">
                <IconUser size={20} />
                <CardTitle>Personal Information</CardTitle>
              </div>
              <CardDescription>
                Detailed information about your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
                  <DetailItem
                    icon={<IconId size={18} />}
                    label="CID Number"
                    value={user.cidNo}
                  />
                  <DetailItem
                    icon={<IconShieldLock size={18} />}
                    label="Role Type"
                    value={user.roleType?.replace('_', ' ')}
                    className="uppercase"
                  />
                  <DetailItem
                    icon={<IconMail size={18} />}
                    label="Email Address"
                    value={user.email}
                  />
                  <DetailItem
                    icon={<IconPhone size={18} />}
                    label="Mobile Number"
                    value={user.mobileNo}
                  />
                  <DetailItem
                    icon={<IconMapPin size={18} />}
                    label="Office Location"
                    value={user.officeLocation?.name}
                  />
                  <DetailItem
                    icon={<IconBuildingCommunity size={18} />}
                    label="Agency"
                    value={user.agency?.name || user.agencyId}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-muted shadow-sm lg:col-span-3">
            <CardHeader className="pb-3">
              <div className="text-primary flex items-center gap-2">
                <IconShieldLock size={20} />
                <CardTitle>Security</CardTitle>
              </div>
              <CardDescription>
                Update your password to keep your account secure.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChangePasswordForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}

function DetailItem({
  icon,
  label,
  value,
  className = ''
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
  className?: string;
}) {
  return (
    <div className="flex flex-col space-y-2">
      <div className="text-muted-foreground flex items-center gap-2">
        {icon}
        <span className="text-xs font-semibold tracking-wider uppercase">
          {label}
        </span>
      </div>
      <p className={`pl-6 text-sm font-medium ${className}`}>
        {value || 'N/A'}
      </p>
    </div>
  );
}
