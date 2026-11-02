/**
 * RFC 5322 compliant email format regex.
 * Requires proper local-part, @ symbol, domain, and at least 2-character top-level domain.
 */
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

/**
 * Validates that a required field is not empty or composed solely of whitespace.
 *
 * @param {*} value - The input value to check.
 * @param {string} [fieldName='This field'] - Human-readable field label.
 * @returns {string|null} Error string if empty/invalid, or null if valid.
 */
export function validateRequired(value, fieldName = 'This field') {
  if (value === undefined || value === null) {
    return `${fieldName} is required and cannot be empty.`;
  }
  if (typeof value === 'string' && value.trim().length === 0) {
    return `${fieldName} is required and cannot be empty.`;
  }
  return null;
}

/**
 * Validates a person's full name.
 *
 * @param {string} name - Input name string.
 * @param {Object} [options={}] - Validation options.
 * @returns {string|null} Error string if invalid, or null if valid.
 */
export function validateName(name, { required = true } = {}) {
  if (name === undefined || name === null || !String(name).trim()) {
    if (required) {
      return 'Full name is required.';
    }
    return null;
  }
  const trimmed = String(name).trim();
  if (trimmed.length < 2) {
    return 'Full name must be at least 2 characters.';
  }
  if (!/^[a-zA-Z\s.'-]+$/.test(trimmed)) {
    return 'Full name should only contain letters, spaces, hyphens, and apostrophes.';
  }
  return null;
}

/**
 * Validates a numeric field to ensure it contains only valid numbers.
 *
 * @param {string|number} value - Input value to test.
 * @param {string} [fieldName='This field'] - Human readable field name.
 * @param {Object} [options={}] - Validation options { required, min, max, integerOnly }.
 * @returns {string|null} Error string if invalid, or null if valid.
 */
export function validateNumeric(
  value,
  fieldName = 'This field',
  { required = true, min, max, integerOnly = false } = {}
) {
  if (value === undefined || value === null || String(value).trim() === '') {
    if (required) {
      return `${fieldName} is required.`;
    }
    return null;
  }

  const str = String(value).trim();

  // If integer only, must match optional leading sign and digits only
  if (integerOnly) {
    if (!/^-?\d+$/.test(str)) {
      return `${fieldName} must accept only valid numbers (whole numbers).`;
    }
  } else {
    // Allows optional minus, digits, optional decimal point with digits
    if (!/^-?\d+(\.\d+)?$/.test(str) || isNaN(Number(str))) {
      return `${fieldName} must accept only valid numbers.`;
    }
  }

  const num = Number(str);
  if (isNaN(num)) {
    return `${fieldName} must accept only valid numbers.`;
  }

  if (min !== undefined && num < min) {
    return `${fieldName} must be at least ${min}.`;
  }

  if (max !== undefined && num > max) {
    return `${fieldName} cannot exceed ${max}.`;
  }

  return null;
}

/**
 * Validates an age field.
 * Enforces that age is a valid positive whole number within realistic human range.
 *
 * @param {string|number} age - Age input.
 * @param {Object} [options={}] - Configuration options { required, min, max }.
 * @returns {string|null} Error string if invalid, or null if valid.
 */
export function validateAge(age, { required = true, min = 16, max = 120 } = {}) {
  if (age === undefined || age === null || String(age).trim() === '') {
    if (required) {
      return 'Age is required.';
    }
    return null;
  }

  const str = String(age).trim();

  // Must only consist of positive digits (no letters, symbols, decimals, negative signs)
  if (!/^\d+$/.test(str)) {
    return 'Age must accept only valid numbers.';
  }

  const num = Number(str);
  if (isNaN(num) || !Number.isInteger(num)) {
    return 'Age must accept only valid numbers.';
  }

  if (min !== undefined && num < min) {
    return `Age must be at least ${min} years old.`;
  }

  if (max !== undefined && num > max) {
    return `Age cannot exceed ${max} years old.`;
  }

  return null;
}

/**
 * Validates an email address against proper RFC format.
 *
 * @param {string} email - Input email string.
 * @param {Object} [options={}] - Configuration options { required }.
 * @returns {string|null} Error string if invalid, or null if valid.
 */
export function validateEmail(email, { required = true } = {}) {
  if (email === undefined || email === null || !String(email).trim()) {
    if (required) {
      return 'Email address is required.';
    }
    return null;
  }

  const trimmed = String(email).trim();

  // Check RFC maximum length
  if (trimmed.length > 254) {
    return 'Email address is too long (maximum 254 characters).';
  }

  // Disallow consecutive dots
  if (trimmed.includes('..')) {
    return 'Please enter a valid email address (cannot contain consecutive dots).';
  }

  // Verify against RFC regex
  if (!EMAIL_REGEX.test(trimmed)) {
    return 'Please enter a valid email address (e.g. user@campus.edu).';
  }

  return null;
}

/**
 * Validates a password enforcing strong password requirements:
 * - At least 8 characters
 * - At least one uppercase letter (A-Z)
 * - At least one lowercase letter (a-z)
 * - At least one number (0-9)
 * - At least one special symbol (!@#$%^&* etc.)
 *
 * @param {string} password - Input password string.
 * @param {Object} [options={}] - Configuration options { required, minLength }.
 * @returns {string|null} Error string if invalid, or null if valid.
 */
export function validatePassword(password, { required = true, minLength = 8 } = {}) {
  if (password === undefined || password === null || !String(password).trim()) {
    if (required) {
      return 'Password is required.';
    }
    return null;
  }

  const pwd = String(password);

  if (pwd.length < minLength) {
    return `Password must be at least ${minLength} characters long.`;
  }

  if (!/[A-Z]/.test(pwd)) {
    return 'Password must contain at least one uppercase letter (A-Z).';
  }

  if (!/[a-z]/.test(pwd)) {
    return 'Password must contain at least one lowercase letter (a-z).';
  }

  if (!/[0-9]/.test(pwd)) {
    return 'Password must contain at least one number (0-9).';
  }

  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(pwd)) {
    return 'Password must contain at least one special character (!@#$%^&* etc.).';
  }

  return null;
}

