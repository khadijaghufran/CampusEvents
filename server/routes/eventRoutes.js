import express from 'express';
import { Event } from '../models/Event.js';
import { Venue } from '../models/Venue.js';
import { Registration } from '../models/Registration.js';
import { EventStateMachine } from '../patterns/state/EventStateMachine.js';
import { RegistrationFacade } from '../patterns/facade/RegistrationFacade.js';
import { checkVenueConflictInThread } from '../threads/venueConflictService.js';

const router = express.Router();

/**
 * GET /api/events/venues
 * Returns the university's managed seminar halls and venues.
 */
router.get('/venues', async (req, res) => {
  try {
    let venues = await Venue.find({ isActive: true }).sort({ capacity: -1 });
    // Fallback if not yet seeded
    if (!venues || venues.length === 0) {
      venues = [
        {
          id: 'ven_001',
          name: 'Main Auditorium – Sir C.V. Raman Hall',
          code: 'AUD-CVR',
          building: 'Main Academic Complex',
          capacity: 150,
          facilities: ['Dual Projectors', 'Surround Sound', 'Central AC', 'Stage Lighting'],
        },
        {
          id: 'ven_002',
          name: 'Innovation Hub – Tech Seminar Room 3',
          code: 'HUB-SEM3',
          building: 'Software Engineering Centre',
          capacity: 100,
          facilities: ['Interactive Displays', 'High-Speed Wi-Fi', 'Podium Audio'],
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
          facilities: ['Tiered Seating', 'Smart Board', 'Video Conferencing'],
        },
      ];
    }
    return res.json(venues);
  } catch (error) {
    console.error('Fetch venues error:', error);
    return res.status(500).json({ message: 'Error retrieving seminar halls from database.' });
  }
});

/**
 * POST /api/events/check-venue
 * Verifies venue availability using Node.js Worker Thread.
 */
router.post('/check-venue', async (req, res) => {
  try {
    const { venue, date, startTime, endTime, excludeEventId } = req.body;

    if (!venue || !date || !startTime || !endTime) {
      return res.status(400).json({
        hasConflict: true,
        conflictReason: 'Please provide venue, date, start time, and end time to check availability.',
      });
    }

    const threadResult = await checkVenueConflictInThread({
      targetVenue: venue,
      targetDate: date,
      targetStartTime: startTime,
      targetEndTime: endTime,
      excludeEventId,
    });

    return res.json(threadResult);
  } catch (error) {
    console.error('Venue check thread error:', error);
    return res.status(500).json({
      hasConflict: true,
      conflictReason: error.message || 'Worker thread failed to verify venue availability.',
    });
  }
});

/**
 * GET /api/events
 * Query params: ?status=published (or omit to get all)
 */
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.status && req.query.status !== 'all') {
      filter.status = req.query.status;
    }
    if (req.query.organizerEmail) {
      filter.organizerEmail = req.query.organizerEmail;
    }

    const events = await Event.find(filter).sort({ date: 1, createdAt: -1 });
    return res.json(events);
  } catch (error) {
    console.error('Fetch events error:', error);
    return res.status(500).json({ message: 'Error retrieving events from database.' });
  }
});

