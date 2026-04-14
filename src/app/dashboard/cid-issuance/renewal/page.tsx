import { redirect } from 'next/navigation';

export default function RenewalCIDIssuancePage() {
  // Redirect to assessment page by default
  redirect('/dashboard/cid-issuance/renewal/assessment');
}
