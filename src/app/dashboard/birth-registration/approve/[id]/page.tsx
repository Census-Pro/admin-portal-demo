import PageContainer from '@/components/layout/page-container';
import { BirthRegistrationApproveView } from '../_components/birth-registration-approve-view';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { IconArrowLeft } from '@tabler/icons-react';

export const metadata = {
  title: 'Birth Registration - Approve Details'
};

// Dummy data for testing
const dummyData = {
  applicant_cid: '11101002345',
  is_born_in_bhutan: true,
  is_applicant_parent: true,
  is_epis_registered: false,
  birth_country_id: 'Bhutan',
  birth_city_id: 'a5ae8e48-51f2-434e-95dd-810d9fb2f1dc',
  birth_dzongkhag_id: 'Thimphu',
  birth_gewog_id: 'Chang',
  birth_village_id: 'Dechencholing',
  first_name: 'Pema',
  middle_name: 'Dorji',
  last_name: 'Wangchuk',
  date_of_birth: '2026-01-15',
  time_of_birth: '14:20:00',
  gender: 'female',
  weight: 3.2,
  is_mc_valid: true,
  father_cid: '10405002345',
  mother_cid: '11101002345',
  guarantor_cid: '12004005678',
  relationship: 'Aunt',
  house_hold_no: '123456',
  house_no: 'Th-1-234',
  dzongkhag_id: 'Thimphu',
  gewog_id: 'Chang',
  village_id: 'Dechencholing',
  birth_certificate_url: './certificate.com',
  status: 'VERIFIED'
};

interface ApproveDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ApproveDetailPage({
  params
}: ApproveDetailPageProps) {
  const { id } = await params;

  return (
    <PageContainer
      pageTitle="Birth Registration - Approve Details"
      pageDescription={`Reviewing birth registration application #${id} for final approval`}
      pageHeaderAction={
        <Link href="/dashboard/birth-registration/approve">
          <Button variant="outline">
            <IconArrowLeft className="mr-2 h-4 w-4" />
            Back to Approval List
          </Button>
        </Link>
      }
    >
      <BirthRegistrationApproveView data={dummyData} />
    </PageContainer>
  );
}
