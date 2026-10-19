import { EVENT_STATUS } from '../constants/eventStatus';

/**
 * Mock events database for CampusEvents
 * Contains published, full (0 seats), nearly full, and non-published events.
 */
export const MOCK_EVENTS = [
  {
    id: 'evt_001',
    title: 'AI & Quantum Computing Symposium 2026',
    description:
      'Join leading faculty and industry pioneers exploring the fusion of generative AI architectures and practical quantum algorithms.',
    societyName: 'Computer Science Society',
    venue: 'Main Auditorium – Sir C.V. Raman Hall',
    date: '2026-11-05',
    startTime: '09:30 AM',
    endTime: '04:30 PM',
    capacity: 150,
    registeredCount: 147, // Nearly full: 3 seats left!
    status: EVENT_STATUS.PUBLISHED,
    category: 'Technology & Research',
    tags: ['AI', 'Quantum', 'Innovation'],
  },
  {
    id: 'evt_002',
    title: 'University Hackathon: CodeSprint X',
    description:
      'An intense 24-hour sprint tackling sustainability, health tech, and university life challenges with mentorship and hardware kits.',
    societyName: 'Software Developers Guild',
    venue: 'Innovation Hub – Tech Seminar Room 3',
    date: '2026-11-12',
    startTime: '08:00 AM',
    endTime: '08:00 PM',
    capacity: 100,
    registeredCount: 100, // 0 seats left: Registration Closed!
    status: EVENT_STATUS.PUBLISHED,
    category: 'Coding & Hackathon',
    tags: ['Hackathon', 'Coding', 'Open Source'],
  },
  {
    id: 'evt_003',
    title: 'National Autonomous Robotics Championship',
    description:
      'Watch university teams deploy autonomous rovers through complex obstacle courses and multi-terrain search scenarios.',
    societyName: 'Robotics & Mechatronics Society',
    venue: 'Engineering Complex – Hall B',
    date: '2026-11-18',
    startTime: '10:00 AM',
    endTime: '03:30 PM',
    capacity: 120,
    registeredCount: 65, // 55 seats left
    status: EVENT_STATUS.PUBLISHED,
    category: 'Robotics & Hardware',
    tags: ['Robotics', 'Hardware', 'Competition'],
  },
  {
    id: 'evt_004',
    title: 'FinTech, Web3 & Venture Building Summit',
    description:
      'An in-depth conference featuring venture capitalists, algorithmic trading leaders, and startup founders on future finance.',
    societyName: 'Finance & Economics Club',
    venue: 'School of Management – Hall 101',
    date: '2026-11-24',
    startTime: '01:30 PM',
    endTime: '05:30 PM',
    capacity: 80,
    registeredCount: 32, // 48 seats left
    status: EVENT_STATUS.PUBLISHED,
    category: 'Finance & Entrepreneurship',
    tags: ['FinTech', 'Economics', 'Startups'],
  },
  {
    id: 'evt_005',
    title: 'Annual Campus Film & Media Festival',
    description:
      'Screening award-winning student short films, documentary spotlights, and a panel discussion with independent film directors.',
    societyName: 'Cinema & Creative Arts Society',
    venue: 'Performing Arts Theatre – Black Box',
    date: '2026-12-02',
    startTime: '05:00 PM',
    endTime: '09:00 PM',
    capacity: 200,
    registeredCount: 195, // Nearly full: 5 seats left!
    status: EVENT_STATUS.PUBLISHED,
    category: 'Arts & Media',
    tags: ['Film', 'Creative', 'Media'],
  },
  {
    id: 'evt_006',
    title: 'Biotech & Synthetic Biology Research Forum',
    description:
      'Poster sessions, lightning talks, and laboratory demonstrations on CRISPR gene editing and biomaterial engineering.',
    societyName: 'Life Sciences Association',
    venue: 'Bioengineering Research Concourse',
    date: '2026-12-08',
    startTime: '11:00 AM',
    endTime: '03:00 PM',
    capacity: 75,
    registeredCount: 40, // 35 seats left
    status: EVENT_STATUS.PUBLISHED,
    category: 'Science & Biotech',
    tags: ['Biology', 'Research', 'Biotech'],
  },
  // Non-published mock items to prove that getPublishedEvents() filters them out
  {
    id: 'evt_007',
    title: 'Acoustic Unplugged Night (Pending Review)',
    description: 'Proposed open mic acoustic concert pending dean review.',
    societyName: 'Music Society',
    venue: 'Campus Amphitheatre',
    date: '2026-12-15',
    startTime: '06:00 PM',
    endTime: '09:00 PM',
    capacity: 150,
    registeredCount: 0,
    status: EVENT_STATUS.PENDING,
    category: 'Music',
  },
  {
    id: 'evt_008',
    title: 'Late Night Rave (Rejected)',
    description: 'Rejected due to curfew regulations and venue policy.',
    societyName: 'Student Party Guild',
    venue: 'Main Sports Complex',
    date: '2026-12-20',
    startTime: '10:00 PM',
    endTime: '02:00 AM',
    capacity: 300,
    registeredCount: 0,
    status: EVENT_STATUS.REJECTED,
    category: 'Entertainment',
  },
  {
    id: 'evt_009',
    title: 'Classical Literature Colloquium (Approved, not yet published)',
    description: 'Approved by admin, scheduled for public release next week.',
    societyName: 'Literary & Debating Society',
    venue: 'Humanities Hall 4',
    date: '2026-12-22',
    startTime: '02:00 PM',
    endTime: '04:30 PM',
    capacity: 50,
    registeredCount: 0,
    status: EVENT_STATUS.APPROVED,
    category: 'Literature',
  },
];
