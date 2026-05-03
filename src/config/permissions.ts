/**
 * Centralized Permission Constants
 *
 * This file defines all available permissions in the system.
 * Permissions follow the pattern: action:subject
 *
 * Actions: manage, view, create, edit, delete, verify, approve
 * Subjects: all, users, roles, permissions, birth-registration, cid-issuance, etc.
 */

// ============================================================================
// SUPER ADMIN PERMISSIONS
// ============================================================================

export const MANAGE_ALL = 'manage:all' as const;

// ============================================================================
// USER MANAGEMENT PERMISSIONS
// ============================================================================

export const VIEW_USERS = 'read:user' as const;
export const CREATE_USERS = 'create:user' as const;
export const EDIT_USERS = 'update:user' as const;
export const DELETE_USERS = 'delete:user' as const;
export const MANAGE_USERS = 'manage:user' as const;

// ============================================================================
// ROLE & PERMISSION MANAGEMENT
// ============================================================================

export const VIEW_ROLES = 'read:roles' as const;
export const CREATE_ROLES = 'create:roles' as const;
export const EDIT_ROLES = 'update:roles' as const;
export const DELETE_ROLES = 'delete:roles' as const;
export const MANAGE_ROLES = 'manage:roles' as const;

export const VIEW_PERMISSIONS = 'read:permissions' as const;
export const CREATE_PERMISSIONS = 'create:permissions' as const;
export const EDIT_PERMISSIONS = 'update:permissions' as const;
export const DELETE_PERMISSIONS = 'delete:permissions' as const;
export const MANAGE_PERMISSIONS = 'manage:permissions' as const;

// ============================================================================
// BIRTH REGISTRATION PERMISSIONS
// ============================================================================

// Workflow-specific permissions (match subject names in nav-config)
export const MANAGE_BIRTH_REGISTRATION_PENDING =
  'manage:birth-registration-pending' as const;
export const MANAGE_BIRTH_REGISTRATION_ENDORSE =
  'manage:birth-registration-endorse' as const;
export const MANAGE_BIRTH_REGISTRATION_VERIFY =
  'manage:birth-registration-verify' as const;
export const MANAGE_BIRTH_REGISTRATION_APPROVE =
  'manage:birth-registration-approve' as const;

// General birth registration permission (grants access to all workflow steps)
export const MANAGE_BIRTH_REGISTRATION = 'manage:birth-registration' as const;

// Legacy permissions (kept for backward compatibility, can be removed later)
export const VIEW_BIRTH_REGISTRATION = 'read:birth-registration' as const;
export const CREATE_BIRTH_REGISTRATION = 'create:birth-registration' as const;
export const EDIT_BIRTH_REGISTRATION = 'update:birth-registration' as const;
export const DELETE_BIRTH_REGISTRATION = 'delete:birth-registration' as const;
export const VERIFY_BIRTH_REGISTRATION = 'verify:birth-registration' as const;
export const APPROVE_BIRTH_REGISTRATION = 'approve:birth-registration' as const;
export const ENDORSE_BIRTH_REGISTRATION = 'endorse:birth-registration' as const;

// ============================================================================
// CID ISSUANCE PERMISSIONS
// ============================================================================

// Workflow-specific permissions (match subject names in nav-config)
export const MANAGE_CID_ISSUANCE_PENDING =
  'manage:cid-issuance-pending' as const;
export const MANAGE_CID_ISSUANCE_VERIFY = 'manage:cid-issuance-verify' as const;
export const MANAGE_CID_ISSUANCE_APPROVE =
  'manage:cid-issuance-approve' as const;
export const MANAGE_CID_ISSUANCE_PRINT = 'manage:cid-issuance-print' as const;

// Fresh CID Issuance permissions
export const MANAGE_CID_ISSUANCE_FRESH_ASSESSMENT =
  'manage:cid-issuance-fresh-assessment' as const;
export const MANAGE_CID_ISSUANCE_FRESH_PAYMENT =
  'manage:cid-issuance-fresh-payment' as const;
export const MANAGE_CID_ISSUANCE_FRESH_APPROVAL =
  'manage:cid-issuance-fresh-approval' as const;

// Renewal CID Issuance permissions
export const MANAGE_CID_ISSUANCE_RENEWAL_ASSESSMENT =
  'manage:cid-issuance-renewal-assessment' as const;
export const MANAGE_CID_ISSUANCE_RENEWAL_PAYMENT =
  'manage:cid-issuance-renewal-payment' as const;
export const MANAGE_CID_ISSUANCE_RENEWAL_APPROVAL =
  'manage:cid-issuance-renewal-approval' as const;

// Replacement CID Issuance permissions
export const MANAGE_CID_ISSUANCE_REPLACEMENT_ASSESSMENT =
  'manage:cid-issuance-replacement-assessment' as const;
export const MANAGE_CID_ISSUANCE_REPLACEMENT_PAYMENT =
  'manage:cid-issuance-replacement-payment' as const;
