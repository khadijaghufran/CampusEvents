/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../api/authService';
import { MOCK_USERS } from '../mocks/users.js';

const STORAGE_KEY = 'campusevents_auth_user';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      // Automatically keep profile synchronized with current demo roster
      const matched = MOCK_USERS.find(
        (m) =>
          m.id === parsed.id ||
          m.role === parsed.role ||
          m.email === parsed.email ||
          (parsed.email && parsed.email.includes(m.role))
      );
      if (matched) {
        const userObj = { ...parsed, ...matched };
        delete userObj.password;
        return userObj;
      }
      return parsed;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  // Sync state changes with localStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (err) {
      console.error('Failed to sync auth state to localStorage', err);
    }
  }, [user]);

  const login = useCallback(async ({ email, password, role }) => {
    setLoading(true);
    try {
      const authenticatedUser = await authService.login({ email, password, role });
      setUser(authenticatedUser);
      return authenticatedUser;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setLoading(false);
    }
  }, []);

  const value = {
    user,
    role: user?.role || null,
    isAuthenticated: Boolean(user),
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
