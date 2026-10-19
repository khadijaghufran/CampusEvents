/**
 * Event statuses across the university event lifecycle
 * @readonly
 * @enum {string}
 */
export const EVENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  PUBLISHED: 'published',
};

/**
 * Human-readable status labels
 */
export const EVENT_STATUS_LABELS = {
  [EVENT_STATUS.PENDING]: 'Pending Approval',
  [EVENT_STATUS.APPROVED]: 'Approved',
  [EVENT_STATUS.REJECTED]: 'Rejected',
  [EVENT_STATUS.PUBLISHED]: 'Published',
};
