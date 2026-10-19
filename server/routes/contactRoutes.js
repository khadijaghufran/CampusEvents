import express from 'express';
import { Contact } from '../models/Contact.js';

const router = express.Router();

/**
 * POST /api/contact
 * Body: { name, email, topic, message }
 */
router.post('/', async (req, res) => {
  try {
    const { name, email, topic, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        message: 'Please fill in all required fields (name, email, message).',
      });
    }

    const ticketId = `TICK-${Math.floor(100000 + Math.random() * 900000)}`;

    const newContact = await Contact.create({
      ticketId,
      name,
      email,
      topic: topic || 'General Inquiry',
      message,
    });

    return res.status(201).json({
      success: true,
      message:
        'Thank you for reaching out! Your message has been saved in MongoDB and routed to the University Event Office.',
      ticketId: newContact.ticketId,
    });
  } catch (error) {
    console.error('Contact error:', error);
    return res.status(500).json({ message: 'Error submitting contact form.' });
  }
});

export default router;
