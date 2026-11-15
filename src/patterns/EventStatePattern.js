/**
 * ============================================================================
 * DESIGN PATTERN IMPLEMENTATION: STATE PATTERN (Frontend Reference)
 * Course: Design and Development of a Software System (BSSE-5A)
 * Student: Khadija Ghufran-019
 * Supervisor: Sir Waqas
 * Location: src/patterns/EventStatePattern.js
 * ============================================================================
 * 
 * Manages Event lifecycle states:
 *   Draft -> Pending Approval -> Approved -> Published -> Registration Closed -> Completed
 *                             -> Rejected (with formal reason)
 */

export class EventState {
  constructor(name) {
    this.name = name;
  }
  submitForApproval() {
    throw new Error(`Cannot submit for approval from [${this.name}] state.`);
  }
  approve() {
    throw new Error(`Cannot approve from [${this.name}] state.`);
  }
  reject() {
    throw new Error(`Cannot reject from [${this.name}] state.`);
  }
  publish() {
    throw new Error(`Cannot publish from [${this.name}] state.`);
  }
  closeRegistration() {
    throw new Error(`Cannot close registration from [${this.name}] state.`);
  }
  canRegister() {
    return false;
  }
}

export class PendingApprovalState extends EventState {
  constructor() {
    super('pending');
  }
  approve() {
    return new PublishedState();
  }
  reject(reason) {
    if (!reason || !String(reason).trim()) {
      throw new Error('Rejection reason is required.');
    }
    return new RejectedState(reason);
  }
}

export class PublishedState extends EventState {
  constructor() {
    super('published');
  }
  canRegister() {
    return true;
  }
  closeRegistration() {
    return new RegistrationClosedState();
  }
}

export class RejectedState extends EventState {
  constructor(reason = '') {
    super('rejected');
    this.reason = reason;
  }
  submitForApproval() {
    return new PendingApprovalState();
  }
}

export class RegistrationClosedState extends EventState {
  constructor() {
    super('closed');
  }
  canRegister() {
    return false;
  }
}

