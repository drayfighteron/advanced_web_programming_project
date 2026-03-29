
export const mockTasks = [
  {
    id: 1,
    title: 'Reserve Venue',
    description: 'Reserve venue, peer venues: July 1.',
    status: 'To Do',
    priority: 'High Priority',
    assignee: 'Ismaël',
    dueDate: 'July 1',
    cost: null
  },
  {
    id: 2,
    title: 'Contact Photographer',
    description: 'Contact a view party now photograp...',
    status: 'To Do',
    priority: 'Medium Priority',
    assignee: 'Zakari',
    dueDate: null,
    cost: null
  },
  {
    id: 3,
    title: 'Book DJ',
    description: 'Book DJ and a storage in Tech Conference 2028.',
    status: 'Doing',
    priority: 'Contract draft',
    assignee: 'Rayan',
    dueDate: null,
    cost: null
  },
  {
    id: 4,
    title: 'Pay Deposit',
    description: 'Pay deposit to sagins to tover leo can price to the IS.',
    status: 'Done',
    priority: 'Done',
    assignee: 'Pierre-A.',
    dueDate: 'June 15',
    cost: 2000
  },
  {
    id: 5,
    title: 'Confirm Catering',
    description: 'Confirm Catering, servers in nicolas.',
    status: 'Done',
    priority: 'Done',
    assignee: 'Nicolas',
    dueDate: null,
    cost: 3000
  }
];
export const mockEvents = [
  {
    id: 'ev1',
    title: 'Charity Fundraiser 2026',
    date: 'Sep 19, 2026',
    location: 'Vancouver, BC',
    description: 'Annual charity gala raising funds for local youth programs.',
    budget: 25000,
    color: '#D4862A', // Orange
    stats: { todo: 1, doing: 1, done: 1 }
  },
  {
    id: 'ev2',
    title: 'Music Festival 2026',
    date: 'Jul 24, 2026',
    location: 'Quebec City, QC',
    description: 'Three-day outdoor festival featuring local and international artists.',
    budget: 25000,
    color: '#4A7C59', // Green
    stats: { todo: 1, doing: 1, done: 0 }
  },
  {
    id: 'ev3',
    title: 'Art Exhibition',
    date: 'Oct 4, 2026',
    location: 'Ottawa, ON',
    description: 'Contemporary art showcase highlighting emerging Canadian talent.',
    budget: 8000,
    color: '#2E3A5C', // Blue
    stats: { todo: 0, doing: 0, done: 0 }
  },
  {
    id: 'ev4',
    title: 'Startup Pitch Day',
    date: 'Aug 14, 2026',
    location: 'Calgary, AB',
    description: 'Investor pitch event for early-stage tech startups.',
    budget: 5000,
    color: '#C85A5A', // Red
    stats: { todo: 0, doing: 0, done: 0 }
  },
  {
    id: 'ev5',
    title: 'Tech Conference 2026',
    date: 'Nov 9, 2026',
    location: 'Montreal, QC',
    description: 'Annual gathering of software engineers and industry leaders.',
    budget: 15000,
    color: '#7C5CBF', // Purple
    stats: { todo: 4, doing: 2, done: 2 }
  }
];