export const MANAGE_CID_ISSUANCE_REPLACEMENT_APPROVAL =
  'manage:cid-issuance-replacement-approval' as const;

// General CID issuance permission (grants access to all workflow steps)
export const MANAGE_CID_ISSUANCE = 'manage:cid-issuance' as const;

// CID Dispatch and Receive
export const MANAGE_CID_DISPATCH = 'manage:cid-dispatch' as const;
export const MANAGE_CID_RECEIVE = 'manage:cid-receive' as const;

// Legacy permissions (kept for backward compatibility)
export const VIEW_CID_ISSUANCE = 'read:cid-issuance' as const;
export const CREATE_CID_ISSUANCE = 'create:cid-issuance' as const;
export const EDIT_CID_ISSUANCE = 'update:cid-issuance' as const;
export const DELETE_CID_ISSUANCE = 'delete:cid-issuance' as const;
export const VERIFY_CID_ISSUANCE = 'verify:cid-issuance' as const;
export const APPROVE_CID_ISSUANCE = 'approve:cid-issuance' as const;

// ============================================================================
// NATIONALITY CERTIFICATE APPLICATIONS PERMISSIONS
// ============================================================================

// Workflow-specific permissions
export const MANAGE_NATIONALITY_CERTIFICATE_ASSESSMENT =
  'manage:nationality-certificate-assessment' as const;
export const MANAGE_NATIONALITY_CERTIFICATE_PAYMENT =
  'manage:nationality-certificate-payment' as const;
export const MANAGE_NATIONALITY_CERTIFICATE_APPROVAL =
  'manage:nationality-certificate-approval' as const;

// General nationality certificate permission (grants access to all workflow steps)
export const MANAGE_NATIONALITY_CERTIFICATE =
  'manage:nationality-certificate' as const;

// ============================================================================
// RELATION CERTIFICATE PERMISSIONS
// ============================================================================

// Workflow-specific permissions
export const MANAGE_RELATION_CERTIFICATE_ASSESSMENT =
  'manage:relation-certificate-assessment' as const;
export const MANAGE_RELATION_CERTIFICATE_PAYMENT =
  'manage:relation-certificate-payment' as const;
export const MANAGE_RELATION_CERTIFICATE_APPROVAL =
  'manage:relation-certificate-approval' as const;

// General relation certificate permission (grants access to all workflow steps)
export const MANAGE_RELATION_CERTIFICATE =
  'manage:relation-certificate' as const;

// ============================================================================
// MOVE IN/OUT PERMISSIONS
// ============================================================================

export const VIEW_MOVE_IN_OUT = 'read:move-in-out' as const;
export const CREATE_MOVE_IN_OUT = 'create:move-in-out' as const;
export const EDIT_MOVE_IN_OUT = 'update:move-in-out' as const;
export const DELETE_MOVE_IN_OUT = 'delete:move-in-out' as const;
export const VERIFY_MOVE_IN_OUT = 'verify:move-in-out' as const;
export const APPROVE_MOVE_IN_OUT = 'approve:move-in-out' as const;
export const MANAGE_MOVE_IN_OUT = 'manage:move-in-out' as const;

// ============================================================================
// AGENCY PERMISSIONS
// ============================================================================

export const VIEW_AGENCIES = 'read:agencies' as const;
export const CREATE_AGENCIES = 'create:agencies' as const;
export const EDIT_AGENCIES = 'update:agencies' as const;
export const DELETE_AGENCIES = 'delete:agencies' as const;
export const MANAGE_AGENCIES = 'manage:agencies' as const;

// ============================================================================
// OFFICE LOCATION PERMISSIONS
// ============================================================================

export const VIEW_OFFICE_LOCATIONS = 'read:office-locations' as const;
export const CREATE_OFFICE_LOCATIONS = 'create:office-locations' as const;
export const EDIT_OFFICE_LOCATIONS = 'update:office-locations' as const;
export const DELETE_OFFICE_LOCATIONS = 'delete:office-locations' as const;
export const MANAGE_OFFICE_LOCATIONS = 'manage:office-locations' as const;

// ============================================================================
// RELATIONSHIP TYPES PERMISSIONS
// ============================================================================

export const VIEW_RELATIONSHIP_TYPES = 'read:relationship-types' as const;
export const CREATE_RELATIONSHIP_TYPES = 'create:relationship-types' as const;
export const EDIT_RELATIONSHIP_TYPES = 'update:relationship-types' as const;
export const DELETE_RELATIONSHIP_TYPES = 'delete:relationship-types' as const;
export const MANAGE_RELATIONSHIP_TYPES = 'manage:relationship-types' as const;

// ============================================================================
// RELATIONSHIPS PERMISSIONS
// ============================================================================

export const VIEW_RELATIONSHIPS = 'read:relationships' as const;
export const CREATE_RELATIONSHIPS = 'create:relationships' as const;
export const EDIT_RELATIONSHIPS = 'update:relationships' as const;
export const DELETE_RELATIONSHIPS = 'delete:relationships' as const;
export const VERIFY_RELATIONSHIPS = 'verify:relationships' as const;
export const APPROVE_RELATIONSHIPS = 'approve:relationships' as const;
export const MANAGE_RELATIONSHIPS = 'manage:relationships' as const;

