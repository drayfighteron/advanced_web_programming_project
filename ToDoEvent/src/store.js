import { ref } from 'vue';
import { mockEvents, mockTasks } from './data/mockData.js';

export const globalEvents = ref([...mockEvents]);

// Give the mock tasks a default eventId ('ev1') so they show up on the first event.
// New tasks will automatically get the ID of the event they are created in!
const initialTasks = mockTasks.map(t => ({ ...t, eventId: 'ev1' }));
export const globalTasks = ref(initialTasks);