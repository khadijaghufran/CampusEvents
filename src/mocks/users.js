import { ROLES } from '../constants/roles';

/**
 * Mock demo users for development and testing without live backend
 */
export const MOCK_USERS = [
  {
    id: 'usr_student_01',
    name: 'Amina Al-Mansoor',
    email: 'student@campus.edu',
    password: 'password123',
    role: ROLES.STUDENT,
    studentId: 'STU-2026-8841',
    major: 'Computer Science & Engineering',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'usr_organizer_01',
    name: 'Marcus Vance',
    email: 'organizer@campus.edu',
    password: 'password123',
    role: ROLES.ORGANIZER,
    society: 'IEEE Student Chapter & CS Society',
    position: 'Society President',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'usr_admin_01',
    name: 'Dr. Sarah Jenkins',
    email: 'admin@campus.edu',
    password: 'password123',
    role: ROLES.ADMIN,
    department: 'Office of Student Affairs & Campus Life',
    title: 'Associate Dean of Student Activities',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
  },
];
