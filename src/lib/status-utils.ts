export type StatusType =
  | 'submitted'
  | 'received'
  | 'processing'
  | 'in_review'
  | 'pending'
  | 'approved'
  | 'verified'
  | 'successful'
  | 'rejected'
  | 'declined'
  | 'cancelled'
  | 'ready_to_print'
  | 'printed'
  | 'collected'
  | 'endorsed';

export const getStatusColor = (status: string) => {
  const s = status?.toLowerCase().replace(/ /g, '_') || '';

  // Submitted / Received -> Blue
  if (['submitted', 'received'].includes(s)) {
    return {
      variant: 'outline' as const,
      className: 'border-blue-200 text-blue-700 bg-blue-50/50'
    };
  }

  // In Review / Processing -> Yellow / Amber
  if (
    [
      'in_review',
      'processing',
      'pending',
      'pending_verification',
      'ready_to_print'
    ].includes(s)
  ) {
    return {
      variant: 'outline' as const,
      className: 'border-amber-200 text-amber-700 bg-amber-50/50'
    };
  }

  // Approved -> Indigo (Final State - Distinct from Verified)
  if (s === 'approved') {
    return {
      variant: 'outline' as const,
      className: 'border-indigo-200 text-indigo-700 bg-indigo-50/50'
    };
  }

  // Endorsed -> Cyan (distinct from verified)
  if (s === 'endorsed') {
    return {
      variant: 'outline' as const,
      className: 'border-cyan-200 text-cyan-700 bg-cyan-50/50'
    };
  }

  // Verified / Successful -> Green
  if (['verified', 'successful', 'collected', 'printed'].includes(s)) {
    return {
      variant: 'outline' as const,
      className: 'border-green-200 text-green-700 bg-green-50/50'
    };
  }

  // Rejected / Declined -> Red
  if (['rejected', 'declined', 'cancelled'].includes(s)) {
    return {
      variant: 'outline' as const,
      className: 'border-red-200 text-red-700 bg-red-50/50'
    };
  }

  return {
    variant: 'secondary' as const,
    className: ''
  };
};

export const getTypeColor = (type: string) => {
  const t = type?.toUpperCase() || '';

  switch (t) {
    case 'NEW':
      return {
        variant: 'outline' as const,
        className: 'border-teal-200 text-teal-700 bg-teal-50/50'
      };
    case 'RENEWAL':
      return {
        variant: 'outline' as const,
        className: 'border-violet-200 text-violet-700 bg-violet-50/50'
      };
    case 'REPLACEMENT':
      return {
        variant: 'outline' as const,
        className: 'border-rose-200 text-rose-700 bg-rose-50/50'
      };
    case 'UPDATE':
      return {
        variant: 'outline' as const,
        className: 'border-slate-200 text-slate-700 bg-slate-50/50'
      };
    default:
      return {
        variant: 'outline' as const,
        className: 'border-gray-200 text-gray-700 bg-gray-50/50'
      };
  }
};
