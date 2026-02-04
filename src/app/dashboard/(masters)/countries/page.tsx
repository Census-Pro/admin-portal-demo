import PageContainer from '@/components/layout/page-container';
import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './_components/columns';
import { AddCountryButton } from './_components/add-country-button';

export const metadata = {
  title: 'Dashboard: Country Management'
};

export default function CountryManagementPage() {
  const data = [
    {
      id: '1',
      name: 'Bhutan',
      nationality: 'Bhutanese',
      isActive: true
    }
  ];

  return (
    <PageContainer
      pageTitle="Country Management"
      pageDescription="Manage countries in the system."
      pageHeaderAction={<AddCountryButton />}
    >
      <div className="space-y-4">
        <DataTable columns={columns} data={data} totalItems={data.length} />
      </div>
    </PageContainer>
  );
}
