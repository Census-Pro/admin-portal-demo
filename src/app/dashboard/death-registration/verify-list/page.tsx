import PageContainer from '@/components/layout/page-container';
import { DataTable } from '@/components/ui/table/data-table';
import { verifyListColumns } from './_components/verify-list-columns';
import { VerifyListSearchBar } from './_components/search-bar';

export const metadata = {
  title: 'Death Registration - Verify List'
};

const verificationList = [
  {
    id: '1',
    first_name: 'Pema',
    middle_name: 'Dorji',
    last_name: 'Tshering',
    deceased_cid: '10203004567',
    date_of_death: '2026-01-15',
    status: 'SUBMITTED',
    created_at: '2026-01-16T09:20:00Z'
  },
  {
    id: '4',
    first_name: 'Sonam',
    middle_name: 'Choden',
    last_name: 'Wangdi',
    deceased_cid: '10405007890',
    date_of_death: '2026-01-20',
    status: 'SUBMITTED',
    created_at: '2026-01-21T14:30:00Z'
  }
];

export default function DeathRegistrationVerifyListPage() {
  return (
    <PageContainer
      pageTitle="Death Registration - Verify List"
      pageDescription="Death registration applications that have been verified"
    >
      <div className="space-y-4">
        <VerifyListSearchBar />
        <DataTable
          columns={verifyListColumns}
          data={verificationList}
          totalItems={verificationList.length}
        />
      </div>
    </PageContainer>
  );
}
