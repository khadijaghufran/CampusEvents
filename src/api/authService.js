import axiosClient from './axiosClient';
import { MOCK_USERS } from '../mocks/users';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

/**
 * Authentication service handling login and logout workflows.
 */
export const authService = {
  /**
   * Authenticates user against backend or mock repository.
   *
   * @param {Object} credentials - { email, password, role }
   * @returns {Promise<Object>} Authenticated user object.
   */
  async login({ email, password, role }) {
    if (USE_MOCKS) {
      // Simulate real network latency (350ms)
      await new Promise((resolve) => setTimeout(resolve, 350));

      const normalizedEmail = (email || '').trim().toLowerCase();
      const matchedUser = MOCK_USERS.find(
        (u) => u.email.toLowerCase() === normalizedEmail
      );

      if (!matchedUser) {
        throw new Error('No account found with this email address.');
      }

      if (matchedUser.password !== password) {
        throw new Error('Incorrect password. Please try again.');
      }

      if (matchedUser.role !== role) {
        throw new Error(
          `Role mismatch: This account is registered as a ${matchedUser.role}, not ${role}.`
        );
      }

      // Return user profile (exclude password)
      const userWithoutPassword = { ...matchedUser };
      delete userWithoutPassword.password;
      return userWithoutPassword;
    }

    // Live backend endpoint: POST /api/auth/login
    return axiosClient.post('/auth/login', { email, password, role });
  },

  /**
   * Logs out the user.
   */
  async logout() {
    if (USE_MOCKS) {
      return { success: true };
    }
    try {
      return await axiosClient.post('/auth/logout');
    } catch {
      return { success: true };
    }
  },
};
