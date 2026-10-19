/**
 * Formats an ISO or standard date string into readable English format.
 * Example: "2026-11-05" -> "Nov 5, 2026"
 *
 * @param {string|Date} dateInput - Input date string or Date object.
 * @returns {string} Formatted date string.
 */
export function formatDate(dateInput) {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

/**
 * Formats start and end times into a readable range string.
 * Example: ("09:00", "12:00") -> "09:00 AM - 12:00 PM"
 *
 * @param {string} startTime - Event start time.
 * @param {string} endTime - Event end time.
 * @returns {string} Formatted time span string.
 */
export function formatTimeSpan(startTime, endTime) {
  if (!startTime && !endTime) return 'Time TBA';
  if (startTime && !endTime) return startTime;
  if (!startTime && endTime) return `Until ${endTime}`;
  return `${startTime} – ${endTime}`;
}

/**
 * Truncates text to a specified maximum length with an ellipsis.
 *
 * @param {string} text - Source string.
 * @param {number} maxLength - Maximum character count before truncation.
 * @returns {string} Truncated string.
 */
export function truncateText(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text || '';
  return `${text.slice(0, maxLength).trim()}...`;
}
