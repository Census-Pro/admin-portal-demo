import { redirect } from 'next/navigation';

export default function ReplacementCIDIssuancePage() {
  // Redirect to assessment page by default
  redirect('/dashboard/cid-issuance/replacement/assessment');
}