// ============================================================================
// NATURALIZATION/REGULARIZATION PERMISSIONS
// ============================================================================

// ============================================================================
// DEATH REGISTRATION PERMISSIONS
// ============================================================================

// Workflow-specific permissions (match subject names in nav-config)
export const MANAGE_DEATH_REGISTRATION_PENDING =
  'manage:death-registration-pending' as const;
export const MANAGE_DEATH_REGISTRATION_ENDORSE =
  'manage:death-registration-endorse' as const;
export const MANAGE_DEATH_REGISTRATION_VERIFY =
  'manage:death-registration-verify' as const;
export const MANAGE_DEATH_REGISTRATION_APPROVE =
  'manage:death-registration-approve' as const;

// General death registration permission (grants access to all workflow steps)
export const MANAGE_DEATH_REGISTRATION = 'manage:death-registration' as const;

// Legacy permissions (kept for backward compatibility, can be removed later)
export const VIEW_DEATH_REGISTRATION = 'read:death-registration' as const;
export const CREATE_DEATH_REGISTRATION = 'create:death-registration' as const;
export const EDIT_DEATH_REGISTRATION = 'update:death-registration' as const;
export const DELETE_DEATH_REGISTRATION = 'delete:death-registration' as const;
export const VERIFY_DEATH_REGISTRATION = 'verify:death-registration' as const;
export const APPROVE_DEATH_REGISTRATION = 'approve:death-registration' as const;
export const ENDORSE_DEATH_REGISTRATION = 'endorse:death-registration' as const;

// ============================================================================
// HOH CHANGE MANAGEMENT PERMISSIONS
// ============================================================================

export const MANAGE_HOH_CHANGE = 'manage:hoh-change' as const;
export const VIEW_HOH_CHANGE = 'read:hoh-change' as const;
export const CREATE_HOH_CHANGE = 'create:hoh-change' as const;
export const EDIT_HOH_CHANGE = 'update:hoh-change' as const;
export const DELETE_HOH_CHANGE = 'delete:hoh-change' as const;
export const MANAGE_HOH_CHANGE_REASON = 'manage:hoh-change-reason' as const;

// ============================================================================
// COUNTRY PERMISSIONS
// ============================================================================

export const VIEW_COUNTRIES = 'read:countries' as const;
export const CREATE_COUNTRIES = 'create:countries' as const;
export const EDIT_COUNTRIES = 'update:countries' as const;
export const DELETE_COUNTRIES = 'delete:countries' as const;
export const MANAGE_COUNTRIES = 'manage:countries' as const;

// ============================================================================
// DZONGKHAG PERMISSIONS
// ============================================================================

export const VIEW_DZONGKHAGS = 'read:dzongkhags' as const;
export const CREATE_DZONGKHAGS = 'create:dzongkhags' as const;
export const EDIT_DZONGKHAGS = 'update:dzongkhags' as const;
export const DELETE_DZONGKHAGS = 'delete:dzongkhags' as const;
export const MANAGE_DZONGKHAGS = 'manage:dzongkhags' as const;

// ============================================================================
// GEWOG PERMISSIONS
// ============================================================================

export const VIEW_GEWOGS = 'read:gewogs' as const;
export const CREATE_GEWOGS = 'create:gewogs' as const;
export const EDIT_GEWOGS = 'update:gewogs' as const;
export const DELETE_GEWOGS = 'delete:gewogs' as const;
export const MANAGE_GEWOGS = 'manage:gewogs' as const;

// ============================================================================
// CHIWOG PERMISSIONS
// ============================================================================

export const VIEW_CHIWOGS = 'read:chiwogs' as const;
export const CREATE_CHIWOGS = 'create:chiwogs' as const;
export const EDIT_CHIWOGS = 'update:chiwogs' as const;
export const DELETE_CHIWOGS = 'delete:chiwogs' as const;
export const MANAGE_CHIWOGS = 'manage:chiwogs' as const;

// ============================================================================
// VILLAGE PERMISSIONS
// ============================================================================

export const VIEW_VILLAGES = 'read:villages' as const;
export const CREATE_VILLAGES = 'create:villages' as const;
export const EDIT_VILLAGES = 'update:villages' as const;
export const DELETE_VILLAGES = 'delete:villages' as const;
export const MANAGE_VILLAGES = 'manage:villages' as const;

// ============================================================================
// CITY PERMISSIONS
// ============================================================================

export const VIEW_CITIES = 'read:cities' as const;
export const CREATE_CITIES = 'create:cities' as const;
export const EDIT_CITIES = 'update:cities' as const;
export const DELETE_CITIES = 'delete:cities' as const;
export const MANAGE_CITIES = 'manage:cities' as const;

// ============================================================================
// MAJOR THROMDE PERMISSIONS
// ============================================================================

