import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { User } from '../models/User.js';
import { Event } from '../models/Event.js';
import { Venue } from '../models/Venue.js';
import { Registration } from '../models/Registration.js';
import { connectDB } from '../config/db.js';

dotenv.config();

export const seedInitialData = async () => {
  try {
    console.log('🌱 Syncing demo users into MongoDB...');
    const demoUsers = [
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
    ];

    for (const u of demoUsers) {
      await User.findOneAndUpdate(
        { $or: [{ id: u.id }, { role: u.role }] },
        { $set: u },
        { upsert: true, new: true }
      );
    }
    console.log('✅ Demo Users Synced in MongoDB');

    // Seed Venues / Seminar Halls
    console.log('🌱 Seeding University Seminar Halls & Venues...');
    const demoVenues = [
      {
        id: 'ven_001',
        name: 'Main Auditorium – Sir C.V. Raman Hall',
        code: 'AUD-CVR',
        building: 'Main Academic Complex',
        capacity: 150,
        facilities: ['Dual 4K Projectors', 'Surround Sound System', 'Central AC', 'Stage Lighting'],
      },
      {
        id: 'ven_002',
        name: 'Innovation Hub – Tech Seminar Room 3',
        code: 'HUB-SEM3',
        building: 'Software Engineering Centre',
        capacity: 100,
        facilities: ['Interactive Displays', 'High-Speed Wi-Fi 6', 'Podium Audio'],
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
        facilities: ['Tiered Executive Seating', 'Smart Board', 'Video Conferencing'],
      },
      {
        id: 'ven_005',
        name: 'Performing Arts Theatre – Black Box',
        code: 'ARTS-BOX',
        building: 'Student Activity Centre',
        capacity: 200,
        facilities: ['Acoustic Paneling', 'Theatrical Lighting', 'Wireless Mics'],
      },
    ];

    for (const v of demoVenues) {
      await Venue.findOneAndUpdate({ code: v.code }, { $set: v }, { upsert: true, new: true });
    }
    console.log('✅ 5 Seminar Halls / Venues Synced in MongoDB');

    // Seed Events
    console.log('🌱 Seeding University Events into MongoDB...');
    const initialEvents = [
      {
        id: 'evt_001',
        title: 'AI & Quantum Computing Symposium 2026',
        description:
          'Join leading faculty and industry pioneers exploring the fusion of generative AI architectures and practical quantum algorithms.',
        societyName: 'Computer Science Society',
        venue: 'Main Auditorium – Sir C.V. Raman Hall',
        venueId: 'ven_001',
        date: '2026-11-20',
        startTime: '09:30 AM',
        endTime: '04:30 PM',
        capacity: 150,
        registeredCount: 147,
        status: 'published',
        category: 'Technology & Research',
        tags: ['AI', 'Quantum', 'Innovation'],
        organizerEmail: 'muhammadbilal5521@gmail.com',
        organizerName: 'Muhammad Bilal',
      },
      {
        id: 'evt_002',
        title: 'University Hackathon: CodeSprint X',
        description:
          'An intense 24-hour sprint tackling sustainability, health tech, and university life challenges with mentorship and hardware kits.',
        societyName: 'Software Developers Guild',
        venue: 'Innovation Hub – Tech Seminar Room 3',
        venueId: 'ven_002',
        date: '2026-11-25',
        startTime: '08:00 AM',
        endTime: '08:00 PM',
        capacity: 100,
        registeredCount: 100,
        status: 'closed', // Automatically closed because full
        category: 'Coding & Hackathon',
        tags: ['Hackathon', 'Coding', 'Open Source'],
        organizerEmail: 'muhammadbilal5521@gmail.com',
        organizerName: 'Muhammad Bilal',
      },
      {
        id: 'evt_003',
        title: 'National Autonomous Robotics Championship',
        description:
          'Watch university teams deploy autonomous rovers through complex obstacle courses and multi-terrain search scenarios.',
        societyName: 'Robotics & Mechatronics Society',
        venue: 'Engineering Complex – Hall B',
        venueId: 'ven_003',
        date: '2026-11-28',
        startTime: '10:00 AM',
        endTime: '03:30 PM',
        capacity: 120,
        registeredCount: 65,
        status: 'published',
        category: 'Robotics & Hardware',
        tags: ['Robotics', 'Hardware', 'Competition'],
        organizerEmail: 'muhammadbilal5521@gmail.com',
        organizerName: 'Muhammad Bilal',
      },
      {
        id: 'evt_004',
        title: 'Cybersecurity Defense & Ethical Hacking Bootcamp',
        description:
          'Hands-on red team and blue team cybersecurity training: penetration testing, network sniffing, and CTF challenges.',
        societyName: 'ACM & IEEE Student Chapter',
        venue: 'Innovation Hub – Tech Seminar Room 3',
        venueId: 'ven_002',
        date: '2026-12-05',
        startTime: '10:00 AM',
        endTime: '03:00 PM',
        capacity: 90,
        registeredCount: 0,
        status: 'pending', // Pending Admin approval!
        rejectionReason: '',
        category: 'Technology & Research',
        tags: ['Cybersecurity', 'Workshop', 'Hands-on'],
        organizerEmail: 'muhammadbilal5521@gmail.com',
        organizerName: 'Muhammad Bilal',
      },
    ];

    for (const evt of initialEvents) {
      await Event.findOneAndUpdate({ id: evt.id }, { $set: evt }, { upsert: true, new: true });
    }
    console.log('✅ University Events Synced (Published & Pending Proposals)');

    // Seed initial registration for Fatima Noor so her dashboard displays active registration
    await Registration.findOneAndUpdate(
      { eventId: 'evt_001', studentId: 'usr_student_01' },
      {
        $set: {
          eventId: 'evt_001',
          studentId: 'usr_student_01',
          studentName: 'Fatima Noor',
          studentEmail: 'fatimanoor8841@gmail.com',
          registrationCode: 'REG-2026-8841',
        },
      },
      { upsert: true, new: true }
    );
    console.log('✅ Student Demo Registration Synced');
  } catch (err) {
    console.error('⚠️ Seeding error:', err.message);
  }
};

// Auto-run if executed directly via CLI
const isDirectRun =
  process.argv[1] &&
  path.resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase();

if (isDirectRun) {
  const runSeed = async () => {
    await connectDB();
    await seedInitialData();
    console.log('🎉 MongoDB seeding and updating process complete!');
    process.exit(0);
  };
  runSeed().catch((err) => {
    console.error('❌ Direct seeding failed:', err);
    process.exit(1);
  });
}
