import { redirect } from 'next/navigation';

export default function CIDIssuancePage() {
  // Redirect to approve applications by default
  redirect('/dashboard/cid-issuance/approve');
}