export const VIEW_MAJOR_THROMDES = 'read:major-thromdes' as const;
export const CREATE_MAJOR_THROMDES = 'create:major-thromdes' as const;
export const EDIT_MAJOR_THROMDES = 'update:major-thromdes' as const;
export const DELETE_MAJOR_THROMDES = 'delete:major-thromdes' as const;
export const MANAGE_MAJOR_THROMDES = 'manage:major-thromdes' as const;

// ============================================================================
// MINOR THROMDE PERMISSIONS
// ============================================================================

export const VIEW_MINOR_THROMDES = 'read:minor-thromdes' as const;
export const CREATE_MINOR_THROMDES = 'create:minor-thromdes' as const;
export const EDIT_MINOR_THROMDES = 'update:minor-thromdes' as const;
export const DELETE_MINOR_THROMDES = 'delete:minor-thromdes' as const;
export const MANAGE_MINOR_THROMDES = 'manage:minor-thromdes' as const;

// ============================================================================
// CID APPLICATION REASON PERMISSIONS
// ============================================================================

export const VIEW_CID_APPLICATION_REASONS =
  'read:cid-application-reasons' as const;
export const CREATE_CID_APPLICATION_REASONS =
  'create:cid-application-reasons' as const;
export const EDIT_CID_APPLICATION_REASONS =
  'update:cid-application-reasons' as const;
export const DELETE_CID_APPLICATION_REASONS =
  'delete:cid-application-reasons' as const;
export const MANAGE_CID_APPLICATION_REASONS =
  'manage:cid-application-reasons' as const;

// ============================================================================
// PAYMENT SERVICE TYPE PERMISSIONS
// ============================================================================

export const VIEW_PAYMENT_SERVICE_TYPES = 'read:payment-service-types' as const;
export const CREATE_PAYMENT_SERVICE_TYPES =
  'create:payment-service-types' as const;
export const EDIT_PAYMENT_SERVICE_TYPES =
  'update:payment-service-types' as const;
export const DELETE_PAYMENT_SERVICE_TYPES =
  'delete:payment-service-types' as const;
export const MANAGE_PAYMENT_SERVICE_TYPES =
  'manage:payment-service-types' as const;

// ============================================================================
// FINE TYPE PERMISSIONS
// ============================================================================

export const VIEW_FINE_TYPES = 'read:fine-types' as const;
export const CREATE_FINE_TYPES = 'create:fine-types' as const;
export const EDIT_FINE_TYPES = 'update:fine-types' as const;
export const DELETE_FINE_TYPES = 'delete:fine-types' as const;
export const MANAGE_FINE_TYPES = 'manage:fine-types' as const;

// ============================================================================
// GENDER PERMISSIONS
// ============================================================================

export const VIEW_GENDERS = 'read:genders' as const;
export const CREATE_GENDERS = 'create:genders' as const;
export const EDIT_GENDERS = 'update:genders' as const;
export const DELETE_GENDERS = 'delete:genders' as const;
export const MANAGE_GENDERS = 'manage:genders' as const;

// ============================================================================
// MARITAL STATUS PERMISSIONS
// ============================================================================

export const VIEW_MARITAL_STATUS = 'read:marital-status' as const;
export const CREATE_MARITAL_STATUS = 'create:marital-status' as const;
export const EDIT_MARITAL_STATUS = 'update:marital-status' as const;
export const DELETE_MARITAL_STATUS = 'delete:marital-status' as const;
export const MANAGE_MARITAL_STATUS = 'manage:marital-status' as const;

// ============================================================================
// LITERACY STATUS PERMISSIONS
// ============================================================================

export const VIEW_LITERACY_STATUS = 'read:literacy-status' as const;
export const CREATE_LITERACY_STATUS = 'create:literacy-status' as const;
export const EDIT_LITERACY_STATUS = 'update:literacy-status' as const;
export const DELETE_LITERACY_STATUS = 'delete:literacy-status' as const;
export const MANAGE_LITERACY_STATUS = 'manage:literacy-status' as const;

// ============================================================================
// CENSUS STATUS PERMISSIONS
// ============================================================================

export const VIEW_CENSUS_STATUS = 'read:census-status' as const;
export const CREATE_CENSUS_STATUS = 'create:census-status' as const;
export const EDIT_CENSUS_STATUS = 'update:census-status' as const;
export const DELETE_CENSUS_STATUS = 'delete:census-status' as const;
export const MANAGE_CENSUS_STATUS = 'manage:census-status' as const;

// ============================================================================
// NATURALIZATION TYPE PERMISSIONS
// ============================================================================

export const VIEW_NATURALIZATION_TYPES = 'read:naturalization-types' as const;
export const CREATE_NATURALIZATION_TYPES =
  'create:naturalization-types' as const;
export const EDIT_NATURALIZATION_TYPES = 'update:naturalization-types' as const;
export const DELETE_NATURALIZATION_TYPES =
  'delete:naturalization-types' as const;
export const MANAGE_NATURALIZATION_TYPES =
  'manage:naturalization-types' as const;

