import PageContainer from '@/components/layout/page-container';
import { DataTable } from '@/components/ui/table/data-table';
import { approveListColumns } from './_components/approve-list-columns';
import { ApproveListSearchBar } from './_components/search-bar';

export const metadata = {
  title: 'Death Registration - Approve List'
};

const approvalList = [
  {
    id: '2',
    first_name: 'Kinley',
    middle_name: 'Zangmo',
    last_name: 'Dorji',
    deceased_cid: '10304002345',
    date_of_death: '2026-01-18',
    status: 'VERIFIED',
    created_at: '2026-01-19T11:00:00Z',
    verified_at: '2026-01-22T10:30:00Z'
  },
  {
    id: '3',
    first_name: 'Ugyen',
    last_name: 'Dorji',
    deceased_cid: '10506003456',
    date_of_death: '2026-01-22',
    status: 'VERIFIED',
    created_at: '2026-01-23T08:00:00Z',
    verified_at: '2026-01-25T09:15:00Z'
  }
];

export default function DeathRegistrationApproveListPage() {
  return (
    <PageContainer
      pageTitle="Death Registration - Approve List"
      pageDescription="Death registration applications that have been approved"
    >
      <div className="space-y-4">
        <ApproveListSearchBar />
        <DataTable
          columns={approveListColumns}
          data={approvalList}
          totalItems={approvalList.length}
        />
      </div>
    </PageContainer>
  );
}
