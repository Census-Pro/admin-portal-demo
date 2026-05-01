const assessedIds = new Set<string>();
const paymentDoneIds = new Set<string>();
const approvalDoneIds = new Set<string>();

const renewalAssessedIds = new Set<string>();
const renewalPaymentDoneIds = new Set<string>();
const renewalApprovalDoneIds = new Set<string>();

const replacementAssessedIds = new Set<string>();
const replacementPaymentDoneIds = new Set<string>();
const replacementApprovalDoneIds = new Set<string>();

// Fresh
export function markCidAssessed(id: string) {
  assessedIds.add(id);
}
export function getCidAssessedIds(): Set<string> {
  return assessedIds;
}

export function markCidPaymentDone(id: string) {
  paymentDoneIds.add(id);
}
export function getCidPaymentDoneIds(): Set<string> {
  return paymentDoneIds;
}

export function markCidApprovalDone(id: string) {
  approvalDoneIds.add(id);
}
export function getCidApprovalDoneIds(): Set<string> {
  return approvalDoneIds;
}

// Renewal
export function markCidRenewalAssessed(id: string) {
  renewalAssessedIds.add(id);
}
export function getCidRenewalAssessedIds(): Set<string> {
  return renewalAssessedIds;
}

export function markCidRenewalPaymentDone(id: string) {
  renewalPaymentDoneIds.add(id);
}
export function getCidRenewalPaymentDoneIds(): Set<string> {
  return renewalPaymentDoneIds;
}

export function markCidRenewalApprovalDone(id: string) {
  renewalApprovalDoneIds.add(id);
}
export function getCidRenewalApprovalDoneIds(): Set<string> {
  return renewalApprovalDoneIds;
}

// Replacement
export function markCidReplacementAssessed(id: string) {
  replacementAssessedIds.add(id);
}
export function getCidReplacementAssessedIds(): Set<string> {
  return replacementAssessedIds;
}

export function markCidReplacementPaymentDone(id: string) {
  replacementPaymentDoneIds.add(id);
}
export function getCidReplacementPaymentDoneIds(): Set<string> {
  return replacementPaymentDoneIds;
}

export function markCidReplacementApprovalDone(id: string) {
  replacementApprovalDoneIds.add(id);
}
export function getCidReplacementApprovalDoneIds(): Set<string> {
  return replacementApprovalDoneIds;
}

// Move-in-out Relieving
const verifiedRelievingIds = new Set<string>();

export function markRelievingVerified(id: string) {
  verifiedRelievingIds.add(id);
}
export function getVerifiedRelievingIds(): Set<string> {
  return verifiedRelievingIds;
}

// Move-in-out Receiving/Endorse
const endorsedReceivingIds = new Set<string>();

export function markReceivingEndorsed(id: string) {
  endorsedReceivingIds.add(id);
}
export function getEndorsedReceivingIds(): Set<string> {
  return endorsedReceivingIds;
}

// Move-in-out Receiving/Approve
const approvedReceivingIds = new Set<string>();

export function markReceivingApproved(id: string) {
  approvedReceivingIds.add(id);
}
export function getApprovedReceivingIds(): Set<string> {
  return approvedReceivingIds;
}

// HOH Change Approve
const hohChangeApprovedIds = new Set<string>();

export function markHohChangeApproved(id: string) {
  hohChangeApprovedIds.add(id);
}
export function getHohChangeApprovedIds(): Set<string> {
  return hohChangeApprovedIds;
}

// Birth Registration Verify
const birthVerifiedIds = new Set<string>();

export function markBirthVerified(id: string) {
  birthVerifiedIds.add(id);
}
export function getBirthVerifiedIds(): Set<string> {
  return birthVerifiedIds;
}

// Birth Registration Endorse
const birthEndorsedIds = new Set<string>();

export function markBirthEndorsed(id: string) {
  birthEndorsedIds.add(id);
}
export function getBirthEndorsedIds(): Set<string> {
  return birthEndorsedIds;
}

// Birth Registration Approve
const birthApprovedIds = new Set<string>();

export function markBirthApproved(id: string) {
  birthApprovedIds.add(id);
}
export function getBirthApprovedIds(): Set<string> {
  return birthApprovedIds;
}

// Birth Registration Approve-List
const birthApproveListDoneIds = new Set<string>();

export function markBirthApproveListDone(id: string) {
  birthApproveListDoneIds.add(id);
}
export function getBirthApproveListDoneIds(): Set<string> {
  return birthApproveListDoneIds;
}

// Death Registration Verify
const deathVerifiedIds = new Set<string>();

export function markDeathVerified(id: string) {
  deathVerifiedIds.add(id);
}
export function getDeathVerifiedIds(): Set<string> {
  return deathVerifiedIds;
}

// Death Registration Endorse
const deathEndorsedIds = new Set<string>();

export function markDeathEndorsed(id: string) {
  deathEndorsedIds.add(id);
}
export function getDeathEndorsedIds(): Set<string> {
  return deathEndorsedIds;
}

// Death Registration Approve
const deathApprovedIds = new Set<string>();

export function markDeathApproved(id: string) {
  deathApprovedIds.add(id);
}
export function getDeathApprovedIds(): Set<string> {
  return deathApprovedIds;
}

// Death Registration Approve List
const deathApproveListDoneIds = new Set<string>();

export function markDeathApproveListDone(id: string) {
  deathApproveListDoneIds.add(id);
}
export function getDeathApproveListDoneIds(): Set<string> {
  return deathApproveListDoneIds;
}
