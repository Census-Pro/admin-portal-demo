import PageContainer from '@/components/layout/page-container';
import { BirthRegistrationEndorseView } from '../_components/birth-registration-endorse-view';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { IconArrowLeft } from '@tabler/icons-react';

export const metadata = {
  title: 'Birth Registration - Endorse Details'
};

// Dummy data for testing
const dummyData = {
  applicant_cid: '10304001088',
  is_born_in_bhutan: true,
  is_applicant_parent: true,
  is_epis_registered: false,
  birth_country_id: 'Bhutan',
  birth_city_id: 'a5ae8e48-51f2-434e-95dd-810d9fb2f1dc',
  birth_dzongkhag_id: 'Tsirang',
  birth_gewog_id: 'Damphu',
  birth_village_id: 'Dumi',
  first_name: 'Jigme',
  middle_name: 'Phuntsho',
  last_name: 'Chonjure',
  date_of_birth: '2026-02-04',
  time_of_birth: '10:30:00',
  gender: 'male',
  weight: 3.5,
  is_mc_valid: true,
  father_cid: '11101001234',
  mother_cid: '10304001088',
  guarantor_cid: '12003004567',
  relationship: 'Uncle',
  house_hold_no: '112674',
  house_no: 'Ga-3-879',
  dzongkhag_id: 'Pema Gatshel',
  gewog_id: 'Nanong',
  village_id: 'Terphu',
  birth_certificate_url: './certificate.com',
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
      pageTitle="Birth Registration - Endorse Details"
      pageDescription={`Reviewing birth registration application #${id}`}
      pageHeaderAction={
        <Link href="/dashboard/birth-registration/endorse">
          <Button variant="outline">
            <IconArrowLeft className="mr-2 h-4 w-4" />
            Back to Endorsement List
          </Button>
        </Link>
      }
    >
      <BirthRegistrationEndorseView data={dummyData} />
    </PageContainer>
  );
}
