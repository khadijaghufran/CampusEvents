import express from 'express';
import { Event } from '../models/Event.js';
import { Registration } from '../models/Registration.js';

const router = express.Router();

/**
 * GET /api/events
 * Query param: ?status=published
 */
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const events = await Event.find(filter).sort({ date: 1 });
    return res.json(events);
  } catch (error) {
    console.error('Fetch events error:', error);
    return res.status(500).json({ message: 'Error retrieving events from database.' });
  }
});

/**
 * POST /api/events/:id/register
 * Body: { studentId }
 */
router.post('/:id/register', async (req, res) => {
  try {
    const eventId = req.params.id;
    const { studentId } = req.body;

    if (!studentId) {
      return res.status(400).json({ message: 'studentId is required for registration.' });
    }

    // Check duplicate
    const existing = await Registration.findOne({ eventId, studentId });
    if (existing) {
      return res.status(409).json({
        message: 'Duplicate registration: You have already registered for this event.',
      });
    }

    // Check event exists & capacity
    const event = await Event.findOne({ id: eventId });
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    if (event.status !== 'published') {
      return res.status(400).json({ message: 'Registration is not open for this event.' });
    }

    if (event.registeredCount >= event.capacity) {
      return res.status(400).json({
        message: 'Registration is closed: This venue has reached maximum seating capacity.',
      });
    }

    // Record registration
    await Registration.create({ eventId, studentId });

    // Atomically increment registered count
    event.registeredCount += 1;
    await event.save();

    return res.json({
      success: true,
      message: `Seat confirmed! You have successfully registered for "${event.title}".`,
      eventId,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Server error while processing registration.' });
  }
});

export default router;
