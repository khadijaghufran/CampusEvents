import axiosClient from './axiosClient';
import { MOCK_EVENTS } from '../mocks/events';
import { EVENT_STATUS } from '../constants/eventStatus';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

// In-memory mock registration storage for demo session persistence
let mockEventsState = [...MOCK_EVENTS];
const mockRegistrations = new Set(); // Stores "eventId:userId" pairs

/**
 * Event service handling fetching and registration interactions.
 */
export const eventService = {
  /**
   * Fetches only approved & published events for public display.
   *
   * @returns {Promise<Array>} List of published events.
   */
  async getPublishedEvents() {
    if (USE_MOCKS) {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 400));
      // Filter only approved & published events
      return mockEventsState.filter(
        (event) => event.status === EVENT_STATUS.PUBLISHED
      );
    }

    // Live endpoint: GET /api/events?status=published
    const data = await axiosClient.get('/events', {
      params: { status: EVENT_STATUS.PUBLISHED },
    });
    // In case backend wraps in { data: [...] } or returns array directly
    return Array.isArray(data) ? data : data.events || data.data || [];
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
      await new Promise((resolve) => setTimeout(resolve, 300));

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
    }

    // Live endpoint: POST /api/events/:id/register
    return axiosClient.post(`/events/${eventId}/register`, { studentId });
  },
};
