import PageContainer from '@/components/layout/page-container';
import { endorsedColumns } from '../endorse/_components/endorsed-columns';
import { EndorsedListSearchBar } from './_components/search-bar';
import { EndorsedListTable } from './_components/endorsed-list-table';

export const metadata = {
  title: 'Birth Registration - Endorsed List'
};

export default function BirthRegistrationEndorsedListPage() {
  return (
    <PageContainer
      pageTitle="Birth Registration - Endorsed List"
      pageDescription="Birth registration applications that have been endorsed"
    >
      <div className="space-y-4">
        <EndorsedListSearchBar />
        <EndorsedListTable columns={endorsedColumns} />
      </div>
    </PageContainer>
  );
}
