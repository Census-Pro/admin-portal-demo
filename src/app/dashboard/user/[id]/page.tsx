import PageContainer from '@/components/layout/page-container';
import { getAdminById } from '@/actions/common/admin-actions';
import { notFound } from 'next/navigation';
import { UserDetailsSection } from './_components/user-details-section';
import { UserRolesSection } from './_components/user-roles-section';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { IconArrowLeft } from '@tabler/icons-react';

export const metadata = {
  title: 'User Details'
};

interface UserDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params;

  const result = await getAdminById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const user = result.data;

  return (
    <PageContainer
      pageTitle="User Details"
      pageDescription="View and manage user information and role assignments"
      pageHeaderAction={
        <Link href="/dashboard/user">
          <Button variant="outline">
            <IconArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Button>
        </Link>
      }
    >
      <div className="space-y-6">
        <UserDetailsSection user={user} />
        <UserRolesSection userId={id} user={user} />
      </div>
    </PageContainer>
  );
}
