import express from 'express';
import { User } from '../models/User.js';

const router = express.Router();

/**
 * POST /api/auth/login
 * Body: { email, password, role }
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: 'Please provide email, password, and role.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        message: 'No account found with this email address.',
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        message: 'Incorrect password. Please try again.',
      });
    }

    if (user.role !== role) {
      return res.status(403).json({
        message: `Role mismatch: This account is registered as a ${user.role}, not ${role}.`,
      });
    }

    // Return user without password
    const userObj = user.toObject();
    delete userObj.password;

    return res.json(userObj);
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      message: 'Internal server error during authentication.',
    });
  }
});

/**
 * POST /api/auth/logout
 */
router.post('/logout', (req, res) => {
  return res.json({ success: true, message: 'Logged out successfully.' });
});

export default router;
