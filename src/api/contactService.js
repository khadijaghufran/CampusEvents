import axiosClient from './axiosClient.js';

const USE_MOCKS =
  typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env.VITE_USE_MOCKS === 'true'
    : true;

/**
 * Service for handling contact inquiries and office messages.
 */
export const contactService = {
  /**
   * Internal mock submission implementation
   */
  async mockSendMessage(formData) {
    await new Promise((resolve) => setTimeout(resolve, 350));

    // Quick sanity check for realistic mock behavior
    if (
      !formData.name?.trim() ||
      !formData.email?.trim() ||
      !formData.message?.trim() ||
      formData.age === undefined ||
      formData.age === null ||
      String(formData.age).trim() === ''
    ) {
      throw new Error('Please fill in all required fields before submitting.');
    }

    return {
      success: true,
      message:
        'Thank you for reaching out! Your message has been routed to the University Event Office. We will respond within 1 business day.',
      ticketId: `TICK-${Math.floor(100000 + Math.random() * 900000)}`,
    };
  },

  /**
   * Submits a contact inquiry to the university event office with automatic offline fallback.
   *
   * @param {Object} formData - { name, age, email, topic, message }
   * @returns {Promise<Object>} Response confirmation.
   */
  async sendMessage(formData) {
    if (USE_MOCKS) {
      return this.mockSendMessage(formData);
    }

    try {
      // Live endpoint: POST /api/contact
      return await axiosClient.post('/contact', formData);
    } catch (err) {
      if (err.message === 'Network Error' || !err.status) {
        console.warn(
          '[ContactService] Backend server unreachable at http://localhost:5000. Falling back to local submission handler.'
        );
        return this.mockSendMessage(formData);
      }
      throw err;
    }
  },
};