/**
 * Validates a contact topic selection.
 *
 * @param {string} topic - Selected topic.
 * @param {Object} [options={}] - Configuration options.
 * @returns {string|null} Error string if invalid, or null if valid.
 */
export function validateTopic(topic, { required = true } = {}) {
  if (topic === undefined || topic === null || !String(topic).trim()) {
    if (required) {
      return 'Please select an inquiry topic.';
    }
    return null;
  }
  return null;
}

/**
 * Validates a contact or feedback message body.
 *
 * @param {string} message - Message text.
 * @param {Object} [options={}] - Configuration options { required, minLength }.
 * @returns {string|null} Error string if invalid, or null if valid.
 */
export function validateMessage(message, { required = true, minLength = 10 } = {}) {
  if (message === undefined || message === null || !String(message).trim()) {
    if (required) {
      return 'Message is required.';
    }
    return null;
  }
  const trimmed = String(message).trim();
  if (trimmed.length < minLength) {
    return `Message must be at least ${minLength} characters long.`;
  }
  return null;
}

/**
 * Validates the selected user role.
 *
 * @param {string} role - Selected role.
 * @returns {string|null} Error string if invalid, or null if valid.
 */
export function validateRole(role) {
  if (!role || !String(role).trim()) {
    return 'Please select your role.';
  }
  const validRoles = ['student', 'organizer', 'admin'];
  if (!validRoles.includes(String(role).trim().toLowerCase())) {
    return 'Please select a valid campus affiliation role.';
  }
  return null;
}

/**
 * Alias for validateNumeric.
 */
export const validateNumber = validateNumeric;

/**
 * Validates the full contact form payload.
 *
 * @param {Object} fields - Form values { name, age, email, topic, message }.
 * @returns {Object} Object mapping field keys to error messages (empty if valid).
 */
export function validateContactForm(fields = {}) {
  const errors = {};

  const nameError = validateName(fields.name);
  if (nameError) errors.name = nameError;

  const ageError = validateAge(fields.age);
  if (ageError) errors.age = ageError;

  const emailError = validateEmail(fields.email);
  if (emailError) errors.email = emailError;

  const topicError = validateTopic(fields.topic);
  if (topicError) errors.topic = topicError;

  const messageError = validateMessage(fields.message);
  if (messageError) errors.message = messageError;

  return errors;
}

/**
 * Validates the login form payload.
 *
 * @param {Object} fields - Form values { email, password, role }.
 * @returns {Object} Object mapping field keys to error messages (empty if valid).
 */
export function validateLoginForm(fields = {}) {
  const errors = {};

  const roleError = validateRole(fields.role);
  if (roleError) errors.role = roleError;

  const emailError = validateEmail(fields.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(fields.password);
  if (passwordError) errors.password = passwordError;

  return errors;
}