// ============================================================================
// REGULARIZATION TYPE PERMISSIONS
// ============================================================================

export const VIEW_REGULARIZATION_TYPES = 'read:regularization-types' as const;
export const CREATE_REGULARIZATION_TYPES =
  'create:regularization-types' as const;
export const EDIT_REGULARIZATION_TYPES = 'update:regularization-types' as const;
export const DELETE_REGULARIZATION_TYPES =
  'delete:regularization-types' as const;
export const MANAGE_REGULARIZATION_TYPES =
  'manage:regularization-types' as const;

// ============================================================================
// RELATIONSHIP CERTIFICATE PURPOSE PERMISSIONS
// ============================================================================

export const VIEW_RELATIONSHIP_CERTIFICATE_PURPOSES =
  'read:relationship-certificate-purposes' as const;
export const CREATE_RELATIONSHIP_CERTIFICATE_PURPOSES =
  'create:relationship-certificate-purposes' as const;
export const EDIT_RELATIONSHIP_CERTIFICATE_PURPOSES =
  'update:relationship-certificate-purposes' as const;
export const DELETE_RELATIONSHIP_CERTIFICATE_PURPOSES =
  'delete:relationship-certificate-purposes' as const;
export const MANAGE_RELATIONSHIP_CERTIFICATE_PURPOSES =
  'manage:relationship-certificate-purposes' as const;

// ============================================================================
// OPERATOR PERMISSIONS
// ============================================================================

export const VIEW_OPERATORS = 'read:operators' as const;
export const CREATE_OPERATORS = 'create:operators' as const;
export const EDIT_OPERATORS = 'update:operators' as const;
export const DELETE_OPERATORS = 'delete:operators' as const;
export const MANAGE_OPERATORS = 'manage:operators' as const;

// ============================================================================
// CID COLLECTION POINTS PERMISSIONS
// ============================================================================

export const VIEW_CID_COLLECTION_POINTS = 'read:cid-collection-points' as const;
export const CREATE_CID_COLLECTION_POINTS =
  'create:cid-collection-points' as const;
export const EDIT_CID_COLLECTION_POINTS =
  'update:cid-collection-points' as const;
export const DELETE_CID_COLLECTION_POINTS =
  'delete:cid-collection-points' as const;
export const MANAGE_CID_COLLECTION_POINTS =
  'manage:cid-collection-points' as const;

// ============================================================================
// RESETTLEMENT PERMISSIONS
// ============================================================================

export const VIEW_RESETTLEMENT = 'read:resettlement' as const;
export const CREATE_RESETTLEMENT = 'create:resettlement' as const;
export const EDIT_RESETTLEMENT = 'update:resettlement' as const;
export const DELETE_RESETTLEMENT = 'delete:resettlement' as const;
export const MANAGE_RESETTLEMENT = 'manage:resettlement' as const;

// ============================================================================
// CMS PERMISSIONS
// ============================================================================

export const VIEW_ANNOUNCEMENTS = 'read:announcements' as const;
export const CREATE_ANNOUNCEMENTS = 'create:announcements' as const;
export const EDIT_ANNOUNCEMENTS = 'update:announcements' as const;
export const DELETE_ANNOUNCEMENTS = 'delete:announcements' as const;
export const MANAGE_ANNOUNCEMENTS = 'manage:announcements' as const;

export const VIEW_CONTENT = 'read:content' as const;
export const CREATE_CONTENT = 'create:content' as const;
export const EDIT_CONTENT = 'update:content' as const;
export const DELETE_CONTENT = 'delete:content' as const;
export const MANAGE_CONTENT = 'manage:content' as const;

export const VIEW_MEDIA_LIBRARY = 'read:media-library' as const;
export const CREATE_MEDIA_LIBRARY = 'create:media-library' as const;
export const EDIT_MEDIA_LIBRARY = 'update:media-library' as const;
export const DELETE_MEDIA_LIBRARY = 'delete:media-library' as const;
export const MANAGE_MEDIA_LIBRARY = 'manage:media-library' as const;

export const VIEW_NAVIGATION = 'read:navigation' as const;
export const CREATE_NAVIGATION = 'create:navigation' as const;
export const EDIT_NAVIGATION = 'update:navigation' as const;
export const DELETE_NAVIGATION = 'delete:navigation' as const;
export const MANAGE_NAVIGATION = 'manage:navigation' as const;

export const MANAGE_CMS = 'manage:cms' as const;

// ============================================================================
// DASHBOARD PERMISSIONS
// ============================================================================

export const VIEW_DASHBOARD = 'read:dashboard' as const;

// ============================================================================
// PERMISSION GROUPS (for convenience)
// ============================================================================

/**
 * Super Admin - Full access to everything
 */
export const SUPER_ADMIN_PERMISSIONS = [MANAGE_ALL] as const;

/**
 * Admin - Can view, create, edit, verify, approve but cannot delete
 */
