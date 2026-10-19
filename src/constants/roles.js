/**
 * User roles supported in CampusEvents
 * @readonly
 * @enum {string}
 */
export const ROLES = {
  STUDENT: 'student',
  ORGANIZER: 'organizer',
  ADMIN: 'admin',
};

/**
 * Human-readable role labels
 */
export const ROLE_LABELS = {
  [ROLES.STUDENT]: 'Student',
  [ROLES.ORGANIZER]: 'Society Organizer',
  [ROLES.ADMIN]: 'University Admin',
};
