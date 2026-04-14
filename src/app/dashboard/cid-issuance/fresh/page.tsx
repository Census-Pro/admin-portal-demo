import { redirect } from 'next/navigation';

export default function FreshCIDIssuancePage() {
  // Redirect to assessment page by default
  redirect('/dashboard/cid-issuance/fresh/assessment');
}
