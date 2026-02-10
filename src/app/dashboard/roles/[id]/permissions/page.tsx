import PageContainer from '@/components/layout/page-container';
import { getRoleById } from '@/actions/common/role-actions';
import { notFound } from 'next/navigation';
import { ManagePermissionsSection } from './_components/manage-permissions-section';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { IconArrowLeft } from '@tabler/icons-react';

export const metadata = {
  title: 'Manage Role Permissions'
};

interface ManagePermissionsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ManagePermissionsPage({
  params
}: ManagePermissionsPageProps) {
  const { id } = await params;

  const result = await getRoleById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const role = result.data;

  return (
    <PageContainer
      pageTitle={`Manage Permissions for ${role.name}`}
      pageDescription="Select permissions to assign to this role. Users with this role will inherit these permissions."
      pageHeaderAction={
        <Link href="/dashboard/roles">
          <Button variant="outline">
            <IconArrowLeft className="mr-2 h-4 w-4" />
            Back to Roles
          </Button>
        </Link>
      }
    >
      <ManagePermissionsSection role={role} />
    </PageContainer>
  );
}
