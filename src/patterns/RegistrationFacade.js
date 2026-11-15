/**
 * ============================================================================
 * DESIGN PATTERN IMPLEMENTATION: FACADE PATTERN (Frontend Reference)
 * Course: Design and Development of a Software System (BSSE-5A)
 * Student: Khadija Ghufran-019
 * Supervisor: Sir Waqas
 * Location: src/patterns/RegistrationFacade.js
 * ============================================================================
 * 
 * Coordinates the multi-step registration pipeline:
 *   1. Event Validation & State Verification (State Pattern)
 *   2. Real-time Seat Availability Check (Capacity - Registered > 0)
 *   3. Duplicate Registration Check
 *   4. Record Creation & Atomic Seat Decrement
 */

import { eventService } from '../api/eventService';

export class RegistrationFacade {
  /**
   * Facade entry point for student registration
   */
  static async register({ eventId, studentId, studentName, studentEmail }) {
    if (!eventId || !studentId) {
      throw new Error('Event ID and Student ID are required.');
    }
    return await eventService.registerForEvent(eventId, studentId, studentName, studentEmail);
  }

  /**
   * Facade entry point for registration cancellation
   */
  static async cancel({ eventId, studentId }) {
    if (!eventId || !studentId) {
      throw new Error('Event ID and Student ID are required.');
    }
    return await eventService.cancelRegistration(eventId, studentId);
  }
}

