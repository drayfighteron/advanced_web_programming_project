const db = require('../models');
const { validateTaskInput, validateReorderTasksInput } = require('../utils/validation');

function parseTaskDates(task) {
  const item = task?.get ? task.get({ plain: true }) : task;
  if (!item) return item;

  let taskDates = [];

  if (item.task_dates) {
    try {
      const parsed = JSON.parse(item.task_dates);
      taskDates = Array.isArray(parsed) ? parsed : [];
    } catch {
      taskDates = [];
    }
  }

  return { ...item, task_dates: taskDates };
}

function serializeTaskDates(taskDates) {
  return JSON.stringify(Array.isArray(taskDates) ? taskDates : []);
}

async function verifyEventOwnership(eventId, userId) {
  const event = await db.events.findOne({ where: { id: eventId, user_id: userId } });
  return Boolean(event);
}

async function findOwnedTask(taskId, userId) {
  return db.tasks.findOne({
    where: { id: taskId },
    include: [{
      model: db.events,
      as: 'event',
      where: { user_id: userId },
      attributes: ['id', 'title', 'date', 'location']
    }]
  });
}

exports.getTasksForUser = async (req, res) => {
  try {
    const tasks = await db.tasks.findAll({
      include: [{
        model: db.events,
        as: 'event',
        where: { user_id: req.user.id },
        attributes: ['title', 'date', 'location']
      }],
      order: [['dueDate', 'ASC'], ['position', 'ASC']]
    });

    res.json(tasks.map((task) => {
      const item = parseTaskDates(task);
      return {
        ...item,
        event_title: item.event?.title,
        event_date: item.event?.date,
        event_location: item.event?.location,
        event: undefined
      };
    }));
  } catch (err) {
    console.error('Get All Tasks Error:', err);
    res.status(500).json({ error: 'Failed to fetch daily tasks' });
  }
};

exports.getTasksByEvent = async (req, res) => {
  try {
    const hasAccess = await verifyEventOwnership(req.params.eventId, req.user.id);
    if (!hasAccess) return res.status(403).json({ error: 'Unauthorized access to this event' });

    const tasks = await db.tasks.findAll({
      where: { event_id: req.params.eventId },
      order: [['status', 'ASC'], ['position', 'ASC']]
    });

    res.json(tasks.map(parseTaskDates));
  } catch (err) {
    console.error('Get Tasks Error:', err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

exports.createTask = async (req, res) => {
  try {
    const hasAccess = await verifyEventOwnership(req.params.eventId, req.user.id);
    if (!hasAccess) return res.status(403).json({ error: 'Unauthorized action' });

    const validation = validateTaskInput(req.body);
    if (validation.error) return res.status(400).json({ error: validation.error });

    const task = await db.tasks.create({
      ...validation.value,
      event_id: Number(req.params.eventId),
      dueDate: validation.value.dueDate || null,
      task_dates: serializeTaskDates(validation.value.task_dates)
    });

    res.status(201).json(parseTaskDates(task));
  } catch (err) {
    console.error('Create Task Error:', err);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

exports.updateTask = async (req, res) => {
  const validation = validateTaskInput(req.body);
  if (validation.error) return res.status(400).json({ error: validation.error });

  try {
    const task = await findOwnedTask(req.params.taskId, req.user.id);
    if (!task) return res.status(403).json({ error: 'Unauthorized or task not found' });

    await task.update({
      ...validation.value,
      dueDate: validation.value.dueDate || null,
      task_dates: serializeTaskDates(validation.value.task_dates)
    });

    res.json(parseTaskDates(task));
  } catch (err) {
    console.error('Update Task Error:', err);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

exports.reorderTasks = async (req, res) => {
  const validation = validateReorderTasksInput(req.body.tasks);
  if (validation.error) return res.status(400).json({ error: validation.error });

  try {
    // Verify ownership task by task before saving the new column/position.
    for (const task of validation.value) {
      const ownedTask = await findOwnedTask(task.id, req.user.id);
      if (!ownedTask) return res.status(403).json({ error: `Unauthorized task id ${task.id}` });

      await ownedTask.update({ status: task.status, position: task.position });
    }

    res.json({ message: 'Tasks reordered successfully' });
  } catch (err) {
    console.error('Reorder Tasks Error:', err);
    res.status(500).json({ error: 'Failed to reorder tasks' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await findOwnedTask(req.params.taskId, req.user.id);
    if (!task) return res.status(403).json({ error: 'Unauthorized or task not found' });

    await task.destroy();
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Delete Task Error:', err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};
