import PageContainer from '@/components/layout/page-container';
import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './_components/endorse-columns';
import { EndorseSearchBar } from './_components/search-bar';
import { getBirthApplicationsByStatus } from '@/actions/common/birth-registration-actions';

export const metadata = {
  title: 'Birth Registration - Endorse'
};

export default async function BirthRegistrationEndorsePage() {
  const result = await getBirthApplicationsByStatus('SUBMITTED');
  const endorsementList = result.data ?? [];

  return (
    <PageContainer
      pageTitle="Birth Registration - Endorse"
      pageDescription="Review and endorse birth registration applications pending endorsement"
    >
      <div className="space-y-4">
        <EndorseSearchBar />
        <DataTable
          columns={columns}
          data={endorsementList}
          totalItems={result.total_count ?? endorsementList.length}
        />
      </div>
    </PageContainer>
  );
}
