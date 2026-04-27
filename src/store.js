import { reactive } from 'vue';
import UserDataService from './services/UserDataService';
import EventDataService from './services/EventDataService';
import TaskDataService from './services/TaskDataService';

const normalizeText = (value) => (typeof value === 'string' ? value.trim() : '');
const normalizeOptionalText = (value) => {
  const trimmed = normalizeText(value);
  return trimmed || null;
};
const normalizeNumber = (value, fallback = 0) => {
  if (value === '' || value === null || value === undefined) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : NaN;
};
const normalizeInteger = (value, fallback = 0) => {
  const parsed = normalizeNumber(value, fallback);
  return Number.isFinite(parsed) ? Math.max(0, Math.floor(parsed)) : fallback;
};
const isValidDateString = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value || '');
const normalizeTaskDates = (value) => {
  let items = [];
  if (Array.isArray(value)) {
    items = value;
  } else if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed);
      items = Array.isArray(parsed) ? parsed : trimmed.split(',');
    } catch {
      items = trimmed.split(',');
    }
  }
  return [...new Set(items.map((item) => normalizeText(item)).filter((item) => isValidDateString(item)))];
};
const normalizeEventResponse = (event) => ({
  ...event,
  event_type: event?.event_type || 'Other',
  guest_count: Number(event?.guest_count || 0),
  notes: event?.notes || ''
});
const normalizeTaskResponse = (task) => ({
  ...task,
  task_dates: normalizeTaskDates(task?.task_dates)
});

