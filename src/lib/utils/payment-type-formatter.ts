/**
 * Format payment type to display format (Title Case)
 * @param paymentType - lowercase payment type from database
 * @returns formatted payment type for display
 */
export function formatPaymentType(paymentType: string): string {
  // Map of lowercase to Title Case
  const paymentTypeMap: Record<string, string> = {
    'new cid application': 'New Cid Application',
    'cid renewal': 'Cid Renewal',
    'cid replacement': 'Cid Replacement',
    'relationship application': 'Relationship Application',
    'nationality certificate': 'Nationality Certificate'
  };

  return paymentTypeMap[paymentType.toLowerCase()] || paymentType;
}
