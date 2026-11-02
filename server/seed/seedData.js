import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { Event } from '../models/Event.js';

dotenv.config();

export const seedInitialData = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Seeding initial demo users into MongoDB...');
      await User.insertMany([
        {
          id: 'usr_student_01',
          name: 'Fatima Noor',
          email: 'fatimanoor8841@gmail.com',
          password: 'Student@Pk2026!',
          role: 'student',
          studentId: 'STU-2026-8841',
          major: 'Computer Science & Software Engineering',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
        },
        {
          id: 'usr_organizer_01',
          name: 'Muhammad Bilal',
          email: 'muhammadbilal5521@gmail.com',
          password: 'Organizer#Pk2026',
          role: 'organizer',
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
          role: 'admin',
          adminId: 'ADM-2026-1102',
          department: 'Directorate of Student Affairs',
          title: 'Dean of Student Affairs & Campus Life',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
        },
      ]);
      console.log('✅ 3 Demo Users Seeded (student@campus.edu, organizer@campus.edu, admin@campus.edu)');
    }

    const eventCount = await Event.countDocuments();
    if (eventCount === 0) {
      console.log('🌱 Seeding initial campus events into MongoDB...');
      await Event.insertMany([
        {
          id: 'evt_001',
          title: 'AI & Quantum Computing Symposium 2026',
          description: 'Join leading faculty and industry pioneers exploring the fusion of generative AI architectures and practical quantum algorithms.',
          societyName: 'Computer Science Society',
          venue: 'Main Auditorium – Sir C.V. Raman Hall',
          date: '2026-11-05',
          startTime: '09:30 AM',
          endTime: '04:30 PM',
          capacity: 150,
          registeredCount: 147,
          status: 'published',
          category: 'Technology & Research',
          tags: ['AI', 'Quantum', 'Innovation'],
        },
        {
          id: 'evt_002',
          title: 'University Hackathon: CodeSprint X',
          description: 'An intense 24-hour sprint tackling sustainability, health tech, and university life challenges with mentorship and hardware kits.',
          societyName: 'Software Developers Guild',
          venue: 'Innovation Hub – Tech Seminar Room 3',
          date: '2026-11-12',
          startTime: '08:00 AM',
          endTime: '08:00 PM',
          capacity: 100,
          registeredCount: 100,
          status: 'published',
          category: 'Coding & Hackathon',
          tags: ['Hackathon', 'Coding', 'Open Source'],
        },
        {
          id: 'evt_003',
          title: 'National Autonomous Robotics Championship',
          description: 'Watch university teams deploy autonomous rovers through complex obstacle courses and multi-terrain search scenarios.',
          societyName: 'Robotics & Mechatronics Society',
          venue: 'Engineering Complex – Hall B',
          date: '2026-11-18',
          startTime: '10:00 AM',
          endTime: '03:30 PM',
          capacity: 120,
          registeredCount: 65,
          status: 'published',
          category: 'Robotics & Hardware',
          tags: ['Robotics', 'Hardware', 'Competition'],
        },
        {
          id: 'evt_004',
          title: 'FinTech, Web3 & Venture Building Summit',
          description: 'An in-depth conference featuring venture capitalists, algorithmic trading leaders, and startup founders on future finance.',
          societyName: 'Finance & Economics Club',
          venue: 'School of Management – Hall 101',
          date: '2026-11-24',
          startTime: '01:30 PM',
          endTime: '05:30 PM',
          capacity: 80,
          registeredCount: 32,
          status: 'published',
          category: 'Finance & Entrepreneurship',
          tags: ['FinTech', 'Economics', 'Startups'],
        },
        {
          id: 'evt_005',
          title: 'Annual Campus Film & Media Festival',
          description: 'Screening award-winning student short films, documentary spotlights, and a panel discussion with independent film directors.',
          societyName: 'Cinema & Creative Arts Society',
          venue: 'Performing Arts Theatre – Black Box',
          date: '2026-12-02',
          startTime: '05:00 PM',
          endTime: '09:00 PM',
          capacity: 200,
          registeredCount: 195,
          status: 'published',
          category: 'Arts & Media',
          tags: ['Film', 'Creative', 'Media'],
        },
        {
          id: 'evt_006',
          title: 'Biotech & Synthetic Biology Research Forum',
          description: 'Poster sessions, lightning talks, and laboratory demonstrations on CRISPR gene editing and biomaterial engineering.',
          societyName: 'Life Sciences Association',
          venue: 'Bioengineering Research Concourse',
          date: '2026-12-08',
          startTime: '11:00 AM',
          endTime: '03:00 PM',
          capacity: 75,
          registeredCount: 40,
          status: 'published',
          category: 'Science & Biotech',
          tags: ['Biology', 'Research', 'Biotech'],
        },
      ]);
      console.log('✅ 6 Campus Events Seeded into MongoDB');
    }
  } catch (err) {
    console.error('⚠️ Seeding error:', err.message);
  }
};
