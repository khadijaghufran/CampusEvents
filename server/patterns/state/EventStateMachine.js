/* eslint-disable no-unused-vars */
/**
 * ============================================================================
 * DESIGN PATTERN IMPLEMENTATION: STATE PATTERN (Behavioral)
 * Project: CampusEvents — University Event & Society Management System
 * Location: server/patterns/state/EventStateMachine.js
 * ============================================================================
 * 
 * Purpose:
 * Encapsulates state-specific behavior and validates lifecycle transitions:
 *   [Draft] -> [Pending Approval] -> [Approved] / [Rejected]
 *                                -> [Published] -> [Registration Closed] -> [Completed]
 * 
 * Benefits:
 * 1. Eliminates messy nested if-else/switch conditionals for status checks.
 * 2. Enforces business rules (e.g. students cannot register for a 'rejected' or 'pending' event).
 * 3. Enforces that rejection requires a non-empty formal reason.
 */

export class EventState {
  constructor(name) {
    this.name = name;
  }

  submitForApproval(_context) {
    throw new Error(`Invalid transition: Cannot submit for approval from [${this.name}] state.`);
  }

  approve(_context) {
    throw new Error(`Invalid transition: Cannot approve from [${this.name}] state.`);
  }

  reject(_context, _reason) {
    throw new Error(`Invalid transition: Cannot reject from [${this.name}] state.`);
  }

  publish(_context) {
    throw new Error(`Invalid transition: Cannot publish from [${this.name}] state.`);
  }

  closeRegistration(_context) {
    throw new Error(`Invalid transition: Cannot close registration from [${this.name}] state.`);
  }

  complete(_context) {
    throw new Error(`Invalid transition: Cannot complete event from [${this.name}] state.`);
  }

  canRegister() {
    return false;
  }
}

export class DraftState extends EventState {
  constructor() {
    super('draft');
  }

  submitForApproval(context) {
    context.transitionTo(new PendingApprovalState());
    return { success: true, message: 'Event proposal submitted for Administrator review.' };
  }
}

export class PendingApprovalState extends EventState {
  constructor() {
    super('pending');
  }

  approve(context) {
    context.transitionTo(new PublishedState());
    return { success: true, message: 'Event proposal approved and published for student registration.' };
  }

  reject(context, reason) {
    if (!reason || !String(reason).trim()) {
      throw new Error('Formal rejection reason is mandatory when rejecting an event proposal.');
    }
    context.rejectionReason = String(reason).trim();
    context.transitionTo(new RejectedState(context.rejectionReason));
    return { success: true, message: 'Event proposal rejected with justification recorded.' };
  }
}

export class ApprovedState extends EventState {
  constructor() {
    super('approved');
  }

  publish(context) {
    context.transitionTo(new PublishedState());
    return { success: true, message: 'Approved event is now published for student registration.' };
  }

  reject(context, reason) {
    if (!reason || !String(reason).trim()) {
      throw new Error('Formal rejection reason is mandatory when rejecting an event proposal.');
    }
    context.rejectionReason = String(reason).trim();
    context.transitionTo(new RejectedState(context.rejectionReason));
    return { success: true, message: 'Previously approved event proposal has been revoked/rejected.' };
  }
}

export class RejectedState extends EventState {
  constructor(reason = '') {
    super('rejected');
    this.reason = reason;
  }

  submitForApproval(context) {
    context.rejectionReason = '';
    context.transitionTo(new PendingApprovalState());
    return { success: true, message: 'Revised event proposal re-submitted for Administrator review.' };
  }

  canRegister() {
    return false;
  }
}

export class PublishedState extends EventState {
  constructor() {
    super('published');
  }

  canRegister() {
    return true;
  }

  closeRegistration(context) {
    context.transitionTo(new RegistrationClosedState());
    return { success: true, message: 'Registration has reached full capacity and is now closed.' };
  }

  complete(context) {
    context.transitionTo(new CompletedState());
    return { success: true, message: 'Event successfully concluded.' };
  }
}

export class RegistrationClosedState extends EventState {
  constructor() {
    super('closed');
  }

  canRegister() {
    return false;
  }

  complete(context) {
    context.transitionTo(new CompletedState());
    return { success: true, message: 'Event completed.' };
  }
}

export class CompletedState extends EventState {
  constructor() {
    super('completed');
  }

  canRegister() {
    return false;
  }
}

/**
 * EventContext (State Pattern Context)
 * Coordinates the active state and maintains the event object data.
 */
export class EventStateMachine {
  constructor(eventData) {
    this.eventData = eventData;
    this.rejectionReason = eventData.rejectionReason || '';
    this.state = this.resolveInitialState(eventData.status);
  }

  resolveInitialState(status) {
    switch (status) {
      case 'draft':
        return new DraftState();
      case 'pending':
        return new PendingApprovalState();
      case 'approved':
        return new ApprovedState();
      case 'rejected':
        return new RejectedState(this.rejectionReason);
      case 'closed':
        return new RegistrationClosedState();
      case 'completed':
        return new CompletedState();
      case 'published':
      default:
        return new PublishedState();
    }
  }

  transitionTo(newState) {
    this.state = newState;
    this.eventData.status = newState.name;
    if (newState instanceof RejectedState) {
      this.eventData.rejectionReason = this.rejectionReason;
    } else if (newState instanceof PendingApprovalState) {
      this.eventData.rejectionReason = '';
    }
  }

  // Delegated state actions
  submitForApproval() {
    return this.state.submitForApproval(this);
  }

  approve() {
    return this.state.approve(this);
  }

  reject(reason) {
    return this.state.reject(this, reason);
  }

  publish() {
    return this.state.publish(this);
  }

  closeRegistration() {
    return this.state.closeRegistration(this);
  }

  complete() {
    return this.state.complete(this);
  }

  canRegister() {
    return this.state.canRegister();
  }

  getStatus() {
    return this.state.name;
  }
}

