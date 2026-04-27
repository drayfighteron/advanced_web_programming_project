<template>
  <div class="min-h-screen bg-[#F5F0E8] font-sans flex flex-col">
    <header class="bg-white border-b border-[#e5e0d8] px-8 py-4 flex justify-between items-center z-10 shrink-0 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-[#1C2340]">Schedule</h1>
        <p class="text-[13px] text-[#9ca3af] mt-0.5">Overview of your events and scheduled tasks</p>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="goToPreviousMonth"
          class="w-10 h-10 rounded-full border border-[#e5e0d8] bg-[#F5F0E8] text-[#1C2340] hover:bg-[#eee7dc] transition-colors"
          title="Previous month"
        >
          <i class="fas fa-chevron-left"></i>
        </button>
        <div class="min-w-[180px] text-center">
          <div class="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider">Current Month</div>
          <div class="text-lg font-bold text-[#1C2340]">{{ monthLabel }}</div>
        </div>
        <button
          @click="goToNextMonth"
          class="w-10 h-10 rounded-full border border-[#e5e0d8] bg-[#F5F0E8] text-[#1C2340] hover:bg-[#eee7dc] transition-colors"
          title="Next month"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
        <button
          @click="goToToday"
          class="px-4 py-2 rounded-xl bg-[#1C2340] text-white text-[12px] font-bold hover:bg-[#2E3A5C] transition-colors"
        >
          Today
        </button>
        <button @click="$emit('openProfile')" class="w-10 h-10 bg-[#F5F0E8] text-[#9ca3af] hover:text-[#1C2340] rounded-full flex items-center justify-center transition-all border border-[#e5e0d8]" title="Profile">
          <i class="fas fa-user text-[12px]"></i>
        </button>
      </div>
    </header>

    <main class="flex-1 p-8 pb-32">
      <div class="max-w-[1200px] mx-auto bg-white rounded-3xl border border-[#e5e0d8] shadow-sm overflow-hidden">
        <div class="p-5 border-b border-[#e5e0d8] flex justify-between items-center bg-white">
          <div>
            <h2 class="text-[16px] font-bold text-[#1C2340]">Calendar</h2>
            <p class="text-[12px] text-[#9ca3af] mt-1">Events and tasks share the same planning calendar.</p>
          </div>
          <div class="flex items-center gap-4 text-[11px] text-[#9ca3af]">
            <span class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-[#D4862A]"></span>Event</span>
            <span class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-[#F5F0E8] border border-[#e5e0d8]"></span>Daily Task</span>
          </div>
        </div>

        <div class="grid grid-cols-7 border-b border-[#e5e0d8] bg-[#F5F0E8]">
          <div
            v-for="day in WEEKDAY_LABELS"
            :key="day"
            class="py-3 text-center text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider"
          >
            {{ day }}
          </div>
        </div>

        <div class="grid grid-cols-7 auto-rows-[minmax(112px,1fr)] min-h-[672px]">
          <div
            v-for="calendarDay in calendarDays"
            :key="calendarDay.key"
            class="border-b border-r border-[#e5e0d8] p-2 relative transition-colors overflow-hidden"
            :class="[
              calendarDay.isCurrentMonth ? 'bg-white hover:bg-[#faf8f5]' : 'bg-[#faf8f5] text-[#b9b6b1]',
              calendarDay.isToday ? 'ring-2 ring-inset ring-[#D4862A]' : ''
            ]"
          >
            <div class="flex items-center justify-between mb-2">
              <span
                class="text-[12px] font-bold"
                :class="calendarDay.isCurrentMonth ? 'text-[#1C2340]' : 'text-[#b9b6b1]'"
              >
                {{ calendarDay.dayNumber }}
              </span>
              <span
                v-if="calendarDay.isToday"
                class="text-[9px] font-bold uppercase tracking-wider text-[#D4862A]"
              >
                Today
              </span>
            </div>

            <div class="space-y-1 max-h-[86px] overflow-y-auto custom-scrollbar pr-1">
              <div
                v-for="event in calendarDay.events"
                :key="`event-${event.id}`"
                class="text-[10px] px-2 py-1 rounded truncate text-white cursor-pointer hover:opacity-90 transition-opacity"
                :style="{ backgroundColor: event.color || '#D4862A' }"
                :title="`${event.title} • ${formatEventDate(event.date)}`"
                @click="$emit('selectEvent', event)"
              >
                {{ event.title }}
              </div>

              <div
                v-for="task in calendarDay.tasks"
                :key="`task-${task.id}`"
                class="text-[10px] px-2 py-1 rounded truncate bg-[#F5F0E8] border border-[#e5e0d8] text-[#1C2340] cursor-pointer hover:bg-[#eee7dc] transition-colors"
                :title="`${task.title} • ${task.event_title || 'Event item'}`"
                @click="selectTaskEvent(task)"
              >
                • {{ task.title }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <nav class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/75 backdrop-blur-md border border-white/70 rounded-full px-6 py-3 flex items-center gap-6 shadow-xl z-50 text-[#1C2340]">
      <LogoMark variant="nav" class="mr-1" />

      <button @click="$emit('goBack')" class="w-10 h-10 bg-[#F5F0E8]/80 text-[#9ca3af] hover:text-[#1C2340] rounded-full flex items-center justify-center transition-all" title="MyEvents">
        <i class="fas fa-layer-group"></i>
      </button>

      <button class="w-10 h-10 bg-[#D4862A] text-white rounded-full flex items-center justify-center shadow-lg -translate-y-1 transition-all" title="Open Calendar">
        <i class="far fa-calendar-alt"></i>
      </button>
    </nav>
  </div>
</template>

<script setup>
import LogoMark from './LogoMark.vue';
import { computed, ref, watch, onMounted } from 'vue';
import { store } from '../store.js';
import {
  WEEKDAY_LABELS,
  addMonths,
  buildCalendarDays,
  formatEventDate,
  formatMonthYear,
  parseEventDate,
  startOfMonth
} from '../utils/date.js';

const emit = defineEmits(['goBack', 'selectEvent', 'openProfile']);

const monthCursor = ref(startOfMonth(new Date()));

onMounted(async () => {
  if (store.user) {
    await store.fetchEvents();
    await store.fetchAllTasks();
  }
});

let hasInitializedCursor = false;

watch(
    () => store.events,
    (events) => {
      if (!events.length || hasInitializedCursor) return;

      const datedEvents = events
          .map(event => parseEventDate(event.date))
          .filter(Boolean)
          .sort((a, b) => a - b);

      if (datedEvents.length) {
        monthCursor.value = startOfMonth(datedEvents[0]);
        hasInitializedCursor = true;
      }
    },
    { immediate: true }
);

const monthLabel = computed(() => formatMonthYear(monthCursor.value));
const calendarDays = computed(() => {
  return buildCalendarDays(monthCursor.value, store.events).map((calendarDay) => ({
    ...calendarDay,
    tasks: store.allTasks.filter((task) => taskDateKeys(task).includes(calendarDay.key))
  }));
});

function taskDateKeys(task) {
  const dates = Array.isArray(task.task_dates) ? task.task_dates : [];
  return dates.length ? dates : (task.dueDate ? [task.dueDate] : []);
}

function selectTaskEvent(task) {
  const event = store.events.find((item) => item.id === task.event_id);
  if (event) {
    emitSelectEvent(event);
  }
}

function emitSelectEvent(event) {
  emit('selectEvent', event);
}

function goToPreviousMonth() {
  monthCursor.value = addMonths(monthCursor.value, -1);
}

function goToNextMonth() {
  monthCursor.value = addMonths(monthCursor.value, 1);
}

function goToToday() {
  monthCursor.value = startOfMonth(new Date());
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #9ca3af; }
</style>
