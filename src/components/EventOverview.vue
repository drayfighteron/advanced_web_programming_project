<template>
  <div class="min-h-screen bg-[#F5F0E8] font-sans flex flex-col">
    <header class="bg-white border-b border-[#e5e0d8] px-8 py-4 flex justify-between items-center z-10 shrink-0">
      <div>
        <LogoMark variant="header" />
        <p class="text-[13px] text-[#9ca3af] mt-1">{{ eventCounterLabel }}</p>
      </div>
      <div class="flex items-center gap-4">
        <div class="relative">
          <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af] text-[13px]"></i>
          <input v-model="searchQuery" type="text" placeholder="Search events..." class="pl-10 pr-4 py-2.5 rounded-xl border border-[#e5e0d8] bg-[#F5F0E8] text-[13px] focus:outline-none focus:border-[#D4862A] w-[250px] transition-colors" />
        </div>
        <button @click="openAddModal" class="bg-[#D4862A] hover:bg-[#b57121] text-white px-5 py-2.5 rounded-xl text-[13px] font-bold shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2">
          <i class="fas fa-plus"></i> Add Event
        </button>
        <button @click="$emit('openProfile')" class="w-10 h-10 bg-[#F5F0E8] text-[#9ca3af] hover:text-[#1C2340] rounded-full flex items-center justify-center transition-all border border-[#e5e0d8]" title="Profile">
          <i class="fas fa-user text-[12px]"></i>
        </button>
      </div>
    </header>

    <main class="flex-1 p-8 pb-32">
      <div class="max-w-[1500px] mx-auto grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] gap-8 items-start">
        <section class="space-y-8 min-w-0">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="bg-white p-5 rounded-2xl border border-[#e5e0d8] shadow-sm flex flex-col justify-center">
              <span class="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Active Events</span>
              <span class="text-2xl font-bold text-[#1C2340]">{{ activeEvents.length }}</span>
            </div>
            <div class="bg-white p-5 rounded-2xl border border-[#e5e0d8] shadow-sm flex flex-col justify-center">
              <span class="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Past Events</span>
              <span class="text-2xl font-bold text-[#1C2340]">{{ pastEvents.length }}</span>
            </div>
            <div class="bg-white p-5 rounded-2xl border border-[#e5e0d8] shadow-sm flex flex-col justify-center">
              <span class="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Tasks In Progress</span>
              <span class="text-2xl font-bold text-[#1C2340]">{{ totalInProgress }}</span>
            </div>
            <div class="bg-white p-5 rounded-2xl border border-[#e5e0d8] shadow-sm flex flex-col justify-center">
              <span class="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Tasks Completed</span>
              <span class="text-2xl font-bold text-[#1C2340]">{{ totalCompletedTasks }} / {{ totalTasks }}</span>
            </div>
          </div>

          <div class="bg-white rounded-2xl border border-[#e5e0d8] shadow-sm p-3 flex flex-wrap gap-2 items-center">
            <button
              v-for="filter in eventFilters"
              :key="filter.value"
              type="button"
              @click="eventFilter = filter.value"
              class="px-4 py-2 rounded-xl text-[12px] font-bold transition-colors flex items-center gap-2"
              :class="eventFilter === filter.value ? 'bg-[#1C2340] text-white shadow-sm' : 'bg-[#F5F0E8] text-[#6b7280] hover:text-[#1C2340]'"
            >
              {{ filter.label }}
              <span class="text-[10px] rounded-full px-2 py-0.5" :class="eventFilter === filter.value ? 'bg-white/15 text-white' : 'bg-white text-[#9ca3af]'">{{ filter.count }}</span>
            </button>
          </div>

          <div v-if="filteredEvents.length > 0" class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
            <div v-for="event in filteredEvents" :key="event.id" :class="['relative bg-white rounded-2xl border border-[#e5e0d8] shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col group', isPastEvent(event) ? 'opacity-80' : '']">
              <div class="h-1.5 w-full" :style="{ backgroundColor: event.color || '#D4862A' }"></div>

              <div class="p-6 flex-1 flex flex-col mt-2">
                <div class="flex items-start justify-between gap-3 mb-3">
                  <h3 class="text-[16px] font-bold text-[#1C2340] pr-2">{{ event.title }}</h3>
                  <span
                    class="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border shrink-0"
                    :class="isPastEvent(event) ? 'bg-[#F5F0E8] border-[#e5e0d8] text-[#6b7280]' : 'bg-[#F4FBF6] border-emerald-100 text-emerald-600'"
                  >
                    {{ isPastEvent(event) ? 'Past / Inactive' : 'Active' }}
                  </span>
                </div>
                <div class="flex flex-col gap-1.5 mb-4">
                  <span class="text-[12px] text-[#6b7280] flex items-center gap-2"><i class="far fa-calendar text-[#9ca3af] w-3"></i> {{ formatEventDate(event.date) }}</span>
                  <span class="text-[12px] text-[#6b7280] flex items-center gap-2"><i class="fas fa-map-marker-alt text-[#9ca3af] w-3"></i> {{ event.location }}</span>
                  <span class="text-[12px] text-[#6b7280] flex items-center gap-2"><i class="fas fa-tag text-[#9ca3af] w-3"></i> {{ event.event_type || 'Other' }}</span>
                  <span class="text-[12px] text-[#6b7280] flex items-center gap-2"><i class="fas fa-users text-[#9ca3af] w-3"></i> {{ Number(event.guest_count || 0).toLocaleString() }} members</span>
                </div>
                <p class="text-[12px] text-[#9ca3af] line-clamp-2 mb-6">{{ event.description }}</p>

                <div class="mt-auto pt-4 border-t border-[#f3f0eb] flex justify-between items-end">
                  <div>
                    <span class="block text-[10px] text-[#9ca3af] mb-0.5">Budget</span>
                    <span class="text-[14px] font-bold text-[#1C2340]">${{ event.budget?.toLocaleString() || 0 }}</span>
                  </div>
                </div>

                <div class="flex gap-3 mt-5">
                  <button @click.stop="deleteEvent(event.id)" class="w-12 py-2.5 bg-[#F5F0E8] hover:bg-red-100 text-red-400 hover:text-red-600 rounded-xl flex items-center justify-center transition-colors shadow-sm" title="Delete Event">
                    <i class="fas fa-trash-alt text-[12px]"></i>
                  </button>
                  <button @click.stop="openEditModal(event)" class="w-12 py-2.5 bg-[#F5F0E8] hover:bg-[#e5e0d8] text-[#D4862A] rounded-xl flex items-center justify-center transition-colors shadow-sm" title="Edit Event Details">
                    <i class="fas fa-pencil-alt text-[12px]"></i>
                  </button>
                  <button
                    @click="$emit('selectEvent', event)"
                    class="flex-1 py-2.5 text-white text-[12px] font-bold rounded-xl transition-colors shadow-sm"
                    :class="isPastEvent(event) ? 'bg-[#6b7280] hover:bg-[#4b5563]' : 'bg-[#1C2340] hover:bg-[#2E3A5C]'"
                  >
                    {{ isPastEvent(event) ? 'View Inactive Event' : '✓ Manage Tasks' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-24 text-[#9ca3af] bg-white rounded-2xl border border-[#e5e0d8] shadow-sm">
            <p class="text-5xl mb-4">📅</p>
            <p class="text-[15px] font-bold text-[#1C2340] mb-1">{{ emptyEventsTitle }}</p>
            <p class="text-[13px]">{{ emptyEventsMessage }}</p>
          </div>
        </section>

        <aside class="space-y-6 xl:sticky xl:top-8 self-start">
          <div class="bg-white rounded-2xl border border-[#e5e0d8] shadow-sm overflow-hidden">
            <div class="h-1.5 w-full bg-[#D4862A]"></div>
            <div class="p-6">
              <div class="mb-5">
                <h2 class="text-[16px] font-bold text-[#1C2340]">Daily Tasks</h2>
                <p class="text-[12px] text-[#9ca3af] mt-1">View today or any selected planning day.</p>
              </div>

              <div class="flex items-center gap-3 mb-5">
                <input v-model="selectedTaskDate" type="date" class="flex-1 border border-[#e5e0d8] rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:border-[#D4862A] bg-[#F5F0E8]" />
                <button @click="selectedTaskDate = todayValue" class="px-4 py-2 rounded-xl bg-[#1C2340] text-white text-[12px] font-bold hover:bg-[#2E3A5C] transition-colors">Today</button>
              </div>

              <div v-if="dailyTasks.length" class="space-y-3 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
                <div v-for="task in dailyTasks" :key="task.id" class="bg-[#F5F0E8] border border-[#e5e0d8] rounded-2xl p-4 hover:shadow-md transition-all">
                  <div class="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 class="text-[13px] font-bold text-[#1C2340] leading-snug">{{ task.title }}</h3>
                      <p class="text-[11px] text-[#9ca3af] mt-1">{{ task.event_title || 'Event item' }}</p>
                    </div>
                    <span class="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-white border border-[#e5e0d8] text-[#D4862A] shrink-0">{{ task.status }}</span>
                  </div>
                  <p v-if="task.description" class="text-[11px] text-[#9ca3af] line-clamp-2 mb-3">{{ task.description }}</p>
                  <div class="flex items-center justify-between pt-3 border-t border-[#e5e0d8]">
                    <span class="text-[10px] text-[#6b7280]"><i class="far fa-calendar text-[#9ca3af] mr-1"></i>{{ formatEventDate(selectedTaskDate) }}</span>
                    <button @click="openTaskEvent(task)" class="text-[11px] font-bold text-[#D4862A] hover:text-[#b57121] transition-colors">Open Event</button>
                  </div>
                </div>
              </div>

              <div v-else class="text-center py-8 text-[#9ca3af] bg-[#F5F0E8] rounded-2xl border border-[#e5e0d8]">
                <p class="text-3xl mb-2">☀️</p>
                <p class="text-[13px] font-bold text-[#1C2340] mb-1">No tasks for this day</p>
                <p class="text-[12px]">Add day assignments from a task form.</p>
              </div>
            </div>
          </div>

          <MiniCalendar :events="store.events" @openCalendar="$emit('openCalendar')" />
        </aside>
      </div>
    </main>

    <nav class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/75 backdrop-blur-md border border-white/70 rounded-full px-6 py-3 flex items-center gap-6 shadow-xl z-50 text-[#1C2340]">
      <LogoMark variant="nav" class="mr-1" />
      <button class="w-10 h-10 bg-[#D4862A] text-white rounded-full flex items-center justify-center shadow-lg -translate-y-1 transition-all" title="Events"><i class="fas fa-layer-group"></i></button>
      <button @click="$emit('openCalendar')" class="w-10 h-10 bg-[#F5F0E8]/80 text-[#9ca3af] hover:text-[#1C2340] rounded-full flex items-center justify-center transition-colors" title="Open Calendar"><i class="far fa-calendar-alt"></i></button>
    </nav>

    <div v-if="isModalOpen" class="fixed inset-0 bg-[#1C2340]/50 flex items-center justify-center z-[100] px-4">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md border border-[#e5e0d8] shadow-2xl">
        <h2 class="text-xl font-bold text-[#1C2340] mb-4">{{ isEditing ? 'Edit Event' : 'Add New Event' }}</h2>
        <div class="space-y-4">
          <p v-if="formError" class="text-red-500 text-sm">{{ formError }}</p>
          <div>
            <label class="block text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Title</label>
            <input v-model="currentEvent.title" type="text" :class="formErrors.title ? 'w-full border border-red-400 rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:border-red-500' : 'w-full border border-[#e5e0d8] rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:border-[#D4862A]'" placeholder="Event Title" @input="formErrors.title = ''" />
          <p v-if="formErrors.title" class="text-red-500 text-[12px] mt-1">{{ formErrors.title }}</p>
          </div>
          <div>
            <label class="block text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Description</label>
            <textarea v-model="currentEvent.description" rows="2" :class="formErrors.description ? 'w-full border border-red-400 rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:border-red-500' : 'w-full border border-[#e5e0d8] rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:border-[#D4862A]'" placeholder="Short description of this event..." @input="formErrors.description = ''"></textarea>
            <p v-if="formErrors.description" class="text-red-500 text-[12px] mt-1">{{ formErrors.description }}</p>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Date</label>
              <input v-model="currentEvent.date" type="date" :class="formErrors.date ? 'w-full border border-red-400 rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:border-red-500' : 'w-full border border-[#e5e0d8] rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:border-[#D4862A]'" @input="formErrors.date = ''" />
              <p v-if="formErrors.date" class="text-red-500 text-[12px] mt-1">{{ formErrors.date }}</p>
            </div>
            <div>
              <label class="block text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Budget ($)</label>
              <input v-model.number="currentEvent.budget" type="number" :class="formErrors.budget ? 'w-full border border-red-400 rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:border-red-500' : 'w-full border border-[#e5e0d8] rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:border-[#D4862A]'" placeholder="5000" @input="formErrors.budget = ''" />
            <p v-if="formErrors.budget" class="text-red-500 text-[12px] mt-1">{{ formErrors.budget }}</p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Category</label>
              <select v-model="currentEvent.event_type" class="w-full border border-[#e5e0d8] rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:border-[#D4862A] bg-white">
                <option>School</option>
                <option>Personal</option>
                <option>Work</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label class="block text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Team Members</label>
              <input v-model.number="currentEvent.guest_count" min="0" type="number" :class="formErrors.guest_count ? 'w-full border border-red-400 rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:border-red-500' : 'w-full border border-[#e5e0d8] rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:border-[#D4862A]'" placeholder="120" @input="formErrors.guest_count = ''" />
            <p v-if="formErrors.guest_count" class="text-red-500 text-[12px] mt-1">{{ formErrors.guest_count }}</p>
            </div>
          </div>
          <div>
            <label class="block text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Location / Context</label>
            <input v-model="currentEvent.location" type="text" :class="formErrors.location ? 'w-full border border-red-400 rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:border-red-500' : 'w-full border border-[#e5e0d8] rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:border-[#D4862A]'" placeholder="Location / Context" @input="formErrors.location = ''" />
          <p v-if="formErrors.location" class="text-red-500 text-[12px] mt-1">{{ formErrors.location }}</p>
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button @click="isModalOpen = false" class="px-4 py-2 text-[12px] font-semibold text-[#9ca3af] hover:text-[#1C2340] transition-colors">Cancel</button>
          <button @click="saveEvent" class="bg-[#D4862A] hover:bg-[#b57121] text-white px-4 py-2 rounded-xl text-[12px] font-bold transition-colors shadow-lg">Save Event</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { store } from '../store.js';
import { formatEventDate, toDateInputValue } from '../utils/date.js';
import MiniCalendar from './MiniCalendar.vue';
import LogoMark from './LogoMark.vue';

const emit = defineEmits(['selectEvent', 'openCalendar', 'openProfile']);

const todayValue = toDateInputValue(new Date());
const selectedTaskDate = ref(todayValue);

onMounted(async () => {
  try {
    if (store.user) {
      await store.fetchEvents();
      await store.fetchAllTasks();
    }
  } catch (error) {
    console.error('Failed to load events:', error);
  }
});

const isModalOpen = ref(false);
const isEditing = ref(false);
const searchQuery = ref('');
const formError = ref('');
const formErrors = ref({});

const emptyEvent = { id: null, title: '', date: '', budget: null, location: '', description: '', event_type: 'Other', guest_count: 0, notes: '' };
const currentEvent = ref({ ...emptyEvent });

const eventFilter = ref('active');

function isPastEvent(event) {
  const dateKey = toDateInputValue(event?.date);
  return Boolean(dateKey && dateKey < todayValue);
}

const activeEvents = computed(() => store.events.filter((event) => !isPastEvent(event)));
const pastEvents = computed(() => store.events.filter((event) => isPastEvent(event)));

const eventFilters = computed(() => [
  { value: 'active', label: 'Active / Upcoming', count: activeEvents.value.length },
  { value: 'past', label: 'Past / Inactive', count: pastEvents.value.length },
  { value: 'all', label: 'All Events', count: store.events.length }
]);

const eventsForSelectedFilter = computed(() => {
  if (eventFilter.value === 'past') return pastEvents.value;
  if (eventFilter.value === 'all') return store.events;
  return activeEvents.value;
});

const filteredEvents = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  const baseEvents = eventsForSelectedFilter.value;
  if (!query) return baseEvents;

  return baseEvents.filter(event => {
    const matchTitle = event.title?.toLowerCase().includes(query) || false;
    const matchLocation = event.location?.toLowerCase().includes(query) || false;
    const matchDesc = event.description?.toLowerCase().includes(query) || false;
    const matchType = event.event_type?.toLowerCase().includes(query) || false;
    return matchTitle || matchLocation || matchDesc || matchType;
  });
});

const eventCounterLabel = computed(() => {
  return `${filteredEvents.value.length} shown • ${activeEvents.value.length} active • ${pastEvents.value.length} past`;
});

const totalInProgress = computed(() => activeEvents.value.reduce((sum, e) => sum + (Number(e.in_progress_tasks) || 0), 0));
const totalCompletedTasks = computed(() => store.events.reduce((sum, e) => sum + (Number(e.completed_tasks) || 0), 0));
const totalTasks = computed(() => store.events.reduce((sum, e) => sum + (Number(e.total_tasks) || 0), 0));

const emptyEventsTitle = computed(() => {
  if (eventFilter.value === 'past') return 'No past events yet!';
  if (eventFilter.value === 'all') return 'No events yet!';
  return 'No active events yet!';
});

const emptyEventsMessage = computed(() => {
  if (searchQuery.value.trim()) return 'Try another search term or switch the event filter.';
  if (eventFilter.value === 'past') return 'Events with dates before today will appear here automatically.';
  return 'Click the orange "Add Event" button to create your next event.';
});

const dailyTasks = computed(() => {
  if (!selectedTaskDate.value) return [];
  return store.allTasks.filter((task) => taskDateKeys(task).includes(selectedTaskDate.value));
});

function taskDateKeys(task) {
  const dates = Array.isArray(task.task_dates) ? task.task_dates : [];
  return dates.length ? dates : (task.dueDate ? [task.dueDate] : []);
}

function openTaskEvent(task) {
  const event = store.events.find((item) => item.id === task.event_id);
  if (event) {
    emit('selectEvent', event);
  }
}

function openAddModal() {
  isEditing.value = false;
  currentEvent.value = { ...emptyEvent };
  formError.value = '';
  formErrors.value = {};
  isModalOpen.value = true;
}

function openEditModal(event) {
  isEditing.value = true;
  currentEvent.value = { ...emptyEvent, ...event, date: toDateInputValue(event.date) };
  formError.value = '';
  formErrors.value = {};
  isModalOpen.value = true;
}

function validateEventForm(payload) {
  const errors = {};

  if (!payload.title) {
    errors.title = 'Event/project title is required.';
  } else if (payload.title.length > 120) {
    errors.title = 'Title must be 120 characters or fewer.';
  }

  if (payload.date && !/^\d{4}-\d{2}-\d{2}$/.test(payload.date)) {
    errors.date = 'Date must use the YYYY-MM-DD format.';
  }

  if (payload.location && payload.location.length > 120) {
    errors.location = 'Location / context must be 120 characters or fewer.';
  }

  if (payload.description && payload.description.length > 1000) {
    errors.description = 'Description must be 1000 characters or fewer.';
  }

  if (!Number.isFinite(payload.budget) || payload.budget < 0) {
    errors.budget = 'Budget must be a valid non-negative number.';
  }

  if (!Number.isInteger(payload.guest_count) || payload.guest_count < 0) {
    errors.guest_count = 'Team members must be a non-negative whole number.';
  }

  formErrors.value = errors;
  return Object.keys(errors).length === 0;
}

function readableEventError(err) {
  return err.response?.data?.error || 'Failed to save event. Please check the form and try again.';
}

async function saveEvent() {
  formError.value = '';
  formErrors.value = {};

  const payload = {
    title: currentEvent.value.title?.trim() || '',
    date: currentEvent.value.date || null,
    location: currentEvent.value.location?.trim() || '',
    description: currentEvent.value.description?.trim() || '',
    budget: Number(currentEvent.value.budget || 0),
    event_type: currentEvent.value.event_type || 'Other',
    guest_count: Number(currentEvent.value.guest_count || 0),
    notes: currentEvent.value.notes || ''
  };

  if (!validateEventForm(payload)) {
    formError.value = 'Please correct the highlighted fields.';
    return;
  }

  try {
    if (isEditing.value) {
      await store.updateEvent(currentEvent.value.id, payload);
    } else {
      await store.createEvent(payload);
    }
    isModalOpen.value = false;
  } catch (err) {
    console.error('Failed to save event:', err);
    formError.value = readableEventError(err);
  }
}

async function deleteEvent(id) {
  if (confirm('Are you sure you want to delete this event and all its tasks?')) {
    try {
      await store.deleteEvent(id);
    } catch (err) {
      console.error('Failed to delete event:', err);
      alert(err.response?.data?.error || 'Failed to delete event.');
    }
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #9ca3af; }
</style>
