<template>
  <div class="min-h-screen bg-[#F5F0E8] font-sans flex flex-col relative pb-32">
    <header class="bg-white border-b border-[#e5e0d8] px-8 py-4 flex justify-between items-center z-10 shrink-0">
      <div>
        <h1 class="text-2xl font-bold text-[#1C2340]">Schedule</h1>
        <p class="text-[13px] text-[#9ca3af] mt-0.5">Overview of upcoming events</p>
      </div>
    </header>

    <main class="flex-1 p-8 overflow-y-auto">
      <div class="max-w-[1200px] mx-auto bg-white rounded-2xl border border-[#e5e0d8] shadow-sm overflow-hidden mt-2">
        <div class="grid grid-cols-7 border-b border-[#e5e0d8] bg-[#F5F0E8]">
          <div v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" :key="day" class="py-3 text-center text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider">
            {{ day }}
          </div>
        </div>

        <div class="grid grid-cols-7 auto-rows-[120px]">
          <div class="border-b border-r border-[#e5e0d8] bg-[#faf8f5]"></div>
          <div class="border-b border-r border-[#e5e0d8] bg-[#faf8f5]"></div>
          
          <div v-for="day in 30" :key="day" class="border-b border-r border-[#e5e0d8] p-2 relative hover:bg-[#faf8f5] transition-colors">
            <span class="text-[12px] font-bold text-[#1C2340]">{{ day }}</span>
            
            <div v-for="event in eventsForDay(day)" :key="event.id" class="mt-1">
              <div 
                class="text-[10px] px-2 py-1 rounded truncate text-white cursor-pointer hover:opacity-90 transition-opacity"
                :style="{ backgroundColor: event.color }"
                :title="event.title"
                @click="$emit('selectEvent', event)"
              >
                {{ event.title }}
              </div>
            </div>
          </div>
          
          <div class="border-r border-[#e5e0d8] bg-[#faf8f5]"></div>
          <div class="border-r border-[#e5e0d8] bg-[#faf8f5]"></div>
          <div class="bg-[#faf8f5]"></div>
        </div>
      </div>
    </main>

    <nav class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white border border-[#e5e0d8] rounded-full px-6 py-3 flex items-center gap-6 shadow-xl z-50 text-[#1C2340]">
      <div class="flex items-center justify-center text-xl mr-2" title="EventSync">📅</div>

      <button @click="$emit('goBack')" class="w-10 h-10 bg-[#F5F0E8] text-[#9ca3af] hover:text-[#1C2340] rounded-full flex items-center justify-center transition-all" title="My Events">
        <i class="fas fa-layer-group"></i>
      </button>

      <button @click="$emit('openDashboard')" class="w-10 h-10 bg-[#F5F0E8] text-[#9ca3af] hover:text-[#1C2340] rounded-full flex items-center justify-center transition-all" title="Task Dashboard">
        <i class="fas fa-tasks"></i>
      </button>
      
      <button class="w-10 h-10 bg-[#D4862A] text-white rounded-full flex items-center justify-center shadow-lg -translate-y-1 transition-all" title="Open Calendar">
        <i class="far fa-calendar-alt"></i>
      </button>

      <div class="w-px h-6 bg-[#e5e0d8] mx-2"></div>
      <div class="w-8 h-8 rounded-full bg-[#1C2340] text-white text-[11px] font-bold flex items-center justify-center">JD</div>
    </nav>
  </div>
</template>

<script setup>
import { globalEvents } from '../store.js';

defineEmits(['goBack', 'selectEvent', 'openDashboard']);

// This dynamically looks for the day number inside your event string (e.g. "Sep 19, 2026")
function eventsForDay(dayNum) {
  return globalEvents.value.filter(e => {
    if (!e.date) return false;
    const match = e.date.match(/\d+/);
    return match && parseInt(match[0], 10) === dayNum;
  });
}
</script>