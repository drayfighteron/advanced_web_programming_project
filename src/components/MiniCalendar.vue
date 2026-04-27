<template>
  <div class="bg-white rounded-2xl border border-[#e5e0d8] shadow-sm overflow-hidden">
    <div class="h-1.5 w-full bg-[#D4862A]"></div>
    <div class="p-5">
      <div class="flex items-center justify-between gap-3 mb-4">
        <div class="flex items-center gap-3 min-w-0">
          <LogoMark />
          <div class="min-w-0">
            <p class="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider">Mini Calendar</p>
            <h3 class="text-[15px] font-bold text-[#1C2340] mt-1 truncate">{{ monthLabel }}</h3>
          </div>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <button
            @click="goToPreviousMonth"
            class="w-9 h-9 rounded-full border border-[#e5e0d8] bg-[#F5F0E8] text-[#1C2340] hover:bg-[#eee7dc] transition-colors"
            title="Previous month"
          >
            <i class="fas fa-chevron-left text-[11px]"></i>
          </button>
          <button
            @click="goToNextMonth"
            class="w-9 h-9 rounded-full border border-[#e5e0d8] bg-[#F5F0E8] text-[#1C2340] hover:bg-[#eee7dc] transition-colors"
            title="Next month"
          >
            <i class="fas fa-chevron-right text-[11px]"></i>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-7 gap-1 mb-2">
        <div
          v-for="day in WEEKDAY_LABELS"
          :key="day"
          class="text-center text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider py-1"
        >
          {{ day.slice(0, 1) }}
        </div>
      </div>

      <div class="grid grid-cols-7 gap-1">
        <div
          v-for="calendarDay in calendarDays"
          :key="calendarDay.key"
          class="aspect-square rounded-xl border text-[11px] flex flex-col items-center justify-center transition-colors"
          :class="[
            calendarDay.isCurrentMonth
              ? 'bg-white border-[#f1ece4] text-[#1C2340]'
              : 'bg-[#faf8f5] border-[#f3efe8] text-[#c2beb7]',
            calendarDay.isToday ? 'ring-2 ring-[#D4862A] border-transparent' : ''
          ]"
        >
          <span class="font-semibold">{{ calendarDay.dayNumber }}</span>
          <span v-if="calendarDay.events.length" class="mt-1 w-1.5 h-1.5 rounded-full bg-[#D4862A]"></span>
        </div>
      </div>

      <div class="flex items-center justify-between mt-4 pt-4 border-t border-[#f3f0eb]">
        <p class="text-[11px] text-[#9ca3af]">Track deadlines and task days.</p>
        <button
          @click="$emit('openCalendar')"
          class="px-3 py-1.5 rounded-xl bg-[#1C2340] text-white text-[11px] font-bold hover:bg-[#2E3A5C] transition-colors"
        >
          Open Calendar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { WEEKDAY_LABELS, addMonths, buildCalendarDays, formatMonthYear, startOfMonth } from '../utils/date.js';
import LogoMark from './LogoMark.vue';

const props = defineProps({
  events: {
    type: Array,
    default: () => []
  }
});

defineEmits(['openCalendar']);

const monthCursor = ref(startOfMonth(new Date()));

const monthLabel = computed(() => formatMonthYear(monthCursor.value));
const calendarDays = computed(() => buildCalendarDays(monthCursor.value, props.events || []));

function goToPreviousMonth() {
  monthCursor.value = addMonths(monthCursor.value, -1);
}

function goToNextMonth() {
  monthCursor.value = addMonths(monthCursor.value, 1);
}
</script>
