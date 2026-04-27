const VALID_TASK_STATUSES = ['To Do', 'Doing', 'Done'];
const VALID_PRIORITIES = ['Low Priority', 'Medium Priority', 'High Priority'];
const VALID_EVENT_TYPES = ['School', 'Personal', 'Work', 'Other', 'Wedding', 'Birthday', 'Conference', 'Business', 'Dinner', 'Competition', 'Retreat', 'Workshop', 'Festival', 'Gala', 'Sports', 'Exhibition'];

const isValidDateString = (value) => {
    if (value === null || value === undefined || value === '') return true;
    if (typeof value !== 'string') return false;

    const trimmed = value.trim();

    // Keep date validation strict so the frontend and MySQL always receive YYYY-MM-DD.
    if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return false;

    // Parse at UTC midnight to avoid timezone shifting the selected day.
    const date = new Date(`${trimmed}T00:00:00Z`);
    if (Number.isNaN(date.getTime())) return false;

    return date.toISOString().slice(0, 10) === trimmed;
};

const normalizeOptionalString = (value, maxLength) => {
  if (value === null || value === undefined) return null;
  if (typeof value !== 'string') return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  return maxLength ? trimmed.slice(0, maxLength) : trimmed;
};

const normalizeRequiredString = (value) => {
  if (typeof value !== 'string') return '';
  return value.trim();
};

const toSafeNumber = (value, fallback = 0) => {
  if (value === null || value === undefined || value === '') return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : NaN;
};

const normalizeTaskDates = (value) => {
  let dates = [];

  if (Array.isArray(value)) {
    dates = value;
  } else if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return [];

    try {
      const parsed = JSON.parse(trimmed);
      dates = Array.isArray(parsed) ? parsed : trimmed.split(',');
    } catch {
      dates = trimmed.split(',');
    }
  }

  return [...new Set(dates
    .map((date) => (typeof date === 'string' ? date.trim() : ''))
    .filter(Boolean))];
};

const validateRegisterInput = ({ username, password }) => {
  const cleanUsername = normalizeRequiredString(username);

  if (!cleanUsername || !password) {
    return { error: 'Username and password are required' };
  }

  if (cleanUsername.length < 3 || cleanUsername.length > 30) {
    return { error: 'Username must be between 3 and 30 characters' };
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(cleanUsername)) {
    return { error: 'Username can only contain letters, numbers, underscores, and hyphens' };
  }

  if (typeof password !== 'string' || password.length < 6) {
    return { error: 'Password must be at least 6 characters long' };
  }

  return {
    value: {
      username: cleanUsername,
      password
    }
  };
};

const validateLoginInput = ({ username, password }) => {
  const cleanUsername = normalizeRequiredString(username);

  if (!cleanUsername || !password) {
    return { error: 'Username and password are required' };
  }

  return {
    value: {
      username: cleanUsername,
      password
    }
  };
};

const validateEventInput = ({ title, date, location, description, budget, event_type, guest_count, notes }) => {
  const cleanTitle = normalizeRequiredString(title);
  const cleanLocation = normalizeOptionalString(location, 120);
  const cleanDescription = normalizeOptionalString(description, 1000);
  const cleanBudget = toSafeNumber(budget, 0);
  const cleanEventType = normalizeRequiredString(event_type || 'Other');
  const cleanGuestCount = toSafeNumber(guest_count, 0);
  const cleanNotes = normalizeOptionalString(notes, 5000);

  if (!cleanTitle) {
    return { error: 'Event title is required' };
  }

  if (cleanTitle.length > 120) {
    return { error: 'Event title must be 120 characters or fewer' };
  }

  if (!isValidDateString(date)) {
    return { error: 'Date must be a valid YYYY-MM-DD value' };
  }

  if (typeof location === 'string' && location.trim().length > 120) {
    return { error: 'Location must be 120 characters or fewer' };
  }

  if (typeof description === 'string' && description.trim().length > 1000) {
    return { error: 'Description must be 1000 characters or fewer' };
  }

  if (!Number.isFinite(cleanBudget) || cleanBudget < 0) {
    return { error: 'Budget must be a valid non-negative number' };
  }

  if (!VALID_EVENT_TYPES.includes(cleanEventType)) {
    return { error: 'Invalid event type' };
  }

  if (!Number.isInteger(cleanGuestCount) || cleanGuestCount < 0) {
    return { error: 'Team members must be a non-negative whole number' };
  }

  if (typeof notes === 'string' && notes.trim().length > 5000) {
    return { error: 'Notes must be 5000 characters or fewer' };
  }

  return {
    value: {
      title: cleanTitle,
      date: date ? date.trim() : null,
      location: cleanLocation,
      description: cleanDescription,
      budget: cleanBudget,
      event_type: cleanEventType,
      guest_count: cleanGuestCount,
      notes: cleanNotes
    }
  };
};

