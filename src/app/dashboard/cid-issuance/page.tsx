import { redirect } from 'next/navigation';

export default function CIDIssuancePage() {
  // Redirect to pending applications by default
  redirect('/dashboard/cid-issuance/pending');
}
