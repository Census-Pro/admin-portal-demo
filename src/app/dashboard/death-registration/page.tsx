import { redirect } from 'next/navigation';
import PageContainer from '@/components/layout/page-container';
import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './_components/columns';

export const metadata = {
  title: 'Dashboard: Death Registration'
};

export default function DeathRegistrationPage() {
  redirect('/dashboard/death-registration/pending');
}