export const ADMIN_PERMISSIONS = [
  VIEW_DASHBOARD,
  VIEW_USERS,
  CREATE_USERS,
  EDIT_USERS,
  MANAGE_USERS,
  VIEW_BIRTH_REGISTRATION,
  CREATE_BIRTH_REGISTRATION,
  EDIT_BIRTH_REGISTRATION,
  VERIFY_BIRTH_REGISTRATION,
  APPROVE_BIRTH_REGISTRATION,
  VIEW_CID_ISSUANCE,
  CREATE_CID_ISSUANCE,
  EDIT_CID_ISSUANCE,
  VERIFY_CID_ISSUANCE,
  APPROVE_CID_ISSUANCE,
  VIEW_MOVE_IN_OUT,
  CREATE_MOVE_IN_OUT,
  EDIT_MOVE_IN_OUT,
  VERIFY_MOVE_IN_OUT,
  APPROVE_MOVE_IN_OUT,
  VIEW_RELATIONSHIPS,
  CREATE_RELATIONSHIPS,
  EDIT_RELATIONSHIPS,
  VERIFY_RELATIONSHIPS,
  APPROVE_RELATIONSHIPS,
  // VIEW_NATURALIZATION,
  // CREATE_NATURALIZATION,
  // EDIT_NATURALIZATION,
  // VERIFY_NATURALIZATION,
  // APPROVE_NATURALIZATION,
  VIEW_DEATH_REGISTRATION,
  CREATE_DEATH_REGISTRATION,
  EDIT_DEATH_REGISTRATION,
  VERIFY_DEATH_REGISTRATION,
  APPROVE_DEATH_REGISTRATION,
  VIEW_HOH_CHANGE,
  CREATE_HOH_CHANGE,
  EDIT_HOH_CHANGE,
  MANAGE_HOH_CHANGE
] as const;

/**
 * Operator - Can view and verify but cannot approve or manage
 */
