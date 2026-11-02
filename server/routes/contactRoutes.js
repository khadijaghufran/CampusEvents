import express from 'express';
import { Contact } from '../models/Contact.js';

const router = express.Router();

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

/**
 * POST /api/contact
 * Body: { name, age, email, topic, message }
 */
router.post('/', async (req, res) => {
  try {
    const { name, age, email, topic, message } = req.body;

    // Check required fields for empty or whitespace-only inputs
    if (
      !name ||
      !String(name).trim() ||
      !email ||
      !String(email).trim() ||
      !message ||
      !String(message).trim() ||
      age === undefined ||
      age === null ||
      String(age).trim() === ''
    ) {
      return res.status(400).json({
        message: 'Please fill in all required fields (name, age, email, message).',
      });
    }

    // Validate numeric age
    const ageNum = Number(age);
    if (!/^\d+$/.test(String(age).trim()) || isNaN(ageNum) || !Number.isInteger(ageNum)) {
      return res.status(400).json({
        message: 'Age must accept only valid numbers.',
      });
    }
    if (ageNum < 16 || ageNum > 120) {
      return res.status(400).json({
        message: 'Age must be between 16 and 120 years old.',
      });
    }

    // Validate email format
    const trimmedEmail = String(email).trim();
    if (trimmedEmail.includes('..') || !EMAIL_REGEX.test(trimmedEmail)) {
      return res.status(400).json({
        message: 'Email must follow a proper email format (e.g. user@campus.edu).',
      });
    }

    // Validate message length
    if (String(message).trim().length < 10) {
      return res.status(400).json({
        message: 'Message must be at least 10 characters long.',
      });
    }

    const ticketId = `TICK-${Math.floor(100000 + Math.random() * 900000)}`;

    const newContact = await Contact.create({
      ticketId,
      name: String(name).trim(),
      age: ageNum,
      email: trimmedEmail.toLowerCase(),
      topic: topic ? String(topic).trim() : 'General Inquiry',
      message: String(message).trim(),
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
