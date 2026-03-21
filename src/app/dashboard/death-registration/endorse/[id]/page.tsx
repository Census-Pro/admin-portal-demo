import PageContainer from '@/components/layout/page-container';
import { DeathRegistrationEndorseView } from '../_components/death-registration-endorse-view';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { IconArrowLeft } from '@tabler/icons-react';

export const metadata = {
  title: 'Death Registration - Endorse Details'
};

// Dummy data for testing
const dummyData = {
  applicant_cid: '10203004567',
  deceased_cid: '10203004567',
  first_name: 'Pema',
  middle_name: 'Dorji',
  last_name: 'Tshering',
  date_of_birth: '1960-05-15',
  gender: 'male',
  dzongkhag_id: 'Thimphu',
  gewog_id: 'Chang',
  village_id: 'Babesa',
  house_hold_no: '112890',
  house_no: 'Th-4-123',
  is_health_registered: true,
  date_of_death: '2026-01-15',
  time_of_death: '14:30:00',
  cause_of_death: 'Natural causes',
  place_of_death: 'JDWNRH Hospital',
  country_of_death_id: 'Bhutan',
  dzongkhag_of_death_id: 'Thimphu',
  gewog_of_death_id: 'Chang',
  village_of_death_id: 'Babesa',
  city_id: 'Thimphu City',
  death_certificate_url: './certificate.com',
  status: 'SUBMITTED'
};

interface EndorseDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EndorseDetailPage({
  params
}: EndorseDetailPageProps) {
  const { id } = await params;

  return (
    <PageContainer
      pageTitle="Death Registration - Endorse Details"
      pageDescription={`Reviewing death registration application #${id}`}
      pageHeaderAction={
        <Link href="/dashboard/death-registration/endorse">
          <Button variant="outline">
            <IconArrowLeft className="mr-2 h-4 w-4" />
            Back to Endorsement List
          </Button>
        </Link>
      }
    >
      <DeathRegistrationEndorseView data={dummyData} applicationId={id} />
    </PageContainer>
  );
}
