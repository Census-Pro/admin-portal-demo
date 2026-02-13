import { redirect } from 'next/navigation';
import PageContainer from '@/components/layout/page-container';
import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './_components/columns';

export const metadata = {
  title: 'Dashboard: Birth Registration'
};

export default function BirthRegistrationPage() {
  redirect('/dashboard/birth-registration/pending');
}
