import PageContainer from '@/components/layout/page-container';
import { DataTable } from '@/components/ui/table/data-table';
import { endorseListColumns } from './_components/endorse-list-columns';
import { EndorseListSearchBar } from './_components/search-bar';

export const metadata = {
  title: 'Death Registration - Endorse List'
};

const endorsementList = [
  {
    id: '1',
    first_name: 'Pema',
    middle_name: 'Dorji',
    last_name: 'Tshering',
    deceased_cid: '10203004567',
    date_of_death: '2026-01-15',
    status: 'ENDORSED',
    created_at: '2026-01-16T09:20:00Z'
  },
  {
    id: '4',
    first_name: 'Sonam',
    middle_name: 'Choden',
    last_name: 'Wangdi',
    deceased_cid: '10405007890',
    date_of_death: '2026-01-20',
    status: 'ENDORSED',
    created_at: '2026-01-21T14:30:00Z'
  },
  {
    id: '6',
    first_name: 'Tashi',
    last_name: 'Namgyal',
    deceased_cid: '11206005432',
    date_of_death: '2026-02-05',
    status: 'ENDORSED',
    created_at: '2026-02-06T11:45:00Z'
  }
];

export default function DeathRegistrationEndorseListPage() {
  return (
    <PageContainer
      pageTitle="Death Registration - Endorse List"
      pageDescription="Death registration applications that have been endorsed"
    >
      <div className="space-y-4">
        <EndorseListSearchBar />
        <DataTable
          columns={endorseListColumns}
          data={endorsementList}
          totalItems={endorsementList.length}
        />
      </div>
    </PageContainer>
  );
}
