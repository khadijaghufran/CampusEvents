import axiosClient from './axiosClient';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

/**
 * Service for handling contact inquiries and office messages.
 */
export const contactService = {
  /**
   * Submits a contact inquiry to the university event office.
   *
   * @param {Object} formData - { name, email, topic, message }
   * @returns {Promise<Object>} Response confirmation.
   */
  async sendMessage(formData) {
    if (USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 450));

      // Quick sanity check for realistic mock behavior
      if (!formData.name || !formData.email || !formData.message) {
        throw new Error('Please fill in all required fields before submitting.');
      }

      return {
        success: true,
        message:
          'Thank you for reaching out! Your message has been routed to the University Event Office. We will respond within 1 business day.',
        ticketId: `TICK-${Math.floor(100000 + Math.random() * 900000)}`,
      };
    }

    // Live endpoint: POST /api/contact
    return axiosClient.post('/contact', formData);
  },
};
