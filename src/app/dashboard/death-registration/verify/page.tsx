import PageContainer from '@/components/layout/page-container';
import { DeathRegistrationVerifyView } from './_components/death-registration-verify-view';

export const metadata = {
  title: 'Death Registration - Verify (LG)'
};

// Dummy data for testing
const dummyData = {
  applicant_cid: '10304001088',
  deceased_cid: '11101001234',
  first_name: 'Dorji',
  middle_name: 'Wangchuk',
  last_name: 'Namgyal',
  date_of_birth: '1990-01-01',
  gender: 'male',
  dzongkhag_id: 'Pema Gatshel',
  gewog_id: 'Nanong',
  village_id: 'Terphu',
  house_hold_no: '112674',
  house_no: 'Ga-3-879',
  is_health_registered: false,
  date_of_death: '2026-02-05',
  time_of_death: '14:30:00',
  cause_of_death: 'Natural causes',
  place_of_death: 'Thimphu',
  country_of_death_id: 'Bhutan',
  dzongkhag_of_death_id: 'Pema Gatshel',
  gewog_of_death_id: 'Nanong',
  village_of_death_id: 'Terphu',
  city_id: 'Pema Gatshel',
  death_certificate_url: 'https://example.com/certificate.pdf',
  status: 'SUBMITTED'
};

export default function DeathRegistrationVerifyPage() {
  return (
    <PageContainer
      pageTitle="Death Registration - Verify (LG)"
      pageDescription="Review and verify death registration applications"
    >
      <DeathRegistrationVerifyView data={dummyData} />
    </PageContainer>
  );
}
