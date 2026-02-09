import { Metadata } from 'next';
import { RoleDetailsClient } from './_components/role-details-client';

export const metadata: Metadata = {
  title: 'Role Details | Admin Portal',
  description: 'View and manage role permissions'
};

export default function RoleDetailsPage({
  params
}: {
  params: { id: string };
}) {
  return <RoleDetailsClient roleId={params.id} />;
}
