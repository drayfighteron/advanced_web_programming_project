const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_LABELS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function parseEventDate(value) {
    if (!value) return null;

    if (value instanceof Date && !Number.isNaN(value.getTime())) {
        return new Date(value.getFullYear(), value.getMonth(), value.getDate());
    }

    if (typeof value === 'string') {
        const trimmed = value.trim();
        if (!trimmed) return null;

        const datePart = trimmed.split('T')[0];
        const isoMatch = datePart.match(/^(\d{4})-(\d{2})-(\d{2})$/);

        if (isoMatch) {
            const [, year, month, day] = isoMatch;
            return new Date(Number(year), Number(month) - 1, Number(day));
        }
    }

    return null;
}

export function formatEventDate(value, fallback = 'No date set') {
  const date = parseEventDate(value);
  if (!date) return fallback;

  return new Intl.DateTimeFormat('en-CA', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

export function toDateInputValue(value) {
  const date = parseEventDate(value);
  if (!date) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function startOfMonth(value = new Date()) {
  const date = parseEventDate(value) || new Date();
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function buildCalendarDays(monthDate, events = []) {
  const currentMonth = startOfMonth(monthDate);
  const firstDayOfMonth = currentMonth.getDay();
  const firstGridDay = new Date(currentMonth);
  firstGridDay.setDate(currentMonth.getDate() - firstDayOfMonth);

  const eventBuckets = new Map();
  events.forEach((event) => {
    const parsedDate = parseEventDate(event.date);
    if (!parsedDate) return;
    const key = toDateInputValue(parsedDate);
    if (!eventBuckets.has(key)) eventBuckets.set(key, []);
    eventBuckets.get(key).push(event);
  });

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(firstGridDay);
    date.setDate(firstGridDay.getDate() + index);
    const key = toDateInputValue(date);

    return {
      key,
      date,
      dayNumber: date.getDate(),
      isCurrentMonth: date.getMonth() === currentMonth.getMonth(),
      isToday: isSameDay(date, new Date()),
      events: eventBuckets.get(key) || []
    };
  });
}

export function isSameDay(left, right) {
  return left.getFullYear() === right.getFullYear()
    && left.getMonth() === right.getMonth()
    && left.getDate() === right.getDate();
}

export function addMonths(value, amount) {
  const monthDate = startOfMonth(value);
  return new Date(monthDate.getFullYear(), monthDate.getMonth() + amount, 1);
}

export function formatMonthYear(value) {
  const date = startOfMonth(value);
  return `${MONTH_LABELS[date.getMonth()]} ${date.getFullYear()}`;
}

export { WEEKDAY_LABELS };
