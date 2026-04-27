const bcrypt = require('bcryptjs');
const db = require('../models');

function addDays(baseDate, days) {
  const date = new Date(baseDate);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

// Demo accounts provide realistic data for the final presentation.
// Dates are relative, so the demo always contains both past and active events.
const demoAccounts = [
  {
    username: 'demo1',
    password: '123456',
    events: [
      {
        title: 'Wedding Planning',
        dateOffset: -21,
        location: 'Rose Garden Hall',
        description: 'Full planning data for a wedding celebration.',
        budget: 12000,
        category: 'Wedding',
        guest_count: 120,
        notes: 'Includes venue, catering, decoration, and schedule follow-up.',
        tasks: [
          ['Confirm venue booking', 'Call the venue and finalize the reservation.', 'To Do', 'High Priority', 1, 'Amina', 3, 0],
          ['Meet the caterer', 'Review the final menu and dessert options.', 'Doing', 'High Priority', 0, 'Karim', 5, 0],
          ['Choose table decorations', 'Approve flower centerpieces and table styling.', 'To Do', 'Medium Priority', 0, 'Lina', 6, 0],
          ['Send invitations', 'Share digital and printed invitations with guests.', 'Done', 'Medium Priority', 0, 'Amina', -4, 0],
          ['Finalize wedding timeline', 'Prepare the ceremony and reception timeline.', 'Doing', 'High Priority', 1, 'Karim', 8, 0]
        ]
      },
      {
        title: 'Birthday Party',
        dateOffset: -9,
        location: 'Sky Lounge',
        description: 'Complete planning data for a private birthday celebration.',
        budget: 1800,
        category: 'Birthday',
        guest_count: 30,
        notes: 'Focus on decorations, cake, and entertainment.',
        tasks: [
          ['Order custom cake', 'Confirm the design and pickup date for the cake.', 'To Do', 'High Priority', 1, 'Lina', 2, 0],
          ['Book DJ', 'Choose the DJ and send the event schedule.', 'Doing', 'Medium Priority', 0, 'Sam', 4, 0],
          ['Prepare guest list', 'Review invited guests and confirmations.', 'Done', 'Medium Priority', 0, 'Amina', -2, 0],
          ['Buy decorations', 'Purchase balloons, lights, and table décor.', 'To Do', 'Low Priority', 0, 'Sam', 3, 0],
          ['Confirm photo corner', 'Coordinate backdrop and accessories.', 'Doing', 'Low Priority', 0, 'Lina', 5, 0]
        ]
      },
      {
        title: 'Graduation Ceremony',
        dateOffset: 5,
        location: 'University Auditorium',
        description: 'Planning data for a graduation event and reception.',
        budget: 2500,
        category: 'School',
        guest_count: 70,
        notes: 'Track speakers, seating, certificates, and reception.',
        tasks: [
          ['Print certificates', 'Prepare and verify all graduation certificates.', 'Doing', 'High Priority', 1, 'Omar', 3, 0],
          ['Arrange seating plan', 'Set audience and family seating sections.', 'To Do', 'Medium Priority', 0, 'Sara', 4, 0],
          ['Confirm photographer', 'Review coverage time and group photos.', 'Done', 'Medium Priority', 0, 'Omar', -1, 0],
          ['Prepare reception snacks', 'Coordinate refreshments after the ceremony.', 'To Do', 'Low Priority', 0, 'Sara', 6, 0],
          ['Test presentation screen', 'Check microphone, projector, and screen display.', 'Doing', 'High Priority', 1, 'Omar', 2, 0]
        ]
      },
      {
        title: 'Networking Dinner',
        dateOffset: 14,
        location: 'Marina Restaurant',
        description: 'Evening networking dinner with invited guests and speakers.',
        budget: 3200,
        category: 'Dinner',
        guest_count: 45,
        notes: 'Realistic event scenario focused on venue, menu, and guest confirmations.',
        tasks: [
          ['Confirm dinner menu', 'Choose final starter, main course, and dessert options.', 'To Do', 'High Priority', 1, 'Amina', 3, 0],
          ['Prepare seating groups', 'Organize guests by teams and speakers.', 'Doing', 'Medium Priority', 0, 'Karim', 4, 0],
          ['Send reminder emails', 'Remind all guests about the dinner time and location.', 'To Do', 'Medium Priority', 0, 'Lina', 2, 0],
          ['Book photographer', 'Confirm photography coverage for the evening.', 'Done', 'Low Priority', 0, 'Sam', -1, 0],
          ['Print table cards', 'Prepare table cards and name tags for attendees.', 'Doing', 'Low Priority', 0, 'Lina', 5, 0]
        ]
      },
      {
        title: 'Startup Pitch Night',
        dateOffset: 28,
        location: 'Campus Innovation Lab',
        description: 'Student startup pitch event with judges, teams, and awards.',
        budget: 1500,
        category: 'Competition',
        guest_count: 60,
        notes: 'Includes judging schedule, pitch materials, and awards planning.',
        tasks: [
          ['Confirm judging panel', 'Call judges and confirm attendance.', 'To Do', 'High Priority', 1, 'Omar', 2, 0],
          ['Collect team slides', 'Receive pitch decks from all student teams.', 'Doing', 'High Priority', 1, 'Sara', 3, 0],
          ['Prepare scoring sheets', 'Print scoring sheets for every judge.', 'To Do', 'Medium Priority', 0, 'Omar', 1, 0],
          ['Book presentation room', 'Reserve room and confirm seating capacity.', 'Done', 'Medium Priority', 0, 'Sara', -2, 0],
          ['Buy award certificates', 'Prepare certificates and small prizes for winners.', 'To Do', 'Low Priority', 0, 'Lina', 4, 0]
        ]
      }
    ]
  },
  {
    username: 'demo2',
    password: '123456',
    events: [
      {
        title: 'Corporate Conference',
        dateOffset: -21,
        location: 'Innovation Center',
        description: 'Professional conference with speakers, sponsors, and registration flow.',
        budget: 10000,
        category: 'Conference',
        guest_count: 180,
        notes: 'Good example for presentations and business demos.',
        tasks: [
          ['Book keynote speaker', 'Confirm the keynote speaker contract and arrival time.', 'To Do', 'High Priority', 1, 'Nora', 5, 0],
          ['Prepare attendee badges', 'Design and print participant badges.', 'Doing', 'Medium Priority', 0, 'Hadi', 4, 0],
          ['Publish event agenda', 'Send the detailed conference agenda to attendees.', 'Done', 'Medium Priority', 0, 'Nora', -3, 0],
          ['Confirm sponsors', 'Collect final logos and booth requirements.', 'Doing', 'High Priority', 1, 'Rania', 6, 0],
          ['Arrange welcome desk', 'Prepare registration desk supplies and signage.', 'To Do', 'Low Priority', 0, 'Hadi', 2, 0]
        ]
      },
      {
        title: 'Product Launch',
        dateOffset: -9,
        location: 'Downtown Showroom',
        description: 'Launch event for a new product with guests and media.',
        budget: 7500,
        category: 'Business',
        guest_count: 90,
        notes: 'Includes media coverage, stage setup, and product display.',
        tasks: [
          ['Finalize press list', 'Prepare the list of invited media contacts.', 'To Do', 'High Priority', 0, 'Rania', 3, 0],
          ['Test product demo', 'Run through the live product demonstration.', 'Doing', 'High Priority', 1, 'Yassine', 2, 0],
          ['Confirm stage design', 'Approve lighting and backdrop setup.', 'Done', 'Medium Priority', 0, 'Nora', -2, 0],
          ['Prepare welcome gifts', 'Organize guest packs and product brochures.', 'To Do', 'Low Priority', 0, 'Hadi', 4, 0],
          ['Review event script', 'Check presenter notes and the event flow.', 'Doing', 'Medium Priority', 0, 'Yassine', 1, 0]
        ]
      },
      {
        title: 'Team Building Retreat',
        dateOffset: 5,
        location: 'Mountain Resort',
        description: 'Internal company retreat with activities and logistics.',
        budget: 6200,
        category: 'Retreat',
        guest_count: 45,
        notes: 'Useful for demonstrating event logistics and schedule tracking.',
        tasks: [
          ['Reserve transportation', 'Confirm buses and pickup times for the team.', 'To Do', 'High Priority', 1, 'Maya', 7, 0],
          ['Choose activity schedule', 'Select workshops and team activities.', 'Doing', 'Medium Priority', 0, 'Bilal', 5, 0],
          ['Confirm room list', 'Match room assignments with final attendance.', 'Done', 'Medium Priority', 0, 'Maya', -1, 0],
          ['Prepare welcome kits', 'Pack agenda, badges, and branded items.', 'To Do', 'Low Priority', 0, 'Bilal', 4, 0],
          ['Collect dietary needs', 'Review food restrictions and share with catering.', 'Doing', 'High Priority', 1, 'Maya', 3, 0]
        ]
      },
      {
        title: 'Client Appreciation Evening',
        dateOffset: 14,
        location: 'Riverside Hotel',
        description: 'Business event to thank key clients and partners.',
        budget: 8400,
        category: 'Business',
        guest_count: 110,
        notes: 'Includes VIP invitations, catering, welcome speech, and gifts.',
        tasks: [
          ['Prepare VIP invitations', 'Send personalized invitations to priority clients.', 'To Do', 'High Priority', 1, 'Nora', 3, 0],
          ['Order client gifts', 'Choose and order branded gifts for attendees.', 'Doing', 'Medium Priority', 0, 'Rania', 5, 0],
          ['Confirm catering package', 'Review food package and service timing.', 'To Do', 'High Priority', 0, 'Hadi', 4, 0],
          ['Draft welcome speech', 'Prepare notes for the opening speech.', 'Done', 'Medium Priority', 0, 'Yassine', -2, 0],
          ['Arrange reception desk', 'Prepare check-in list and welcome materials.', 'Doing', 'Low Priority', 0, 'Maya', 2, 0]
        ]
      },
      {
        title: 'Training Workshop',
        dateOffset: 28,
        location: 'Company Training Room',
        description: 'Internal workshop for onboarding and staff development.',
        budget: 2200,
        category: 'Workshop',
        guest_count: 35,
        notes: 'Tracks material preparation, trainer setup, and attendance.',
        tasks: [
          ['Confirm trainer availability', 'Check trainer schedule and training agenda.', 'To Do', 'High Priority', 1, 'Bilal', 2, 0],
          ['Prepare training laptops', 'Install software and test all laptops.', 'Doing', 'High Priority', 1, 'Yassine', 1, 0],
          ['Print participant material', 'Print handouts and exercises for participants.', 'To Do', 'Medium Priority', 0, 'Maya', 3, 0],
          ['Create attendance sheet', 'Prepare sign-in sheet for the workshop.', 'Done', 'Low Priority', 0, 'Hadi', -1, 0],
          ['Order coffee break', 'Arrange drinks and snacks for the break.', 'To Do', 'Low Priority', 0, 'Rania', 4, 0]
        ]
      }
    ]
  },
  {
    username: 'demo3',
    password: '123456',
    events: [
      {
        title: 'Music Festival',
        dateOffset: -21,
        location: 'City Arena',
        description: 'Festival event with artists, tickets, and audience logistics.',
        budget: 20000,
        category: 'Festival',
        guest_count: 500,
        notes: 'Large-scale example with multiple coordination tasks.',
        tasks: [
          ['Confirm artist schedule', 'Lock arrival times and performance slots.', 'Doing', 'High Priority', 1, 'Zein', 3, 0],
          ['Review ticket sales', 'Check current ticket sales and gate planning.', 'To Do', 'Medium Priority', 0, 'Rim', 2, 0],
          ['Hire security team', 'Finalize the number of guards and shifts.', 'Doing', 'High Priority', 1, 'Zein', 4, 0],
          ['Publish final poster', 'Release the final lineup and poster on social media.', 'Done', 'Medium Priority', 0, 'Rim', -2, 0],
          ['Prepare backstage passes', 'Create passes for crew, artists, and vendors.', 'To Do', 'Low Priority', 0, 'Adam', 5, 0]
        ]
      },
      {
        title: 'Charity Gala',
        dateOffset: -9,
        location: 'Grand Hotel Ballroom',
        description: 'Fundraising gala with donors, sponsors, and entertainment.',
        budget: 9000,
        category: 'Gala',
        guest_count: 150,
        notes: 'Good scenario for sponsors, seating, and guest management.',
        tasks: [
          ['Prepare donor list', 'Finalize the VIP and donor invitation list.', 'To Do', 'High Priority', 0, 'Meriem', 3, 0],
          ['Confirm host speech', 'Review the speech and presentation order.', 'Doing', 'Medium Priority', 0, 'Adam', 2, 0],
          ['Arrange auction items', 'Collect and label charity auction items.', 'Doing', 'High Priority', 1, 'Meriem', 4, 0],
          ['Book live band', 'Confirm the band and technical needs.', 'Done', 'Medium Priority', 0, 'Yara', -3, 0],
          ['Design table cards', 'Prepare seating table numbers and names.', 'To Do', 'Low Priority', 0, 'Yara', 5, 0]
        ]
      },
      {
        title: 'Community Workshop',
        dateOffset: 5,
        location: 'Public Library',
        description: 'Local community workshop with registration and resource planning.',
        budget: 1200,
        category: 'Workshop',
        guest_count: 35,
        notes: 'Smaller real-world event example for presentations.',
        tasks: [
          ['Print workshop material', 'Prepare handouts and worksheets.', 'Doing', 'Medium Priority', 1, 'Taha', 2, 0],
          ['Set up registration table', 'Prepare check-in list and attendee badges.', 'To Do', 'Medium Priority', 0, 'Loubna', 1, 0],
          ['Confirm trainer', 'Double-check trainer timing and needs.', 'Done', 'High Priority', 0, 'Taha', -1, 0],
          ['Prepare refreshments', 'Order drinks and light snacks.', 'To Do', 'Low Priority', 0, 'Loubna', 3, 0],
          ['Review room setup', 'Check seating layout and projector.', 'Doing', 'High Priority', 1, 'Taha', 1, 0]
        ]
      },
      {
        title: 'Sports Tournament',
        dateOffset: 14,
        location: 'City Sports Complex',
        description: 'Community sports tournament with teams, matches, and awards.',
        budget: 3500,
        category: 'Sports',
        guest_count: 200,
        notes: 'Includes team registration, match schedule, equipment, and awards.',
        tasks: [
          ['Confirm team registrations', 'Validate all team registrations and payments.', 'Doing', 'High Priority', 1, 'Zein', 2, 0],
          ['Prepare match schedule', 'Create tournament brackets and match times.', 'To Do', 'High Priority', 1, 'Adam', 3, 0],
          ['Book referees', 'Confirm referees for all tournament matches.', 'To Do', 'Medium Priority', 0, 'Rim', 4, 0],
          ['Order medals', 'Order medals and trophies for winners.', 'Done', 'Low Priority', 0, 'Yara', -2, 0],
          ['Check first-aid station', 'Prepare medical kit and first-aid point.', 'To Do', 'Medium Priority', 0, 'Meriem', 1, 0]
        ]
      },
      {
        title: 'Art Exhibition Opening',
        dateOffset: 28,
        location: 'Downtown Gallery',
        description: 'Opening night for a local art exhibition with guests and media.',
        budget: 4200,
        category: 'Exhibition',
        guest_count: 85,
        notes: 'Tracks artwork setup, artist coordination, invitations, and refreshments.',
        tasks: [
          ['Confirm artist attendance', 'Check arrival time and needs for each artist.', 'To Do', 'High Priority', 1, 'Yara', 2, 0],
          ['Set up artwork labels', 'Print and place labels for every artwork.', 'Doing', 'Medium Priority', 0, 'Loubna', 1, 0],
          ['Invite local press', 'Send press invitations and exhibition details.', 'To Do', 'Medium Priority', 0, 'Meriem', 3, 0],
          ['Arrange opening refreshments', 'Order drinks and small appetizers.', 'Done', 'Low Priority', 0, 'Taha', -1, 0],
          ['Test gallery lighting', 'Review spotlights and room lighting.', 'Doing', 'High Priority', 1, 'Adam', 1, 0]
        ]
      }
    ]
  }
];

async function findOrCreateUser(username, password) {
  const user = await db.users.findOne({ where: { username } });
  if (user) return user.id;

  const password_hash = await bcrypt.hash(password, 10);
  const created = await db.users.create({ username, password_hash });

  console.log(`Demo user created: ${username} / ${password}`);
  return created.id;
}

async function findExistingEvent(userId, title) {
  return db.events.findOne({ where: { user_id: userId, title } });
}

async function createTasksForEvent(eventId, eventData) {
  const baseDate = new Date();

  for (let index = 0; index < eventData.tasks.length; index += 1) {
    const [title, description, status, priority, daily_focus, assignee, dueOffset, cost] = eventData.tasks[index];
    const dueDate = addDays(baseDate, dueOffset);

    await db.tasks.create({
      event_id: eventId,
      title,
      description,
      status,
      priority,
      daily_focus,
      assignee,
      dueDate,
      task_dates: JSON.stringify([dueDate]),
      cost,
      position: index
    });
  }
}

async function upsertDemoEvent(userId, eventData) {
  const eventDate = addDays(new Date(), eventData.dateOffset ?? 7);
  const payload = {
    user_id: userId,
    title: eventData.title,
    date: eventDate,
    location: eventData.location,
    description: eventData.description,
    budget: eventData.budget,
    event_type: eventData.category,
    guest_count: eventData.guest_count,
    notes: eventData.notes
  };

  const existingEvent = await findExistingEvent(userId, eventData.title);

  if (existingEvent) {
    await existingEvent.update(payload);

    const taskCount = await db.tasks.count({ where: { event_id: existingEvent.id } });
    if (taskCount === 0) await createTasksForEvent(existingEvent.id, eventData);

    return false;
  }

  const event = await db.events.create(payload);
  await createTasksForEvent(event.id, eventData);
  return true;
}

async function seedDemoData() {
  try {
    for (const account of demoAccounts) {
      const userId = await findOrCreateUser(account.username, account.password);
      let createdCount = 0;

      for (const eventData of account.events) {
        const created = await upsertDemoEvent(userId, eventData);
        if (created) createdCount += 1;
      }

      const message = createdCount > 0
        ? `${createdCount} demo event(s) created for ${account.username}`
        : `All demo events already exist for ${account.username}`;

      console.log(message);
    }
  } catch (error) {
    console.error('Failed to seed demo data:', error);
  }
}

module.exports = seedDemoData;