export const store = reactive({
  user: JSON.parse(localStorage.getItem('myevents_user')) || null,
  events: [],
  currentEventTasks: [],
  allTasks: [],
  currentEventId: null,
  isLoading: false,

  get totalTaskCost() {
    return this.currentEventTasks.reduce((sum, task) => sum + Number(task.cost || 0), 0);
  },

  setUser(user) {
    this.user = user;
    if (user) localStorage.setItem('myevents_user', JSON.stringify(user));
    else localStorage.removeItem('myevents_user');
  },

  clearSession() {
    this.setUser(null);
    this.events = [];
    this.currentEventTasks = [];
    this.allTasks = [];
    this.currentEventId = null;
  },

  async checkSession() {
    try {
      const res = await UserDataService.me();
      this.setUser(res.data.user);
      await this.fetchEvents();
      await this.fetchAllTasks();
      return true;
    } catch {
      this.clearSession();
      return false;
    }
  },

  async login(username, password) {
    try {
      const res = await UserDataService.login({ username: normalizeText(username), password: password || '' });
      this.setUser(res.data.user);
      await this.fetchEvents();
      await this.fetchAllTasks();
      return true;
    } catch (err) {
      console.error('Login failed:', err.response?.data?.error || err.message);
      throw err;
    }
  },

  async register(username, password) {
    try {
      const res = await UserDataService.register({ username: normalizeText(username), password: password || '' });
      this.setUser(res.data.user);
      await this.fetchEvents();
      await this.fetchAllTasks();
      return true;
    } catch (err) {
      console.error('Registration failed:', err.response?.data?.error || err.message);
      throw err;
    }
  },

  async logout() {
    try {
      await UserDataService.logout();
    } catch {
      // Clear local state even if the cookie session is already expired.
    } finally {
      this.clearSession();
    }
  },

  async fetchEvents(status = 'all') {
    if (!this.user) return [];
    this.isLoading = true;
    try {
      const res = await EventDataService.getAll(status);
      this.events = res.data.map(normalizeEventResponse);
      return this.events;
    } catch (err) {
      console.error('Failed to fetch events:', err.response?.data || err.message);
      throw err;
    } finally {
      this.isLoading = false;
    }
  },

  async createEvent(eventData) {
    try {
      const payload = {
        title: normalizeText(eventData.title),
        date: eventData.date || null,
        location: normalizeOptionalText(eventData.location),
        description: normalizeOptionalText(eventData.description),
        budget: normalizeNumber(eventData.budget, 0),
        event_type: normalizeText(eventData.event_type) || 'Other',
        guest_count: normalizeInteger(eventData.guest_count, 0),
        notes: normalizeOptionalText(eventData.notes)
      };
      const res = await EventDataService.create(payload);
      const createdEvent = normalizeEventResponse(res.data);
      this.events.push(createdEvent);
      return createdEvent;
    } catch (err) {
      console.error('Failed to create event:', err.response?.data || err.message);
      throw err;
    }
  },

  async updateEvent(id, eventData) {
    try {
      const payload = {
        title: normalizeText(eventData.title),
        date: eventData.date || null,
        location: normalizeOptionalText(eventData.location),
        description: normalizeOptionalText(eventData.description),
        budget: normalizeNumber(eventData.budget, 0),
        event_type: normalizeText(eventData.event_type) || 'Other',
        guest_count: normalizeInteger(eventData.guest_count, 0),
        notes: normalizeOptionalText(eventData.notes)
      };
      const res = await EventDataService.update(id, payload);
      const updatedEvent = normalizeEventResponse(res.data);
      const index = this.events.findIndex((event) => Number(event.id) === Number(id));
      if (index !== -1) this.events[index] = { ...this.events[index], ...updatedEvent };
      return updatedEvent;
    } catch (err) {
      console.error('Failed to update event:', err.response?.data || err.message);
      throw err;
    }
  },

  async deleteEvent(id) {
    try {
      await EventDataService.delete(id);
      this.events = this.events.filter((event) => Number(event.id) !== Number(id));
      this.allTasks = this.allTasks.filter((task) => Number(task.event_id) !== Number(id));
      if (Number(this.currentEventId) === Number(id)) {
        this.currentEventTasks = [];
        this.currentEventId = null;
      }
    } catch (err) {
      console.error('Failed to delete event:', err.response?.data || err.message);
      throw err;
    }
  },

  async fetchAllTasks() {
    if (!this.user) return [];
    try {
      const res = await TaskDataService.getAll();
      this.allTasks = res.data.map(normalizeTaskResponse);
      return this.allTasks;
    } catch (err) {
      console.error('Failed to fetch daily tasks:', err.response?.data || err.message);
      throw err;
    }
  },

  async fetchTasks(eventId) {
    this.currentEventId = eventId;
    this.isLoading = true;
    try {
      const res = await TaskDataService.getByEvent(eventId);
      this.currentEventTasks = res.data.map(normalizeTaskResponse);
      return this.currentEventTasks;
    } catch (err) {
      console.error('Failed to fetch tasks:', err.response?.data || err.message);
      throw err;
    } finally {
      this.isLoading = false;
    }
  },

  async createTask(eventId, taskData) {
    try {
      const payload = {
        title: normalizeText(taskData.title),
        description: normalizeOptionalText(taskData.description),
        status: taskData.status || 'To Do',
        priority: taskData.priority || 'Medium Priority',
        daily_focus: !!taskData.daily_focus,
        assignee: normalizeOptionalText(taskData.assignee),
        dueDate: taskData.dueDate || null,
        task_dates: normalizeTaskDates(taskData.task_dates),
        cost: normalizeNumber(taskData.cost, 0),
        position: Number.isInteger(Number(taskData.position)) && Number(taskData.position) >= 0 ? Number(taskData.position) : 0
      };
      const res = await TaskDataService.create(eventId, payload);
      const createdTask = normalizeTaskResponse(res.data);
      this.currentEventTasks.push(createdTask);
      await this.fetchEvents();
      await this.fetchAllTasks();
      return createdTask;
    } catch (err) {
      console.error('Failed to create task:', err.response?.data || err.message);
      throw err;
    }
  },

  async updateTask(taskId, taskData) {
    try {
      const payload = {
        title: normalizeText(taskData.title),
        description: normalizeOptionalText(taskData.description),
        status: taskData.status || 'To Do',
        priority: taskData.priority || 'Medium Priority',
        daily_focus: !!taskData.daily_focus,
        assignee: normalizeOptionalText(taskData.assignee),
        dueDate: taskData.dueDate || null,
        task_dates: normalizeTaskDates(taskData.task_dates),
        cost: normalizeNumber(taskData.cost, 0),
        position: Number.isInteger(Number(taskData.position)) && Number(taskData.position) >= 0 ? Number(taskData.position) : 0
      };
      const res = await TaskDataService.update(taskId, payload);
      const updatedTask = normalizeTaskResponse(res.data);
      const index = this.currentEventTasks.findIndex((task) => Number(task.id) === Number(taskId));
      if (index !== -1) this.currentEventTasks[index] = { ...this.currentEventTasks[index], ...updatedTask };
      const allIndex = this.allTasks.findIndex((task) => Number(task.id) === Number(taskId));
      if (allIndex !== -1) this.allTasks[allIndex] = { ...this.allTasks[allIndex], ...updatedTask };
      await this.fetchEvents();
      await this.fetchAllTasks();
      return updatedTask;
    } catch (err) {
      console.error('Failed to update task:', err.response?.data || err.message);
      throw err;
    }
  },

  async deleteTask(taskId) {
    try {
      await TaskDataService.delete(taskId);
      this.currentEventTasks = this.currentEventTasks.filter((task) => Number(task.id) !== Number(taskId));
      this.allTasks = this.allTasks.filter((task) => Number(task.id) !== Number(taskId));
      await this.fetchEvents();
      await this.fetchAllTasks();
    } catch (err) {
      console.error('Failed to delete task:', err.response?.data || err.message);
      throw err;
    }
  },

  async saveReorderedTasks(payload) {
    payload.forEach((updatedField) => {
      const task = this.currentEventTasks.find((t) => Number(t.id) === Number(updatedField.id));
      if (task) {
        task.status = updatedField.status;
        task.position = updatedField.position;
      }
    });
    try {
      await TaskDataService.reorder({
        tasks: payload.map((task) => ({ id: Number(task.id), status: task.status, position: Number(task.position) }))
      });
      await this.fetchEvents();
      await this.fetchAllTasks();
    } catch (err) {
      console.error('Failed to save task order:', err.response?.data || err.message);
      if (this.currentEventId) await this.fetchTasks(this.currentEventId);
      throw err;
    }
  }
});
