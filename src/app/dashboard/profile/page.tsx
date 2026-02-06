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
import { instance } from '@/actions/instance';

const API_URL = process.env.AUTH_SERVICE;

async function getAdminProfile(id: string) {
  try {
    const headers = await instance();
    console.log('Fetching admin profile for ID:', id);
    console.log('API URL:', `${API_URL}/admin/${id}`);

    const response = await fetch(`${API_URL}/admin/${id}`, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    console.log('API Response status:', response.status);
    console.log('API Response ok:', response.ok);

    if (!response.ok) {
      console.log('API Response not ok, returning null');
      return null;
    }

    const data = await response.json();
    console.log('API Response data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    return null;
  }
}

async function getAgencyName(id: string) {
  try {
    const headers = await instance();
    const response = await fetch(`${API_URL}/agencies/${id}`, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.name;
  } catch (error) {
    console.error('Error fetching agency:', error);
    return null;
  }
}

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/');
  }

  const user = session.user;

  // Fetch fresh admin profile data from API
  const adminProfile = await getAdminProfile(user.id);

  // If API returned data but agency is missing, fetch agency name separately
  let agencyName = adminProfile?.agency?.name;
  if (adminProfile?.agencyId && !agencyName) {
    agencyName = await getAgencyName(adminProfile.agencyId);
  }

  // Use fresh API data if available, fallback to session data
  const profileData = adminProfile || user;

  // Debug: Log profile data
  console.log('Profile data:', {
    sessionUser: user,
    apiProfile: adminProfile,
    finalData: profileData,
    agency: profileData?.agency,
    agencyName: agencyName,
    officeLocation: profileData?.officeLocation,
    officeLocationName: profileData?.officeLocation?.name
  });

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
                    value={profileData.cidNo}
                  />
                  <DetailItem
                    icon={<IconShieldLock size={18} />}
                    label="Role Type"
                    value={profileData.roleType?.replace('_', ' ')}
                    className="uppercase"
                  />
                  <DetailItem
                    icon={<IconMail size={18} />}
                    label="Email Address"
                    value={profileData.email}
                  />
                  <DetailItem
                    icon={<IconPhone size={18} />}
                    label="Mobile Number"
                    value={profileData.mobileNo}
                  />
                  <DetailItem
                    icon={<IconMapPin size={18} />}
                    label="Office Location"
                    value={profileData.officeLocation?.name}
                  />
                  <DetailItem
                    icon={<IconBuildingCommunity size={18} />}
                    label="Agency"
                    value={profileData.agency?.name || agencyName}
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
