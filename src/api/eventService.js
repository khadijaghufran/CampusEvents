import axiosClient from './axiosClient.js';
import { MOCK_EVENTS } from '../mocks/events.js';
import { EVENT_STATUS } from '../constants/eventStatus.js';

// In-memory mock storage for local fallback
let mockEventsState = [
  ...MOCK_EVENTS,
  {
    id: 'evt_004',
    title: 'Cybersecurity Defense & Ethical Hacking Bootcamp',
    description:
      'Hands-on red team and blue team cybersecurity training: penetration testing, network sniffing, and CTF challenges.',
    societyName: 'ACM & IEEE Student Chapter',
    venue: 'Innovation Hub – Tech Seminar Room 3',
    date: '2026-12-05',
    startTime: '10:00 AM',
    endTime: '03:00 PM',
    capacity: 90,
    registeredCount: 0,
    status: EVENT_STATUS.PENDING,
    rejectionReason: '',
    category: 'Technology & Research',
    tags: ['Cybersecurity', 'Workshop', 'Hands-on'],
    organizerEmail: 'muhammadbilal5521@gmail.com',
    organizerName: 'Muhammad Bilal',
  },
];

const mockRegistrations = [
  {
    registrationId: 'reg_demo_01',
    registrationCode: 'REG-2026-8841',
    eventId: 'evt_001',
    studentId: 'usr_student_01',
    studentName: 'Fatima Noor',
    studentEmail: 'fatimanoor8841@gmail.com',
    registeredAt: new Date().toISOString(),
    event: MOCK_EVENTS[0],
  },
];

export const MOCK_VENUES = [
  {
    id: 'ven_001',
    name: 'Main Auditorium – Sir C.V. Raman Hall',
    code: 'AUD-CVR',
    building: 'Main Academic Complex',
    capacity: 150,
    facilities: ['Dual 4K Projectors', 'Surround Sound System', 'Central AC'],
  },
  {
    id: 'ven_002',
    name: 'Innovation Hub – Tech Seminar Room 3',
    code: 'HUB-SEM3',
    building: 'Software Engineering Centre',
    capacity: 100,
    facilities: ['Interactive Displays', 'High-Speed Wi-Fi 6', 'Podium Audio'],
  },
  {
    id: 'ven_003',
    name: 'Engineering Complex – Hall B',
    code: 'ENG-HALLB',
    building: 'Faculty of Engineering',
    capacity: 120,
    facilities: ['Microphone System', 'Robotics Testing Floor', 'Projector'],
  },
  {
    id: 'ven_004',
    name: 'School of Management – Hall 101',
    code: 'MGT-H101',
    building: 'Business School',
    capacity: 80,
    facilities: ['Tiered Executive Seating', 'Smart Board', 'Video Conferencing'],
  },
  {
    id: 'ven_005',
    name: 'Performing Arts Theatre – Black Box',
    code: 'ARTS-BOX',
    building: 'Student Activity Centre',
    capacity: 200,
    facilities: ['Acoustic Paneling', 'Theatrical Lighting', 'Wireless Mics'],
  },
];

