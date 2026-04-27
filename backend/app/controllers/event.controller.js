const db = require('../models');
const { validateEventInput } = require('../utils/validation');

const Op = db.Sequelize.Op;

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function plainEvent(event) {
  return event?.get ? event.get({ plain: true }) : event;
}

function addLifecycleFields(event) {
  const item = plainEvent(event);
  const eventDate = item.date || null;
  const isPast = Boolean(eventDate && eventDate < todayKey());

  return {
    ...item,
    is_past: isPast,
    is_active: !isPast,
    lifecycle_status: isPast ? 'Past' : 'Active'
  };
}

function eventWhere(userId, status = 'all') {
  const where = { user_id: userId };

  if (status === 'past') {
    where.date = { [Op.lt]: todayKey() };
  }

  if (status === 'active') {
    where[Op.or] = [
      { date: null },
      { date: { [Op.gte]: todayKey() } }
    ];
  }

  return where;
}

async function withTaskCounts(event) {
  const item = addLifecycleFields(event);
  const where = { event_id: item.id };

  const [totalTasks, completedTasks, inProgressTasks] = await Promise.all([
    db.tasks.count({ where }),
    db.tasks.count({ where: { ...where, status: 'Done' } }),
    db.tasks.count({ where: { ...where, status: 'Doing' } })
  ]);

  return {
    ...item,
    total_tasks: totalTasks,
    completed_tasks: completedTasks,
    in_progress_tasks: inProgressTasks
  };
}

exports.getEvents = async (req, res) => {
  try {
    const status = ['active', 'past', 'all'].includes(req.query.status) ? req.query.status : 'all';
    const events = await db.events.findAll({
      where: eventWhere(req.user.id, status),
      order: [['date', 'ASC'], ['id', 'ASC']]
    });

    res.json(await Promise.all(events.map(withTaskCounts)));
  } catch (err) {
    console.error('Get Events Error:', err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

exports.getActiveEvents = async (req, res) => {
  req.query.status = 'active';
  return exports.getEvents(req, res);
};

exports.getPastEvents = async (req, res) => {
  req.query.status = 'past';
  return exports.getEvents(req, res);
};

exports.createEvent = async (req, res) => {
  const validation = validateEventInput(req.body);
  if (validation.error) return res.status(400).json({ error: validation.error });

  try {
    const event = await db.events.create({
      ...validation.value,
      date: validation.value.date || null,
      user_id: req.user.id
    });

    res.status(201).json(await withTaskCounts(event));
  } catch (err) {
    console.error('Create Event Error:', err);
    res.status(500).json({ error: 'Failed to create event' });
  }
};

exports.updateEvent = async (req, res) => {
  const validation = validateEventInput(req.body);
  if (validation.error) return res.status(400).json({ error: validation.error });

  try {
    const event = await db.events.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!event) return res.status(404).json({ error: 'Event not found' });

    await event.update({ ...validation.value, date: validation.value.date || null });
    res.json(await withTaskCounts(event));
  } catch (err) {
    console.error('Update Event Error:', err);
    res.status(500).json({ error: 'Failed to update event' });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await db.events.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!event) return res.status(404).json({ error: 'Event not found' });

    await event.destroy();
    res.json({ message: 'Event and associated tasks deleted' });
  } catch (err) {
    console.error('Delete Event Error:', err);
    res.status(500).json({ error: 'Failed to delete event' });
  }
};
