import PageContainer from '@/components/layout/page-container';
import { BirthRegistrationVerifyView } from './_components/birth-registration-verify-view';

export const metadata = {
  title: 'Birth Registration - Verify (LG)'
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

export default function BirthRegistrationVerifyPage() {
  return (
    <PageContainer
      pageTitle="Birth Registration - Verify (LG)"
      pageDescription="Review and verify birth registration applications"
    >
      <BirthRegistrationVerifyView data={dummyData} />
    </PageContainer>
  );
}
