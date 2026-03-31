import { ref } from 'vue';
import { mockEvents, mockTasks } from './data/mockData.js';

export const globalEvents = ref([...mockEvents]);


const initialTasks = mockTasks.map(t => ({ ...t, eventId: 'ev1' }));
export const globalTasks = ref(initialTasks);