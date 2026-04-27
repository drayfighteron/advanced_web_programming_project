<template>
  <div class="min-h-screen bg-[#F5F0E8] font-sans flex flex-col">
    <header class="bg-white border-b border-[#e5e0d8] px-8 py-4 flex justify-between items-center z-10 shrink-0">
      <div class="flex items-center gap-4">
        <button @click="$emit('goBack')" class="w-10 h-10 bg-[#F5F0E8] hover:bg-[#e5e0d8] rounded-full text-[#1C2340] transition-colors flex items-center justify-center">
          <i class="fas fa-arrow-left"></i>
        </button>
        <div>
          <div class="flex flex-wrap items-center gap-3">
            <h1 class="text-2xl font-bold text-[#1C2340]">{{ event?.title || 'Select an Event' }}</h1>
            <span
              v-if="event"
              class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border"
              :class="isPastEvent ? 'bg-[#F5F0E8] border-[#e5e0d8] text-[#6b7280]' : 'bg-[#F4FBF6] border-emerald-100 text-emerald-600'"
            >
              {{ isPastEvent ? 'Past / Inactive' : 'Active Event' }}
            </span>
          </div>
          <p class="text-[13px] text-[#9ca3af] mt-0.5">Manage tasks, daily plans, event details, and notes</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <button @click="openTaskModal()" :disabled="!event || isPastEvent" :title="isPastEvent ? 'Past events are inactive. Change the event date to reactivate it.' : 'Add Task'" class="bg-[#D4862A] hover:bg-[#b57121] disabled:opacity-60 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl text-[13px] font-bold shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2">
          <i class="fas fa-plus"></i> Add Task
        </button>
        <button @click="$emit('openProfile')" class="w-10 h-10 bg-[#F5F0E8] text-[#9ca3af] hover:text-[#1C2340] rounded-full flex items-center justify-center transition-all border border-[#e5e0d8]" title="Profile">
          <i class="fas fa-user text-[12px]"></i>
        </button>
      </div>
    </header>

    <main class="flex-1 p-8 pb-32">
      <div v-if="!event" class="max-w-[1200px] mx-auto text-center py-24 text-[#9ca3af]">
        <p class="text-5xl mb-4">🗂️</p>
        <p class="text-[15px] font-bold text-[#1C2340] mb-1">No event selected</p>
        <p class="text-[13px]">Go back to events and choose one first.</p>
      </div>

      <div v-else class="max-w-[1500px] mx-auto grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] gap-8 items-start">
        <section class="space-y-8 min-w-0">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="bg-white p-5 rounded-2xl border border-[#e5e0d8] shadow-sm flex flex-col justify-center">
              <span class="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">To Do</span>
              <span class="text-2xl font-bold text-[#1C2340]">{{ todoTasks.length }}</span>
            </div>
            <div class="bg-white p-5 rounded-2xl border border-[#e5e0d8] shadow-sm flex flex-col justify-center">
              <span class="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Doing</span>
              <span class="text-2xl font-bold text-[#1C2340]">{{ doingTasks.length }}</span>
            </div>
            <div class="bg-white p-5 rounded-2xl border border-[#e5e0d8] shadow-sm flex flex-col justify-center">
              <span class="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Done</span>
              <span class="text-2xl font-bold text-[#1C2340]">{{ doneTasks.length }}</span>
            </div>
            <div class="bg-white p-5 rounded-2xl border border-[#e5e0d8] shadow-sm flex flex-col justify-center">
              <span class="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Completed Cost</span>
              <span class="text-2xl font-bold text-[#1C2340]">${{ totalSpent.toLocaleString() }}</span>
            </div>
          </div>

          <div v-if="isPastEvent" class="rounded-2xl border border-[#e5e0d8] bg-white p-5 text-[13px] text-[#6b7280] shadow-sm flex items-start gap-3">
            <span class="w-8 h-8 rounded-full bg-[#F5F0E8] text-[#D4862A] flex items-center justify-center shrink-0"><i class="fas fa-lock text-[12px]"></i></span>
            <div>
              <p class="font-bold text-[#1C2340] mb-1">This event is inactive because its date has already passed.</p>
              <p>You can still view notes and details. To make it active again, change the event date to today or a future date.</p>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div class="bg-[#F6F8FF] rounded-3xl p-5 border border-[#e5e0d8] min-h-[520px] flex flex-col relative overflow-hidden">
              <div class="absolute inset-x-0 top-0 h-1.5 bg-[#9ca3af]"></div>
              <div class="flex items-center justify-between mb-4 relative z-10">
                <div>
                  <h3 class="text-sm font-bold text-[#1C2340]">To Do</h3>
                  <span class="text-[11px] text-[#9ca3af]">{{ todoTasks.length }} tasks</span>
                </div>
              </div>
              <draggable v-model="todoTasks" :disabled="isPastEvent" group="tasks" item-key="id" class="flex-1 overflow-y-auto space-y-3 pb-4 min-h-[150px] custom-scrollbar pt-[20px]" ghost-class="opacity-40" @change="syncTaskStatuses">
                <template #item="{ element }">
                  <TaskCard :task="element" :readonly="isPastEvent" @edit="openTaskModal(element)" @toggleComplete="handleToggleComplete" />
                </template>
              </draggable>
            </div>

            <div class="bg-[#FFF8F0] rounded-3xl p-5 border border-[#e5e0d8] min-h-[520px] flex flex-col relative overflow-hidden">
              <div class="absolute inset-x-0 top-0 h-1.5 bg-[#D4862A]"></div>
              <div class="flex items-center justify-between mb-4 relative z-10">
                <div>
                  <h3 class="text-sm font-bold text-[#1C2340]">Doing</h3>
                  <span class="text-[11px] text-[#9ca3af]">{{ doingTasks.length }} tasks</span>
                </div>
              </div>
              <draggable v-model="doingTasks" :disabled="isPastEvent" group="tasks" item-key="id" class="flex-1 overflow-y-auto space-y-3 pb-4 min-h-[150px] custom-scrollbar pt-[20px]" ghost-class="opacity-40" @change="syncTaskStatuses">
                <template #item="{ element }">
                  <TaskCard :task="element" :readonly="isPastEvent" @edit="openTaskModal(element)" @toggleComplete="handleToggleComplete" />
                </template>
              </draggable>
            </div>

            <div class="bg-[#F4FBF6] rounded-3xl p-5 border border-[#e5e0d8] min-h-[520px] flex flex-col relative overflow-hidden">
              <div class="absolute inset-x-0 top-0 h-1.5 bg-[#34d399]"></div>
              <div class="flex items-center justify-between mb-4 relative z-10">
                <div>
                  <h3 class="text-sm font-bold text-[#1C2340]">Done</h3>
                  <span class="text-[11px] text-[#9ca3af]">{{ doneTasks.length }} tasks</span>
                </div>
                <span class="text-[11px] font-bold text-[#D4862A] bg-white border border-[#e5e0d8] px-2 py-1 rounded-[10px]">${{ totalSpent.toLocaleString() }} spent</span>
              </div>
              <draggable v-model="doneTasks" :disabled="isPastEvent" group="tasks" item-key="id" class="flex-1 overflow-y-auto space-y-3 pb-4 min-h-[150px] custom-scrollbar pt-[20px]" ghost-class="opacity-40" @change="syncTaskStatuses">
                <template #item="{ element }">
                  <TaskCard :task="element" :readonly="isPastEvent" @edit="openTaskModal(element)" @toggleComplete="handleToggleComplete" />
                </template>
              </draggable>
            </div>
          </div>

          <div class="bg-white rounded-2xl border border-[#e5e0d8] shadow-sm overflow-hidden">
            <div class="h-1.5 w-full" :style="{ backgroundColor: event.color || '#D4862A' }"></div>
            <div class="p-6">
              <div class="flex items-start justify-between gap-6 mb-4">
                <div>
                  <h2 class="text-[16px] font-bold text-[#1C2340]">Event Notes</h2>
                  <p class="text-[12px] text-[#9ca3af] mt-1">Save free-form notes below your To Do, Doing, and Done columns.</p>
                </div>
                <div class="flex items-center gap-3 text-[11px] text-[#6b7280] shrink-0">
                  <span><i class="fas fa-tag text-[#9ca3af] mr-1"></i>{{ event.event_type || 'Other' }}</span>
                  <span><i class="fas fa-users text-[#9ca3af] mr-1"></i>{{ Number(event.guest_count || 0).toLocaleString() }} members</span>
                </div>
              </div>
              <textarea v-model="eventNotes" rows="4" class="w-full border border-[#e5e0d8] rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:border-[#D4862A] bg-[#F5F0E8]" placeholder="Write notes, reminders, or anything important for this event..."></textarea>
              <div class="flex items-center justify-between mt-4">
                <span class="text-[12px]" :class="notesMessageType === 'error' ? 'text-red-500' : 'text-[#9ca3af]'">{{ notesMessage }}</span>
                <button @click="saveEventNotes" class="bg-[#1C2340] hover:bg-[#2E3A5C] text-white px-4 py-2 rounded-xl text-[12px] font-bold transition-colors shadow-sm">Save Notes</button>
              </div>
            </div>
          </div>
        </section>

        <aside class="space-y-6 xl:sticky xl:top-8 self-start">
          <MiniCalendar :events="[event]" @openCalendar="$emit('openCalendar')" />

          <div class="bg-white rounded-2xl border border-[#e5e0d8] shadow-sm overflow-hidden">
            <div class="h-1.5 w-full" :style="{ backgroundColor: event.color || '#D4862A' }"></div>
            <div class="p-5">
              <div class="mb-4">
                <h2 class="text-[16px] font-bold text-[#1C2340]">Event Details</h2>
                <p class="text-[12px] text-[#9ca3af] mt-1">Edit this event from the sidebar.</p>
              </div>

              <div class="space-y-4">
                <p v-if="detailsMessage" class="text-[12px]" :class="detailsMessageType === 'error' ? 'text-red-500' : 'text-[#9ca3af]'">{{ detailsMessage }}</p>

                <div>
                  <label class="block text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Title</label>
                  <input v-model="eventDetails.title" type="text" :class="inputClass(detailsFieldErrors.title)" @input="detailsFieldErrors.title = ''" />
                  <p v-if="detailsFieldErrors.title" class="text-red-500 text-[12px] mt-1">{{ detailsFieldErrors.title }}</p>
                </div>

                <div>
                  <label class="block text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Date</label>
                  <input v-model="eventDetails.date" type="date" :class="inputClass(detailsFieldErrors.date)" @input="detailsFieldErrors.date = ''" />
                  <p v-if="detailsFieldErrors.date" class="text-red-500 text-[12px] mt-1">{{ detailsFieldErrors.date }}</p>
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Type</label>
                    <select v-model="eventDetails.event_type" :class="selectClass(false)">
                      <option>School</option>
                      <option>Personal</option>
                      <option>Work</option>
                      <option>Wedding</option>
                      <option>Birthday</option>
                      <option>Conference</option>
                      <option>Business</option>
                      <option>Dinner</option>
                      <option>Competition</option>
                      <option>Retreat</option>
                      <option>Workshop</option>
                      <option>Festival</option>
                      <option>Gala</option>
                      <option>Sports</option>
                      <option>Exhibition</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Team</label>
                    <input v-model.number="eventDetails.guest_count" min="0" type="number" :class="inputClass(detailsFieldErrors.guest_count)" @input="detailsFieldErrors.guest_count = ''" />
                    <p v-if="detailsFieldErrors.guest_count" class="text-red-500 text-[12px] mt-1">{{ detailsFieldErrors.guest_count }}</p>
                  </div>
                </div>

                <div>
                  <label class="block text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Location / Context</label>
                  <input v-model="eventDetails.location" type="text" :class="inputClass(detailsFieldErrors.location)" @input="detailsFieldErrors.location = ''" />
                  <p v-if="detailsFieldErrors.location" class="text-red-500 text-[12px] mt-1">{{ detailsFieldErrors.location }}</p>
                </div>

                <div>
                  <label class="block text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Budget ($)</label>
                  <input v-model.number="eventDetails.budget" type="number" min="0" :class="inputClass(detailsFieldErrors.budget)" @input="detailsFieldErrors.budget = ''" />
                  <p v-if="detailsFieldErrors.budget" class="text-red-500 text-[12px] mt-1">{{ detailsFieldErrors.budget }}</p>
                </div>

                <div>
                  <label class="block text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Description</label>
                  <textarea v-model="eventDetails.description" rows="3" :class="inputClass(detailsFieldErrors.description)" @input="detailsFieldErrors.description = ''"></textarea>
                  <p v-if="detailsFieldErrors.description" class="text-red-500 text-[12px] mt-1">{{ detailsFieldErrors.description }}</p>
                </div>

                <button @click="saveEventDetails" class="w-full bg-[#1C2340] hover:bg-[#2E3A5C] text-white px-4 py-2.5 rounded-xl text-[12px] font-bold transition-colors shadow-sm">
                  Save Event Details
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>

    <nav class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/75 backdrop-blur-md border border-white/70 rounded-full px-6 py-3 flex items-center gap-6 shadow-xl z-50 text-[#1C2340]">
      <LogoMark variant="nav" class="mr-1" />
      <button @click="$emit('goBack')" class="w-10 h-10 bg-[#F5F0E8]/80 text-[#9ca3af] hover:text-[#1C2340] rounded-full flex items-center justify-center transition-all" title="Events"><i class="fas fa-layer-group"></i></button>
      <button @click="$emit('openCalendar')" class="w-10 h-10 bg-[#F5F0E8]/80 text-[#9ca3af] hover:text-[#1C2340] rounded-full flex items-center justify-center transition-all" title="Open Calendar"><i class="far fa-calendar-alt"></i></button>
    </nav>

    <div v-if="isTaskModalOpen" class="fixed inset-0 bg-[#1C2340]/50 flex items-center justify-center z-50 px-4">
      <div class="bg-white rounded-2xl p-6 w-full max-w-lg border border-[#e5e0d8] shadow-2xl">
        <h2 class="text-xl font-bold text-[#1C2340] mb-4">{{ isEditingTask ? 'Edit Task' : 'Add New Task' }}</h2>
        <div class="space-y-4">
          <p v-if="taskError" class="text-red-500 text-sm">{{ taskError }}</p>
          <div>
            <label class="block text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Title</label>
            <input v-model="currentTask.title" type="text" maxlength="120" :class="inputClass(taskFieldErrors.title)" placeholder="Task Title" @input="taskFieldErrors.title = ''" />
            <p v-if="taskFieldErrors.title" class="text-red-500 text-[12px] mt-1">{{ taskFieldErrors.title }}</p>
          </div>
          <div>
            <label class="block text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Description</label>
            <textarea v-model="currentTask.description" rows="2" maxlength="1000" :class="inputClass(taskFieldErrors.description)" placeholder="Task details..." @input="taskFieldErrors.description = ''"></textarea>
            <p v-if="taskFieldErrors.description" class="text-red-500 text-[12px] mt-1">{{ taskFieldErrors.description }}</p>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Status</label>
              <select v-model="currentTask.status" :class="selectClass(false)">
                <option>To Do</option>
                <option>Doing</option>
                <option>Done</option>
              </select>
            </div>
            <div>
              <label class="block text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Priority</label>
              <select v-model="currentTask.priority" :class="selectClass(false)">
                <option>High Priority</option>
                <option>Medium Priority</option>
                <option>Low Priority</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Due Date</label>
              <input v-model="currentTask.dueDate" type="date" :max="eventDetails.date" :class="inputClass(taskFieldErrors.dueDate)" @input="taskFieldErrors.dueDate = ''" />
              <p v-if="taskFieldErrors.dueDate" class="text-red-500 text-[12px] mt-1">{{ taskFieldErrors.dueDate }}</p>
            </div>
            <div>
              <label class="block text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Cost ($)</label>
              <input v-model.number="currentTask.cost" type="number" min="0" step="0.01" :class="inputClass(taskFieldErrors.cost)" placeholder="0" @input="taskFieldErrors.cost = ''" />
              <p v-if="taskFieldErrors.cost" class="text-red-500 text-[12px] mt-1">{{ taskFieldErrors.cost }}</p>
            </div>
            <div>
              <label class="block text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Assignee</label>
              <input v-model="currentTask.assignee" type="text" maxlength="120" :class="inputClass(taskFieldErrors.assignee)" placeholder="Name" @input="taskFieldErrors.assignee = ''" />
              <p v-if="taskFieldErrors.assignee" class="text-red-500 text-[12px] mt-1">{{ taskFieldErrors.assignee }}</p>
            </div>
          </div>
          <div>
            <label class="block text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Task Days</label>
            <input v-model="taskDatesInput" type="text" :class="inputClass(taskFieldErrors.taskDates)" placeholder="YYYY-MM-DD, YYYY-MM-DD" @input="taskFieldErrors.taskDates = ''" />
            <p v-if="taskFieldErrors.taskDates" class="text-red-500 text-[12px] mt-1">{{ taskFieldErrors.taskDates }}</p>
            <p class="text-[11px] text-[#9ca3af] mt-1">Assign this task to one or more calendar days. Leave blank to use the due date only.</p>
          </div>
        </div>
        <div class="flex justify-between mt-6">
          <button v-if="isEditingTask" @click="deleteTask" class="px-4 py-2 text-[12px] font-semibold text-red-500 hover:text-red-700 transition-colors">
            🗑️ Delete
          </button>
          <div v-else></div>
          <div class="flex gap-3">
            <button @click="closeTaskModal" class="px-4 py-2 text-[12px] font-semibold text-[#9ca3af] hover:text-[#1C2340] transition-colors">Cancel</button>
            <button @click="saveTask" class="bg-[#D4862A] hover:bg-[#b57121] text-white px-4 py-2 rounded-xl text-[12px] font-bold transition-colors shadow-lg">Save Task</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import draggable from 'vuedraggable';
import TaskCard from './TaskCard.vue';
import MiniCalendar from './MiniCalendar.vue';
import LogoMark from './LogoMark.vue';
import { store } from '../store.js';
import { toDateInputValue } from '../utils/date.js';

const emit = defineEmits(['goBack', 'openCalendar', 'openProfile', 'eventUpdated']);

const props = defineProps({
  event: { type: Object, default: null }
});

const todoTasks = ref([]);
const doingTasks = ref([]);
const doneTasks = ref([]);
const isTaskModalOpen = ref(false);
const isEditingTask = ref(false);
const taskError = ref('');
const currentTask = ref({});
const taskDatesInput = ref('');
const eventNotes = ref('');
const notesMessage = ref('');
const notesMessageType = ref('success');
const eventDetails = ref({});
const detailsMessage = ref('');
const detailsMessageType = ref('success');
const detailsFieldErrors = ref({});
const taskFieldErrors = ref({});

watch(() => props.event, async (newEvent) => {
  eventNotes.value = newEvent?.notes || '';
  notesMessage.value = '';
  detailsMessage.value = '';
  detailsFieldErrors.value = {};
  taskFieldErrors.value = {};
  eventDetails.value = buildEventDetails(newEvent);

  if (newEvent) {
    await store.fetchTasks(newEvent.id);
  }
}, { immediate: true });

watch(() => store.currentEventTasks, (tasksFromDB) => {
  if (props.event && Array.isArray(tasksFromDB)) {
    todoTasks.value = tasksFromDB.filter((t) => t.status === 'To Do');
    doingTasks.value = tasksFromDB.filter((t) => t.status === 'Doing');
    doneTasks.value = tasksFromDB.filter((t) => t.status === 'Done');
  }
}, { deep: true });

const totalSpent = computed(() => doneTasks.value.reduce((sum, task) => sum + (Number(task.cost) || 0), 0));
const isPastEvent = computed(() => {
  const dateKey = toDateInputValue(props.event?.date);
  const todayKey = toDateInputValue(new Date());
  return Boolean(dateKey && dateKey < todayKey);
});

function buildEventDetails(event) {
  if (!event) {
    return { title: '', date: '', location: '', description: '', budget: 0, event_type: 'Other', guest_count: 0 };
  }

  return {
    title: event.title || '',
    date: toDateInputValue(event.date),
    location: event.location || '',
    description: event.description || '',
    budget: Number(event.budget || 0),
    event_type: event.event_type || 'Other',
    guest_count: Number(event.guest_count || 0)
  };
}

function inputClass(hasError) {
  return hasError
    ? 'w-full border border-red-400 rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:border-red-500'
    : 'w-full border border-[#e5e0d8] rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:border-[#D4862A]';
}

function selectClass(hasError) {
  return `${inputClass(hasError)} bg-white`;
}

function isValidDateString(value) {
  if (!value) return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function taskDateEntries(value) {
  if (!value) return [];
  return value.split(',').map((date) => date.trim()).filter(Boolean);
}

function invalidTaskDates(value) {
  return taskDateEntries(value).filter((date) => !isValidDateString(date));
}

function parseTaskDatesInput(value) {
  return [...new Set(taskDateEntries(value).filter(isValidDateString))];
}

function validateBoardDetails(payload) {
  const errors = {};

  if (!payload.title) {
    errors.title = 'Event/project title is required.';
  } else if (payload.title.length > 120) {
    errors.title = 'Title must be 120 characters or fewer.';
  }

  if (payload.date && !isValidDateString(payload.date)) {
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

  detailsFieldErrors.value = errors;
  return Object.keys(errors).length === 0;
}

function validateTaskForm(payload) {
  const errors = {};

  if (!payload.title) {
    errors.title = 'Task title is required.';
  } else if (payload.title.length > 120) {
    errors.title = 'Task title must be 120 characters or fewer.';
  }

  if (payload.description && payload.description.length > 1000) {
    errors.description = 'Description must be 1000 characters or fewer.';
  }

  if (payload.dueDate && !isValidDateString(payload.dueDate)) {
    errors.dueDate = 'Due date must use the YYYY-MM-DD format.';
  }

  if (payload.dueDate && eventDetails.value.date) {
    const taskDateObj = new Date(`${payload.dueDate}T00:00:00`);
    const boardDateObj = new Date(`${eventDetails.value.date}T00:00:00`);
    if (taskDateObj > boardDateObj) {
      errors.dueDate = 'Due date cannot be later than the event date.';
    }
  }

  if (!Number.isFinite(payload.cost) || payload.cost < 0) {
    errors.cost = 'Cost must be a valid non-negative number.';
  }

  if (payload.assignee && payload.assignee.length > 120) {
    errors.assignee = 'Assignee must be 120 characters or fewer.';
  }

  if (invalidTaskDates(taskDatesInput.value).length) {
    errors.taskDates = 'Task days must use YYYY-MM-DD values separated by commas.';
  }

  taskFieldErrors.value = errors;
  return Object.keys(errors).length === 0;
}

function openTaskModal(task = null) {
  if (isPastEvent.value) return;
  taskError.value = '';
  taskFieldErrors.value = {};
  if (task) {
    isEditingTask.value = true;
    currentTask.value = {
      ...task,
      dueDate: toDateInputValue(task.dueDate),
      cost: Number(task.cost || 0),
      position: Number(task.position || 0),
      task_dates: Array.isArray(task.task_dates) ? task.task_dates : []
    };
    taskDatesInput.value = currentTask.value.task_dates.join(', ');
  } else {
    isEditingTask.value = false;
    currentTask.value = {
      title: '',
      description: '',
      status: 'To Do',
      priority: 'Medium Priority',
      assignee: '',
      dueDate: '',
      task_dates: [],
      cost: 0,
      position: 0,
      daily_focus: false
    };
    taskDatesInput.value = '';
  }
  isTaskModalOpen.value = true;
}

function closeTaskModal() {
  taskError.value = '';
  taskFieldErrors.value = {};
  isTaskModalOpen.value = false;
}

async function saveEventNotes() {
  if (!props.event) return;
  notesMessage.value = '';
  notesMessageType.value = 'success';

  try {
    const updatedEvent = await store.updateEvent(props.event.id, {
      ...props.event,
      date: toDateInputValue(props.event.date),
      notes: eventNotes.value
    });
    emit('eventUpdated', updatedEvent);
    notesMessage.value = 'Notes saved.';
  } catch (err) {
    notesMessageType.value = 'error';
    notesMessage.value = err.response?.data?.error || 'Failed to save notes.';
  }
}

async function saveEventDetails() {
  if (!props.event) return;
  detailsMessage.value = '';
  detailsMessageType.value = 'success';
  detailsFieldErrors.value = {};

  const payload = {
    ...props.event,
    title: eventDetails.value.title?.trim() || '',
    date: eventDetails.value.date || null,
    location: eventDetails.value.location?.trim() || '',
    description: eventDetails.value.description?.trim() || '',
    budget: Number(eventDetails.value.budget || 0),
    event_type: eventDetails.value.event_type || 'Other',
    guest_count: Number(eventDetails.value.guest_count || 0),
    notes: eventNotes.value
  };

  if (!validateBoardDetails(payload)) {
    detailsMessageType.value = 'error';
    detailsMessage.value = 'Please correct the highlighted event details.';
    return;
  }

  try {
    const updatedEvent = await store.updateEvent(props.event.id, payload);
    emit('eventUpdated', updatedEvent);
    eventDetails.value = buildEventDetails(updatedEvent);
    detailsMessage.value = 'Event details saved.';
  } catch (err) {
    detailsMessageType.value = 'error';
    detailsMessage.value = err.response?.data?.error || 'Failed to save event details.';
  }
}

async function saveTask() {
  taskError.value = '';
  taskFieldErrors.value = {};


  const payload = {
    title: currentTask.value.title?.trim() || '',
    description: currentTask.value.description?.trim() || '',
    status: currentTask.value.status || 'To Do',
    priority: currentTask.value.priority || 'Medium Priority',
    assignee: currentTask.value.assignee?.trim() || '',
    dueDate: currentTask.value.dueDate || null,
    task_dates: parseTaskDatesInput(taskDatesInput.value),
    cost: Number(currentTask.value.cost || 0),
    position: Number(currentTask.value.position || 0),
    daily_focus: !!currentTask.value.daily_focus
  };

  if (!validateTaskForm(payload)) {
    taskError.value = 'Please correct the highlighted task fields.';
    return;
  }

  try {
    if (isEditingTask.value) {
      await store.updateTask(currentTask.value.id, payload);
    } else {
      await store.createTask(props.event.id, payload);
    }
    isTaskModalOpen.value = false;
  } catch (err) {
    taskError.value = err.response?.data?.error || 'Failed to save task.';
    console.error(err);
  }
}

async function deleteTask() {
  if (!currentTask.value.id) return;
  if (confirm('Are you sure you want to delete this task?')) {
    try {
      await store.deleteTask(currentTask.value.id);
      isTaskModalOpen.value = false;
    } catch (err) {
      taskError.value = err.response?.data?.error || 'Failed to delete task';
      console.error(err);
    }
  }
}

async function handleToggleComplete(task) {
  if (isPastEvent.value) return;
  const newStatus = task.status === 'Done' ? 'To Do' : 'Done';
  try {
    await store.updateTask(task.id, {
      ...task,
      status: newStatus,
      dueDate: toDateInputValue(task.dueDate),
      cost: Number(task.cost || 0),
      position: Number(task.position || 0),
      task_dates: Array.isArray(task.task_dates) ? task.task_dates : []
    });
    if (props.event) {
      await store.fetchTasks(props.event.id);
    }
  } catch (err) {
    console.error('Failed to update task status:', err);
    alert(err.response?.data?.error || 'Failed to update task status.');
  }
}

async function syncTaskStatuses() {
  if (isPastEvent.value) return;
  todoTasks.value.forEach((task, index) => { task.status = 'To Do'; task.position = index; });
  doingTasks.value.forEach((task, index) => { task.status = 'Doing'; task.position = index; });
  doneTasks.value.forEach((task, index) => { task.status = 'Done'; task.position = index; });

  const allTasks = [
    ...todoTasks.value.map((t) => ({ id: t.id, status: t.status, position: t.position })),
    ...doingTasks.value.map((t) => ({ id: t.id, status: t.status, position: t.position })),
    ...doneTasks.value.map((t) => ({ id: t.id, status: t.status, position: t.position }))
  ];

  try {
    await store.saveReorderedTasks(allTasks);
  } catch (err) {
    alert(err.response?.data?.error || 'Failed to save task order.');
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #9ca3af; }
</style>
