/**
 * Email regex RFC 5322 compliant simplified check
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates a person's full name.
 *
 * @param {string} name - Input name string.
 * @returns {string|null} Error string if invalid, or null if valid.
 */
export function validateName(name) {
  if (!name || !name.trim()) {
    return 'Full name is required.';
  }
  if (name.trim().length < 2) {
    return 'Full name must be at least 2 characters.';
  }
  return null;
}

/**
 * Validates an email address.
 *
 * @param {string} email - Input email string.
 * @returns {string|null} Error string if invalid, or null if valid.
 */
export function validateEmail(email) {
  if (!email || !email.trim()) {
    return 'Email address is required.';
  }
  if (!EMAIL_REGEX.test(email.trim())) {
    return 'Please enter a valid email address.';
  }
  return null;
}

/**
 * Validates a password.
 *
 * @param {string} password - Input password string.
 * @returns {string|null} Error string if invalid, or null if valid.
 */
export function validatePassword(password) {
  if (!password) {
    return 'Password is required.';
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters.';
  }
  return null;
}

/**
 * Validates a contact topic selection.
 *
 * @param {string} topic - Selected topic.
 * @returns {string|null} Error string if invalid, or null if valid.
 */
export function validateTopic(topic) {
  if (!topic || !topic.trim()) {
    return 'Please select a topic.';
  }
  return null;
}

/**
 * Validates a contact or feedback message body.
 *
 * @param {string} message - Message text.
 * @returns {string|null} Error string if invalid, or null if valid.
 */
export function validateMessage(message) {
  if (!message || !message.trim()) {
    return 'Message is required.';
  }
  if (message.trim().length < 10) {
    return 'Message must be at least 10 characters long.';
  }
  return null;
}

/**
 * Validates the full contact form payload.
 *
 * @param {Object} fields - Form values { name, email, topic, message }.
 * @returns {Object} Object mapping field keys to error messages (empty if valid).
 */
export function validateContactForm(fields = {}) {
  const errors = {};
  const nameError = validateName(fields.name);
  if (nameError) errors.name = nameError;

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
  const emailError = validateEmail(fields.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(fields.password);
  if (passwordError) errors.password = passwordError;

  if (!fields.role) {
    errors.role = 'Please select your role.';
  }

  return errors;
}
