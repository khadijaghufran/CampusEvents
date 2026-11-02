import axiosClient from './axiosClient.js';
import { MOCK_EVENTS } from '../mocks/events.js';
import { EVENT_STATUS } from '../constants/eventStatus.js';

const USE_MOCKS =
  typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env.VITE_USE_MOCKS === 'true'
    : true;

// In-memory mock registration storage for demo session persistence
let mockEventsState = [...MOCK_EVENTS];
const mockRegistrations = new Set(); // Stores "eventId:userId" pairs

/**
 * Event service handling fetching and registration interactions.
 */
export const eventService = {
  /**
   * Internal mock event retrieval
   */
  async mockGetPublishedEvents() {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockEventsState.filter(
      (event) => event.status === EVENT_STATUS.PUBLISHED
    );
  },

  /**
   * Internal mock event registration
   */
  async mockRegisterForEvent(eventId, studentId) {
    await new Promise((resolve) => setTimeout(resolve, 250));

    const registrationKey = `${eventId}:${studentId}`;
    if (mockRegistrations.has(registrationKey)) {
      throw new Error(
        'Duplicate registration: You have already registered for this event.'
      );
    }

    const event = mockEventsState.find((e) => e.id === eventId);
    if (!event) {
      throw new Error('Event not found.');
    }

    if (event.status !== EVENT_STATUS.PUBLISHED) {
      throw new Error('Registration is not open for this event.');
    }

    const availableSeats = Math.max(0, event.capacity - event.registeredCount);
    if (availableSeats <= 0) {
      throw new Error(
        'Registration is closed: This venue has reached maximum seating capacity.'
      );
    }

    // Record registration and increment attendee count
    mockRegistrations.add(registrationKey);
    mockEventsState = mockEventsState.map((e) =>
      e.id === eventId ? { ...e, registeredCount: e.registeredCount + 1 } : e
    );

    return {
      success: true,
      message: `Seat confirmed! You have successfully registered for "${event.title}".`,
      eventId,
    };
  },

  /**
   * Fetches only approved & published events for public display.
   *
   * @returns {Promise<Array>} List of published events.
   */
  async getPublishedEvents() {
    if (USE_MOCKS) {
      return this.mockGetPublishedEvents();
    }

    try {
      // Live endpoint: GET /api/events?status=published
      const data = await axiosClient.get('/events', {
        params: { status: EVENT_STATUS.PUBLISHED },
      });
      return Array.isArray(data) ? data : data.events || data.data || [];
    } catch (err) {
      if (err.message === 'Network Error' || !err.status) {
        console.warn(
          '[EventService] Backend server unreachable at http://localhost:5000. Falling back to local events data.'
        );
        return this.mockGetPublishedEvents();
      }
      throw err;
    }
  },

  /**
   * Registers a student for an event. Prevents duplicates and overbooking.
   *
   * @param {string} eventId - Unique event identifier.
   * @param {string} studentId - Student identifier.
   * @returns {Promise<Object>} Registration confirmation.
   */
  async registerForEvent(eventId, studentId) {
    if (USE_MOCKS) {
      return this.mockRegisterForEvent(eventId, studentId);
    }

    try {
      // Live endpoint: POST /api/events/:id/register
      return await axiosClient.post(`/events/${eventId}/register`, { studentId });
    } catch (err) {
      if (err.message === 'Network Error' || !err.status) {
        console.warn(
          '[EventService] Backend server unreachable at http://localhost:5000. Falling back to local registration logic.'
        );
        return this.mockRegisterForEvent(eventId, studentId);
      }
      throw err;
    }
  },
};
