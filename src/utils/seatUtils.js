import { EVENT_STATUS } from '../constants/eventStatus';

/**
 * Calculates remaining available seats for an event. Never returns below 0.
 *
 * @param {number} capacity - Total seating capacity of the venue.
 * @param {number} registeredCount - Number of currently registered attendees.
 * @returns {number} Non-negative integer representing remaining seats.
 */
export function getAvailableSeats(capacity = 0, registeredCount = 0) {
  const safeCapacity = Number(capacity) || 0;
  const safeRegistered = Number(registeredCount) || 0;
  return Math.max(0, safeCapacity - safeRegistered);
}

/**
 * Determines whether registration is actively open for an event.
 * True ONLY if event status is "published" and available seats > 0.
 *
 * @param {Object} event - The event object.
 * @returns {boolean} True if student registration is permitted.
 */
export function isRegistrationOpen(event) {
  if (!event || event.status !== EVENT_STATUS.PUBLISHED) {
    return false;
  }
  const available = getAvailableSeats(event.capacity, event.registeredCount);
  return available > 0;
}

/**
 * Generates user-facing seat label for display.
 * Returns "Registration Closed" if seats are full/zero, otherwise "X seats left".
 *
 * @param {Object} event - The event object.
 * @returns {string} Seat badge or label text.
 */
export function getSeatLabel(event) {
  if (!event) return 'Registration Closed';
  const available = getAvailableSeats(event.capacity, event.registeredCount);
  if (available <= 0) {
    return 'Registration Closed';
  }
  return available === 1 ? '1 seat left' : `${available} seats left`;
}

/**
 * Calculates registration percentage (0 - 100) for progress meters.
 *
 * @param {number} capacity - Total seating capacity.
 * @param {number} registeredCount - Registered attendees.
 * @returns {number} Integer percentage clamped between 0 and 100.
 */
export function getSeatFillPercentage(capacity = 0, registeredCount = 0) {
  const safeCapacity = Number(capacity) || 0;
  const safeRegistered = Number(registeredCount) || 0;
  if (safeCapacity <= 0) return 100;
  const percentage = Math.round((safeRegistered / safeCapacity) * 100);
  return Math.min(100, Math.max(0, percentage));
}
