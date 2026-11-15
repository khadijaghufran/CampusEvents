/**
 * ============================================================================
 * DESIGN PATTERN IMPLEMENTATION: FACADE PATTERN (Structural)
 * Project: CampusEvents — University Event & Society Management System
 * Location: server/patterns/facade/RegistrationFacade.js
 * ============================================================================
 * 
 * Purpose:
 * Provides a unified, simplified interface to coordinate 5 subsystems during
 * student event registration:
 *   1. EventValidationSubsystem (State Pattern status check)
 *   2. SeatAvailabilitySubsystem (Capacity vs count check)
 *   3. DuplicateCheckSubsystem (Duplicate registration check)
 *   4. RegistrationPersistenceSubsystem (MongoDB record creation)
 *   5. SeatAllocationSubsystem (Atomic increment and auto-closure)
 * 
 * Benefits:
 * - Hides the complexity of interacting with multiple models and validation logic.
 * - Prevents race conditions and inconsistent database records.
 * - Makes controllers clean and easy to test.
 */

import { Event } from '../../models/Event.js';
import { Registration } from '../../models/Registration.js';
import { EventStateMachine } from '../state/EventStateMachine.js';

// Subsystem 1: Event & State Validator
class EventValidationSubsystem {
  static async validate(eventId) {
    const event = await Event.findOne({ id: eventId });
    if (!event) {
      throw new Error(`Event with ID "${eventId}" not found.`);
    }

    const stateMachine = new EventStateMachine(event);
    if (!stateMachine.canRegister()) {
      throw new Error(
        `Registration is not available. This event is currently in [${event.status.toUpperCase()}] state.`
      );
    }

    return { event, stateMachine };
  }
}

// Subsystem 2: Seat Availability Checker
class SeatAvailabilitySubsystem {
  static checkSeats(event) {
    const availableSeats = Math.max(0, event.capacity - (event.registeredCount || 0));
    if (availableSeats <= 0) {
      throw new Error('Registration Closed: This seminar hall / venue has reached maximum capacity.');
    }
    return availableSeats;
  }
}

// Subsystem 3: Duplicate Registration Guard
class DuplicateCheckSubsystem {
  static async check(eventId, studentId) {
    const existing = await Registration.findOne({ eventId, studentId });
    if (existing) {
      throw new Error('Duplicate Registration: You are already registered for this event.');
    }
  }
}

// Subsystem 4: Registration Persistence Subsystem
class RegistrationPersistenceSubsystem {
  static async save({ eventId, studentId, studentName, studentEmail }) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const registrationCode = `REG-2026-${randomSuffix}`;

    const record = await Registration.create({
      eventId,
      studentId,
      studentName: studentName || 'Registered Student',
      studentEmail: studentEmail || '',
      registrationCode,
    });

    return record;
  }
}

// Subsystem 5: Seat Allocation & Auto-Closure Subsystem
class SeatAllocationSubsystem {
  static async incrementAndSync(event, stateMachine) {
    event.registeredCount = (event.registeredCount || 0) + 1;

    // Automated seat management: auto-close if seats reach 0
    if (event.registeredCount >= event.capacity) {
      stateMachine.closeRegistration();
    }

    await event.save();
    return event.capacity - event.registeredCount;
  }

  static async decrementAndSync(event) {
    event.registeredCount = Math.max(0, (event.registeredCount || 0) - 1);
    // If it was closed but now has room, re-open to published
    if (event.status === 'closed' && event.registeredCount < event.capacity) {
      event.status = 'published';
    }
    await event.save();
  }
}

/**
 * The Facade class exposing simple, unified operations
 */
export class RegistrationFacade {
  /**
   * Coordinated registration pipeline
   */
  static async registerStudent({ eventId, studentId, studentName, studentEmail }) {
    if (!eventId || !studentId) {
      throw new Error('Both eventId and studentId are required for registration.');
    }

    // Step 1: Validate event and lifecycle state via State Pattern
    const { event, stateMachine } = await EventValidationSubsystem.validate(eventId);

    // Step 2: Check available seats
    SeatAvailabilitySubsystem.checkSeats(event);

    // Step 3: Check duplicate registration
    await DuplicateCheckSubsystem.check(eventId, studentId);

    // Step 4: Save registration record
    const registration = await RegistrationPersistenceSubsystem.save({
      eventId,
      studentId,
      studentName,
      studentEmail,
    });

    // Step 5: Atomically increment seat count and auto-close if full
    const seatsRemaining = await SeatAllocationSubsystem.incrementAndSync(event, stateMachine);

    return {
      success: true,
      message: `Registration confirmed for "${event.title}"! Seat reserved successfully.`,
      registrationCode: registration.registrationCode,
      seatsRemaining,
      event: {
        id: event.id,
        title: event.title,
        venue: event.venue,
        date: event.date,
        startTime: event.startTime,
        endTime: event.endTime,
      },
    };
  }

  /**
   * Coordinated un-registration / cancellation pipeline
   */
  static async cancelRegistration({ eventId, studentId }) {
    if (!eventId || !studentId) {
      throw new Error('Both eventId and studentId are required to cancel registration.');
    }

    const registration = await Registration.findOneAndDelete({ eventId, studentId });
    if (!registration) {
      throw new Error('No active registration record found for this student and event.');
    }

    const event = await Event.findOne({ id: eventId });
    if (event) {
      await SeatAllocationSubsystem.decrementAndSync(event);
    }

    return {
      success: true,
      message: 'Registration successfully cancelled. The seat has been made available to other students.',
    };
  }
}

