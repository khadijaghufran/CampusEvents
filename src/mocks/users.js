import { ROLES } from '../constants/roles.js';

/**
 * Mock demo users with Pakistani names, role-specific IDs, and custom Gmail addresses.
 */
export const MOCK_USERS = [
  {
    id: 'usr_student_01',
    name: 'Fatima Noor',
    email: 'fatimanoor8841@gmail.com',
    password: 'Student@Pk2026!',
    role: ROLES.STUDENT,
    studentId: 'STU-2026-8841',
    major: 'Computer Science & Software Engineering',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'usr_organizer_01',
    name: 'Muhammad Bilal',
    email: 'muhammadbilal5521@gmail.com',
    password: 'Organizer#Pk2026',
    role: ROLES.ORGANIZER,
    organizerId: 'ORG-2026-5521',
    society: 'ACM & IEEE Student Chapter',
    position: 'Society President',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'usr_admin_01',
    name: 'Prof. Dr. Tariq Mehmood',
    email: 'tariqmehmood1102@gmail.com',
    password: 'Admin$Pk2026!',
    role: ROLES.ADMIN,
    adminId: 'ADM-2026-1102',
    department: 'Directorate of Student Affairs',
    title: 'Dean of Student Affairs & Campus Life',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
  },
];