export const OPERATOR_PERMISSIONS = [
  VIEW_DASHBOARD,
  VIEW_BIRTH_REGISTRATION,
  VERIFY_BIRTH_REGISTRATION,
  VIEW_CID_ISSUANCE,
  VERIFY_CID_ISSUANCE,
  VIEW_MOVE_IN_OUT,
  VERIFY_MOVE_IN_OUT,
  VIEW_RELATIONSHIPS,
  VERIFY_RELATIONSHIPS,
  // VIEW_NATURALIZATION,
  // VERIFY_NATURALIZATION,
  VIEW_DEATH_REGISTRATION,
  VERIFY_DEATH_REGISTRATION,
  VIEW_HOH_CHANGE
] as const;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type Permission =
  | typeof MANAGE_ALL
  | typeof VIEW_USERS
  | typeof CREATE_USERS
  | typeof EDIT_USERS
  | typeof DELETE_USERS
  | typeof MANAGE_USERS
  | typeof VIEW_ROLES
  | typeof CREATE_ROLES
  | typeof EDIT_ROLES
  | typeof DELETE_ROLES
  | typeof MANAGE_ROLES
  | typeof VIEW_PERMISSIONS
  | typeof CREATE_PERMISSIONS
  | typeof EDIT_PERMISSIONS
  | typeof DELETE_PERMISSIONS
  | typeof MANAGE_PERMISSIONS
  | typeof VIEW_BIRTH_REGISTRATION
  | typeof CREATE_BIRTH_REGISTRATION
  | typeof EDIT_BIRTH_REGISTRATION
  | typeof DELETE_BIRTH_REGISTRATION
  | typeof VERIFY_BIRTH_REGISTRATION
  | typeof APPROVE_BIRTH_REGISTRATION
  | typeof ENDORSE_BIRTH_REGISTRATION
  | typeof MANAGE_BIRTH_REGISTRATION
  | typeof MANAGE_BIRTH_REGISTRATION_ENDORSE
  | typeof MANAGE_BIRTH_REGISTRATION_VERIFY
  | typeof MANAGE_BIRTH_REGISTRATION_APPROVE
  | typeof VIEW_CID_ISSUANCE
  | typeof VERIFY_BIRTH_REGISTRATION
  | typeof APPROVE_BIRTH_REGISTRATION
  | typeof MANAGE_BIRTH_REGISTRATION
  | typeof VIEW_CID_ISSUANCE
  | typeof CREATE_CID_ISSUANCE
  | typeof EDIT_CID_ISSUANCE
  | typeof DELETE_CID_ISSUANCE
  | typeof VERIFY_CID_ISSUANCE
  | typeof APPROVE_CID_ISSUANCE
  | typeof MANAGE_CID_ISSUANCE
  | typeof MANAGE_CID_ISSUANCE_FRESH_ASSESSMENT
  | typeof MANAGE_CID_ISSUANCE_FRESH_PAYMENT
  | typeof MANAGE_CID_ISSUANCE_FRESH_APPROVAL
  | typeof MANAGE_CID_ISSUANCE_RENEWAL_ASSESSMENT
  | typeof MANAGE_CID_ISSUANCE_RENEWAL_PAYMENT
  | typeof MANAGE_CID_ISSUANCE_RENEWAL_APPROVAL
  | typeof MANAGE_CID_ISSUANCE_REPLACEMENT_ASSESSMENT
  | typeof MANAGE_CID_ISSUANCE_REPLACEMENT_PAYMENT
  | typeof MANAGE_CID_ISSUANCE_REPLACEMENT_APPROVAL
  | typeof MANAGE_CID_DISPATCH
  | typeof MANAGE_CID_RECEIVE
  | typeof VIEW_MOVE_IN_OUT
  | typeof CREATE_MOVE_IN_OUT
  | typeof EDIT_MOVE_IN_OUT
  | typeof DELETE_MOVE_IN_OUT
  | typeof VERIFY_MOVE_IN_OUT
  | typeof APPROVE_MOVE_IN_OUT
  | typeof MANAGE_MOVE_IN_OUT
  | typeof VIEW_RELATIONSHIPS
  | typeof CREATE_RELATIONSHIPS
  | typeof EDIT_RELATIONSHIPS
  | typeof DELETE_RELATIONSHIPS
  | typeof VERIFY_RELATIONSHIPS
  | typeof APPROVE_RELATIONSHIPS
  | typeof MANAGE_RELATIONSHIPS
  // | typeof VIEW_NATURALIZATION
  // | typeof CREATE_NATURALIZATION
  // | typeof EDIT_NATURALIZATION
  // | typeof DELETE_NATURALIZATION
  // | typeof VERIFY_NATURALIZATION
  // | typeof APPROVE_NATURALIZATION
  // | typeof MANAGE_NATURALIZATION
  | typeof VIEW_DEATH_REGISTRATION
  | typeof CREATE_DEATH_REGISTRATION
  | typeof EDIT_DEATH_REGISTRATION
  | typeof DELETE_DEATH_REGISTRATION
  | typeof VERIFY_DEATH_REGISTRATION
  | typeof APPROVE_DEATH_REGISTRATION
  | typeof ENDORSE_DEATH_REGISTRATION
  | typeof MANAGE_DEATH_REGISTRATION
  | typeof MANAGE_DEATH_REGISTRATION_PENDING
  | typeof MANAGE_DEATH_REGISTRATION_ENDORSE
  | typeof MANAGE_DEATH_REGISTRATION_VERIFY
  | typeof MANAGE_DEATH_REGISTRATION_APPROVE
  | typeof VIEW_HOH_CHANGE
  | typeof CREATE_HOH_CHANGE
  | typeof EDIT_HOH_CHANGE
  | typeof DELETE_HOH_CHANGE
  | typeof MANAGE_HOH_CHANGE
  | typeof MANAGE_HOH_CHANGE_REASON
  | typeof VIEW_COUNTRIES
  | typeof CREATE_COUNTRIES
  | typeof EDIT_COUNTRIES
  | typeof DELETE_COUNTRIES
  | typeof MANAGE_COUNTRIES
  | typeof VIEW_DZONGKHAGS
  | typeof CREATE_DZONGKHAGS
  | typeof EDIT_DZONGKHAGS
  | typeof DELETE_DZONGKHAGS
  | typeof MANAGE_DZONGKHAGS
  | typeof VIEW_GEWOGS
  | typeof CREATE_GEWOGS
  | typeof EDIT_GEWOGS
  | typeof DELETE_GEWOGS
  | typeof MANAGE_GEWOGS
  | typeof VIEW_CHIWOGS
  | typeof CREATE_CHIWOGS
  | typeof EDIT_CHIWOGS
  | typeof DELETE_CHIWOGS
  | typeof MANAGE_CHIWOGS
  | typeof VIEW_VILLAGES
  | typeof CREATE_VILLAGES
  | typeof EDIT_VILLAGES
  | typeof DELETE_VILLAGES
  | typeof MANAGE_VILLAGES
  | typeof VIEW_CITIES
  | typeof CREATE_CITIES
  | typeof EDIT_CITIES
  | typeof DELETE_CITIES
  | typeof MANAGE_CITIES
  | typeof VIEW_MAJOR_THROMDES
  | typeof CREATE_MAJOR_THROMDES
  | typeof EDIT_MAJOR_THROMDES
  | typeof DELETE_MAJOR_THROMDES
  | typeof MANAGE_MAJOR_THROMDES
  | typeof VIEW_MINOR_THROMDES
  | typeof CREATE_MINOR_THROMDES
  | typeof EDIT_MINOR_THROMDES
  | typeof DELETE_MINOR_THROMDES
  | typeof MANAGE_MINOR_THROMDES
  | typeof VIEW_CID_APPLICATION_REASONS
  | typeof CREATE_CID_APPLICATION_REASONS
  | typeof EDIT_CID_APPLICATION_REASONS
  | typeof DELETE_CID_APPLICATION_REASONS
  | typeof MANAGE_CID_APPLICATION_REASONS
  | typeof VIEW_GENDERS
  | typeof CREATE_GENDERS
  | typeof EDIT_GENDERS
  | typeof DELETE_GENDERS
  | typeof MANAGE_GENDERS
  | typeof VIEW_MARITAL_STATUS
  | typeof CREATE_MARITAL_STATUS
  | typeof EDIT_MARITAL_STATUS
  | typeof DELETE_MARITAL_STATUS
  | typeof MANAGE_MARITAL_STATUS
  | typeof VIEW_LITERACY_STATUS
  | typeof CREATE_LITERACY_STATUS
  | typeof EDIT_LITERACY_STATUS
  | typeof DELETE_LITERACY_STATUS
  | typeof MANAGE_LITERACY_STATUS
  | typeof VIEW_CENSUS_STATUS
  | typeof CREATE_CENSUS_STATUS
  | typeof EDIT_CENSUS_STATUS
  | typeof DELETE_CENSUS_STATUS
  | typeof MANAGE_CENSUS_STATUS
  | typeof VIEW_NATURALIZATION_TYPES
  | typeof CREATE_NATURALIZATION_TYPES
  | typeof EDIT_NATURALIZATION_TYPES
  | typeof DELETE_NATURALIZATION_TYPES
  | typeof MANAGE_NATURALIZATION_TYPES
  | typeof VIEW_REGULARIZATION_TYPES
  | typeof CREATE_REGULARIZATION_TYPES
  | typeof EDIT_REGULARIZATION_TYPES
  | typeof DELETE_REGULARIZATION_TYPES
  | typeof MANAGE_REGULARIZATION_TYPES
  | typeof VIEW_RELATIONSHIP_CERTIFICATE_PURPOSES
  | typeof CREATE_RELATIONSHIP_CERTIFICATE_PURPOSES
  | typeof EDIT_RELATIONSHIP_CERTIFICATE_PURPOSES
  | typeof DELETE_RELATIONSHIP_CERTIFICATE_PURPOSES
  | typeof MANAGE_RELATIONSHIP_CERTIFICATE_PURPOSES
  | typeof VIEW_OPERATORS
  | typeof CREATE_OPERATORS
  | typeof EDIT_OPERATORS
  | typeof DELETE_OPERATORS
  | typeof MANAGE_OPERATORS
  | typeof VIEW_CID_COLLECTION_POINTS
  | typeof CREATE_CID_COLLECTION_POINTS
  | typeof EDIT_CID_COLLECTION_POINTS
  | typeof DELETE_CID_COLLECTION_POINTS
  | typeof MANAGE_CID_COLLECTION_POINTS
  | typeof VIEW_RESETTLEMENT
  | typeof CREATE_RESETTLEMENT
  | typeof EDIT_RESETTLEMENT
  | typeof DELETE_RESETTLEMENT
  | typeof MANAGE_RESETTLEMENT
  | typeof VIEW_ANNOUNCEMENTS
  | typeof CREATE_ANNOUNCEMENTS
  | typeof EDIT_ANNOUNCEMENTS
  | typeof DELETE_ANNOUNCEMENTS
  | typeof MANAGE_ANNOUNCEMENTS
  | typeof VIEW_CONTENT
  | typeof CREATE_CONTENT
  | typeof EDIT_CONTENT
  | typeof DELETE_CONTENT
  | typeof MANAGE_CONTENT
  | typeof VIEW_MEDIA_LIBRARY
  | typeof CREATE_MEDIA_LIBRARY
  | typeof EDIT_MEDIA_LIBRARY
  | typeof DELETE_MEDIA_LIBRARY
  | typeof MANAGE_MEDIA_LIBRARY
  | typeof VIEW_NAVIGATION
  | typeof CREATE_NAVIGATION
  | typeof EDIT_NAVIGATION
  | typeof DELETE_NAVIGATION
  | typeof MANAGE_NAVIGATION
  | typeof MANAGE_CMS
  | typeof VIEW_DASHBOARD;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if a permission allows a specific action
 */
export function hasPermission(
  userPermissions: string[],
  requiredPermission: Permission
): boolean {
  // Super admin has access to everything
  if (userPermissions.includes(MANAGE_ALL)) {
    return true;
  }

  // Check for specific permission
  return userPermissions.includes(requiredPermission);
}

/**
 * Check if user has any of the required permissions (OR logic)
 */
export function hasAnyPermission(
  userPermissions: string[],
  requiredPermissions: Permission[]
): boolean {
  // Super admin has access to everything
  if (userPermissions.includes(MANAGE_ALL)) {
    return true;
  }

  // Check if user has any of the required permissions
  return requiredPermissions.some((permission) =>
    userPermissions.includes(permission)
  );
}

/**
 * Check if user has all of the required permissions (AND logic)
 */
export function hasAllPermissions(
  userPermissions: string[],
  requiredPermissions: Permission[]
): boolean {
  // Super admin has access to everything
  if (userPermissions.includes(MANAGE_ALL)) {
    return true;
  }

  // Check if user has all of the required permissions
  return requiredPermissions.every((permission) =>
    userPermissions.includes(permission)
  );
}