/**
 * POST /api/events
 * Organizer creates an event proposal.
 * Validates inputs, enforces capacity rules, and tests venue clashes via Worker Thread.
 */
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      societyName,
      venue,
      date,
      startTime,
      endTime,
      capacity,
      category,
      tags,
      organizerId,
      organizerName,
      organizerEmail,
    } = req.body;

    // 1. Mandatory field validations
    if (!title || !String(title).trim()) {
      return res.status(400).json({ message: 'Event title is required.' });
    }
    if (!description || !String(description).trim()) {
      return res.status(400).json({ message: 'Event description is required.' });
    }
    if (!societyName || !String(societyName).trim()) {
      return res.status(400).json({ message: 'Society name is required.' });
    }
    if (!venue || !String(venue).trim()) {
      return res.status(400).json({ message: 'Seminar hall / venue selection is required.' });
    }
    if (!date || !String(date).trim()) {
      return res.status(400).json({ message: 'Event date is required.' });
    }

    // 2. Numeric capacity validation
    const parsedCapacity = Number(capacity);
    if (isNaN(parsedCapacity) || parsedCapacity <= 0) {
      return res.status(400).json({ message: 'Capacity must be a valid positive number.' });
    }

    // 3. Check venue max capacity limit
    const venueDoc = await Venue.findOne({ name: venue });
    if (venueDoc && parsedCapacity > venueDoc.capacity) {
      return res.status(400).json({
        message: `Configured event capacity (${parsedCapacity}) exceeds venue limit of ${venueDoc.capacity} for "${venueDoc.name}".`,
      });
    }

    // 4. Thread-based Venue Conflict / Double-Booking Check
    const conflictResult = await checkVenueConflictInThread({
      targetVenue: venue,
      targetDate: date,
      targetStartTime: startTime || '09:00 AM',
      targetEndTime: endTime || '05:00 PM',
    });

    if (conflictResult.hasConflict) {
      return res.status(409).json({
        message: conflictResult.conflictReason,
        conflictDetails: conflictResult,
      });
    }

    // 5. Generate unique event ID
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const eventId = `evt_${Date.now().toString().slice(-4)}_${randomSuffix}`;

    const newEvent = await Event.create({
      id: eventId,
      title: title.trim(),
      description: description.trim(),
      societyName: societyName.trim(),
      venue: venue.trim(),
      date: date.trim(),
      startTime: startTime || '09:00 AM',
      endTime: endTime || '05:00 PM',
      capacity: parsedCapacity,
      registeredCount: 0,
      status: 'pending', // Starts in Pending Approval state
      rejectionReason: '',
      organizerId: organizerId || '',
      organizerName: organizerName || '',
      organizerEmail: organizerEmail || '',
      category: category || 'Technology & Research',
      tags: Array.isArray(tags) ? tags : ['Society Event'],
    });

    return res.status(201).json({
      success: true,
      message: 'Event proposal submitted successfully! It is now in [Pending Approval] for Admin review.',
      event: newEvent,
      threadVerification: conflictResult,
    });
  } catch (error) {
    console.error('Create event error:', error);
    return res.status(500).json({ message: error.message || 'Error submitting event proposal.' });
  }
});

/**
 * PATCH /api/events/:id/status
 * Admin approves or rejects event proposals.
 * Enforces business transitions through the STATE PATTERN.
 */
router.patch('/:id/status', async (req, res) => {
  try {
    const { action, reason } = req.body; // action: 'approve' | 'reject'
    const event = await Event.findOne({ id: req.params.id });

    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    // Instantiate State Pattern machine
    const stateMachine = new EventStateMachine(event);

    let result;
    if (action === 'approve') {
      result = stateMachine.approve();
    } else if (action === 'reject') {
      result = stateMachine.reject(reason);
    } else {
      return res.status(400).json({ message: 'Invalid action. Allowed actions: "approve" or "reject".' });
    }

    // Save changes to MongoDB
    await event.save();

    return res.json({
      success: true,
      message: result.message,
      event,
    });
  } catch (error) {
    console.error('State transition error:', error);
    return res.status(400).json({ message: error.message || 'State transition failed.' });
  }
});

/**
 * POST /api/events/:id/register
 * Student registers for an event.
 * Coordinated through the FACADE PATTERN.
 */
router.post('/:id/register', async (req, res) => {
  try {
    const eventId = req.params.id;
    const { studentId, studentName, studentEmail } = req.body;

    const result = await RegistrationFacade.registerStudent({
      eventId,
      studentId,
      studentName,
      studentEmail,
    });

    return res.json(result);
  } catch (error) {
    console.error('Facade Registration error:', error);
    const status = error.message.includes('Duplicate') ? 409 : 400;
    return res.status(status).json({ message: error.message || 'Registration failed.' });
  }
});

/**
 * GET /api/events/my-registrations/:studentId
 * Fetches all registered events for a student.
 */
router.get('/my-registrations/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const registrations = await Registration.find({ studentId }).sort({ registeredAt: -1 });

    const eventIds = registrations.map((r) => r.eventId);
    const events = await Event.find({ id: { $in: eventIds } });

    // Join registration metadata with event
    const registeredEvents = registrations.map((reg) => {
      const event = events.find((e) => e.id === reg.eventId);
      return {
        registrationId: reg._id,
        registrationCode: reg.registrationCode,
        registeredAt: reg.registeredAt,
        event: event || { id: reg.eventId, title: 'Archived Event' },
      };
    });

    return res.json(registeredEvents);
  } catch (error) {
    console.error('Fetch student registrations error:', error);
    return res.status(500).json({ message: 'Error retrieving student registrations.' });
  }
});

/**
 * DELETE /api/events/:id/register/:studentId
 * Cancels a student registration via Facade.
 */
router.delete('/:id/register/:studentId', async (req, res) => {
  try {
    const { id: eventId, studentId } = req.params;
    const result = await RegistrationFacade.cancelRegistration({ eventId, studentId });
    return res.json(result);
  } catch (error) {
    console.error('Cancel registration error:', error);
    return res.status(400).json({ message: error.message || 'Cancellation failed.' });
  }
});

export default router;