export const eventService = {
  /**
   * Fetch approved & published events
   */
  async getPublishedEvents() {
    try {
      const data = await axiosClient.get('/events', {
        params: { status: EVENT_STATUS.PUBLISHED },
      });
      return Array.isArray(data) ? data : data.events || data.data || [];
    } catch (err) {
      console.warn('[EventService] Falling back to mock published events:', err.message);
      return mockEventsState.filter((e) => e.status === EVENT_STATUS.PUBLISHED);
    }
  },

  /**
   * Fetch all events (Admin view)
   */
  async getAllEvents() {
    try {
      const data = await axiosClient.get('/events');
      return Array.isArray(data) ? data : data.events || data.data || [];
    } catch (err) {
      console.warn('[EventService] Falling back to mock all events:', err.message);
      return mockEventsState;
    }
  },

  /**
   * Fetch managed seminar halls / venues
   */
  async getVenues() {
    try {
      const data = await axiosClient.get('/events/venues');
      return Array.isArray(data) ? data : data.venues || data.data || MOCK_VENUES;
    } catch (err) {
      console.warn('[EventService] Falling back to mock venues:', err.message);
      return MOCK_VENUES;
    }
  },

  /**
   * Check venue availability using Node.js Worker Thread backend
   */
  async checkVenueAvailability({ venue, date, startTime, endTime, excludeEventId }) {
    try {
      return await axiosClient.post('/events/check-venue', {
        venue,
        date,
        startTime,
        endTime,
        excludeEventId,
      });
    } catch (err) {
      // Local fallback conflict check
      console.warn('[EventService] Local fallback venue check:', err.message);
      const conflict = mockEventsState.find(
        (e) =>
          e.venue === venue &&
          e.date === date &&
          ['pending', 'approved', 'published'].includes(e.status) &&
          (!excludeEventId || e.id !== excludeEventId)
      );

      if (conflict) {
        return {
          hasConflict: true,
          conflictReason: `Venue clash detected! "${venue}" is already booked on ${date} for "${conflict.title}".`,
          conflictingEvent: conflict,
          threadId: 'Simulated Local Thread',
        };
      }
      return {
        hasConflict: false,
        conflictReason: null,
        message: `Venue "${venue}" is available on ${date}.`,
        threadId: 'Simulated Local Thread',
      };
    }
  },

  /**
   * Organizer submits new event proposal
   */
  async createEventProposal(eventData) {
    try {
      return await axiosClient.post('/events', eventData);
    } catch (err) {
      console.warn('[EventService] Falling back to mock proposal save:', err.message);
      const newEvent = {
        ...eventData,
        id: `evt_mock_${Date.now()}`,
        registeredCount: 0,
        status: EVENT_STATUS.PENDING,
        createdAt: new Date().toISOString(),
      };
      mockEventsState.unshift(newEvent);
      return { success: true, message: 'Proposal submitted (Local Mode).', event: newEvent };
    }
  },

  /**
   * Admin approves or rejects event via State Pattern
   */
  async updateEventStatus(eventId, action, reason = '') {
    try {
      return await axiosClient.patch(`/events/${eventId}/status`, { action, reason });
    } catch (err) {
      console.warn('[EventService] Falling back to mock state transition:', err.message);
      const eventIndex = mockEventsState.findIndex((e) => e.id === eventId);
      if (eventIndex !== -1) {
        if (action === 'approve') {
          mockEventsState[eventIndex].status = EVENT_STATUS.PUBLISHED;
          mockEventsState[eventIndex].rejectionReason = '';
        } else if (action === 'reject') {
          mockEventsState[eventIndex].status = EVENT_STATUS.REJECTED;
          mockEventsState[eventIndex].rejectionReason = reason;
        }
      }
      return {
        success: true,
        message: `Event proposal ${action === 'approve' ? 'Approved & Published' : 'Rejected'}.`,
        event: mockEventsState[eventIndex],
      };
    }
  },

  /**
   * Student registers for an event via Facade Pattern
   */
  async registerForEvent(eventId, studentId, studentName = '', studentEmail = '') {
    try {
      return await axiosClient.post(`/events/${eventId}/register`, {
        studentId,
        studentName,
        studentEmail,
      });
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        throw new Error(err.response.data.message, { cause: err });
      }
      // Mock Fallback
      const event = mockEventsState.find((e) => e.id === eventId);
      if (!event) throw new Error('Event not found.', { cause: err });
      if (mockRegistrations.some((r) => r.eventId === eventId && r.studentId === studentId)) {
        throw new Error('Duplicate registration: You have already registered for this event.', {
          cause: err,
        });
      }
      if (event.registeredCount >= event.capacity) {
        throw new Error('Registration Closed: Maximum venue capacity reached.', { cause: err });
      }

      event.registeredCount += 1;
      const code = `REG-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      mockRegistrations.unshift({
        registrationId: `reg_${Date.now()}`,
        registrationCode: code,
        eventId,
        studentId,
        studentName,
        studentEmail,
        registeredAt: new Date().toISOString(),
        event,
      });

      return {
        success: true,
        message: `Registration confirmed for "${event.title}"! Seat reserved successfully.`,
        registrationCode: code,
      };
    }
  },

  /**
   * Fetch registered events for a student
   */
  async getMyRegistrations(studentId) {
    try {
      const data = await axiosClient.get(`/events/my-registrations/${studentId}`);
      return Array.isArray(data) ? data : data.registrations || [];
    } catch (err) {
      console.warn('[EventService] Falling back to mock registrations:', err.message);
      return mockRegistrations.filter((r) => r.studentId === studentId);
    }
  },

  /**
   * Student cancels their registration
   */
  async cancelRegistration(eventId, studentId) {
    try {
      return await axiosClient.delete(`/events/${eventId}/register/${studentId}`);
    } catch (err) {
      console.warn('[EventService] Falling back to mock cancel:', err.message);
      const regIdx = mockRegistrations.findIndex(
        (r) => r.eventId === eventId && r.studentId === studentId
      );
      if (regIdx !== -1) {
        mockRegistrations.splice(regIdx, 1);
      }
      const event = mockEventsState.find((e) => e.id === eventId);
      if (event) {
        event.registeredCount = Math.max(0, event.registeredCount - 1);
      }
      return { success: true, message: 'Registration cancelled.' };
    }
  },
};