const validateTaskInput = ({
  title,
  description,
  status,
  priority,
  daily_focus,
  assignee,
  dueDate,
  task_dates,
  cost,
  position
}) => {
  const cleanTitle = normalizeRequiredString(title);
  const cleanDescription = normalizeOptionalString(description, 1000);
  const cleanAssignee = normalizeOptionalString(assignee, 120);
  const cleanStatus = normalizeRequiredString(status || 'To Do');
  const cleanPriority = normalizeRequiredString(priority || 'Medium Priority');
  const cleanCost = toSafeNumber(cost, 0);
  const cleanPosition = toSafeNumber(position, 0);
  const cleanTaskDates = normalizeTaskDates(task_dates);

  let cleanDailyFocus = false;
  if (
    daily_focus === true ||
    daily_focus === 1 ||
    daily_focus === '1' ||
    daily_focus === 'true'
  ) {
    cleanDailyFocus = true;
  }

  if (!cleanTitle) {
    return { error: 'Task title is required' };
  }

  if (cleanTitle.length > 120) {
    return { error: 'Task title must be 120 characters or fewer' };
  }

  if (typeof description === 'string' && description.trim().length > 1000) {
    return { error: 'Description must be 1000 characters or fewer' };
  }

  if (!VALID_TASK_STATUSES.includes(cleanStatus)) {
    return { error: 'Invalid task status' };
  }

  if (!VALID_PRIORITIES.includes(cleanPriority)) {
    return { error: 'Invalid task priority' };
  }

  if (!isValidDateString(dueDate)) {
    return { error: 'Due date must be a valid YYYY-MM-DD value' };
  }

  for (const taskDate of cleanTaskDates) {
    if (!isValidDateString(taskDate)) {
      return { error: 'Task days must use YYYY-MM-DD values' };
    }
  }

  if (!Number.isFinite(cleanCost) || cleanCost < 0) {
    return { error: 'Cost must be a valid non-negative number' };
  }

  if (!Number.isInteger(cleanPosition) || cleanPosition < 0) {
    return { error: 'Position must be a non-negative integer' };
  }

  return {
    value: {
      title: cleanTitle,
      description: cleanDescription,
      status: cleanStatus,
      priority: cleanPriority,
      daily_focus: cleanDailyFocus,
      assignee: cleanAssignee,
      dueDate: dueDate ? dueDate.trim() : null,
      task_dates: cleanTaskDates,
      cost: cleanCost,
      position: cleanPosition
    }
  };
};

const validateReorderTasksInput = (tasks) => {
  if (!Array.isArray(tasks) || tasks.length === 0) {
    return { error: 'Tasks must be a non-empty array' };
  }

  for (const task of tasks) {
    if (!task || typeof task !== 'object') {
      return { error: 'Each task item must be an object' };
    }

    const id = Number(task.id);
    const position = Number(task.position);
    const status = typeof task.status === 'string' ? task.status.trim() : '';

    if (!Number.isInteger(id) || id <= 0) {
      return { error: 'Each task must have a valid id' };
    }

    if (!VALID_TASK_STATUSES.includes(status)) {
      return { error: 'Each task must have a valid status' };
    }

    if (!Number.isInteger(position) || position < 0) {
      return { error: 'Each task must have a non-negative integer position' };
    }
  }

  return {
    value: tasks.map((task) => ({
      id: Number(task.id),
      status: task.status.trim(),
      position: Number(task.position)
    }))
  };
};

module.exports = {
  VALID_TASK_STATUSES,
  VALID_PRIORITIES,
  VALID_EVENT_TYPES,
  validateRegisterInput,
  validateLoginInput,
  validateEventInput,
  validateTaskInput,
  validateReorderTasksInput
};
