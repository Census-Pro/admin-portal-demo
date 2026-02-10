import { Suspense } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';
import { DeathRegistrationApproveView } from '../_components/death-registration-approve-view';

export const metadata = {
  title: 'Approve Death Registration'
};

// Dummy data for testing
const dummyData = {
  applicant_cid: '10304001088',
  deceased_cid: '11101001234',
  first_name: 'Kinley',
  middle_name: 'Zangmo',
  last_name: 'Dorji',
  date_of_birth: '1945-03-15',
  gender: 'female',
  dzongkhag_id: 'Pema Gatshel',
  gewog_id: 'Nanong',
  village_id: 'Terphu',
  house_hold_no: '112674',
  house_no: 'Ga-3-879',
  is_health_registered: false,
  date_of_death: '2026-01-18',
  time_of_death: '09:15:00',
  cause_of_death: 'Natural causes',
  place_of_death: 'Paro',
  country_of_death_id: 'Bhutan',
  dzongkhag_of_death_id: 'Pema Gatshel',
  gewog_of_death_id: 'Nanong',
  village_of_death_id: 'Terphu',
  city_id: 'Pema Gatshel',
  death_certificate_url: 'https://example.com/certificate.pdf',
  status: 'VERIFIED'
};

export default async function DeathRegistrationApproveDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id } = await params;
  // TODO: Use id to fetch actual data from API when backend is ready

  return (
    <PageContainer
      pageTitle="Approve Death Registration"
      pageDescription="Review and approve the death registration"
    >
      <div className="space-y-4">
        <Link href="/dashboard/death-registration/approve">
          <Button variant="outline" size="sm">
            <IconArrowLeft className="mr-2 h-4 w-4" />
            Back to Approval List
          </Button>
        </Link>

        <Suspense fallback={<div>Loading...</div>}>
          <DeathRegistrationApproveView data={dummyData} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
