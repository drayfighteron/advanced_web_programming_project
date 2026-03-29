<template>
  <div class="min-h-screen bg-[#F5F0E8] font-sans flex flex-col relative pb-32">
    
    <main class="flex-1 p-8 overflow-y-auto">
      <header class="flex justify-between items-end mb-10 max-w-[1200px] mx-auto pt-4">
        <div>
          <h1 class="text-3xl font-bold text-[#1C2340] tracking-tight">My Events</h1>
          <p class="text-[14px] text-[#9ca3af] mt-1">{{ events.length }} events managed</p>
        </div>
        <div class="flex items-center gap-4">
          <div class="relative">
            <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af] text-[13px]"></i>
            <input type="text" placeholder="Search events..." class="pl-10 pr-4 py-2.5 rounded-xl border border-[#e5e0d8] bg-white text-[13px] focus:outline-none focus:border-[#D4862A] w-[250px] shadow-sm" />
          </div>
          <button @click="isModalOpen = true" class="bg-[#1C2340] hover:bg-[#2E3A5C] text-white px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all shadow-lg hover:-translate-y-0.5 flex items-center gap-2">
            <i class="fas fa-plus"></i> Add Event
          </button>
        </div>
      </header>

      <div class="max-w-[1200px] mx-auto space-y-8">
        <div class="grid grid-cols-4 gap-4">
          <div class="bg-white p-5 rounded-2xl border border-[#e5e0d8] shadow-sm flex flex-col justify-center">
            <span class="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Total Events</span>
            <span class="text-2xl font-bold text-[#1C2340]">{{ events.length }}</span>
          </div>
          <div class="bg-white p-5 rounded-2xl border border-[#e5e0d8] shadow-sm flex flex-col justify-center">
            <span class="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Total Budget</span>
            <span class="text-2xl font-bold text-[#1C2340]">$78k</span>
          </div>
          <div class="bg-white p-5 rounded-2xl border border-[#e5e0d8] shadow-sm flex flex-col justify-center">
            <span class="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">In Progress</span>
            <span class="text-2xl font-bold text-[#1C2340]">4</span>
          </div>
          <div class="bg-white p-5 rounded-2xl border border-[#e5e0d8] shadow-sm flex flex-col justify-center">
            <span class="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Tasks Completed</span>
            <span class="text-2xl font-bold text-[#1C2340]">3 / 13</span>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-6">
          <div v-for="event in events" :key="event.id" @click="$emit('selectEvent', event)" class="bg-white rounded-2xl border border-[#e5e0d8] shadow-sm hover:shadow-[0_10px_30px_rgba(28,35,64,0.08)] transition-all cursor-pointer hover:-translate-y-1 overflow-hidden flex flex-col">
            <div class="h-1.5 w-full" :style="{ backgroundColor: event.color }"></div>
            <div class="p-6 flex-1 flex flex-col">
              <h3 class="text-[16px] font-bold text-[#1C2340] mb-3">{{ event.title }}</h3>
              <div class="flex flex-col gap-1.5 mb-4">
                <span class="text-[12px] text-[#6b7280] flex items-center gap-2"><i class="far fa-calendar text-[#9ca3af]"></i> {{ event.date }}</span>
                <span class="text-[12px] text-[#6b7280] flex items-center gap-2"><i class="fas fa-map-marker-alt text-[#9ca3af]"></i> {{ event.location }}</span>
              </div>
              <p class="text-[12px] text-[#9ca3af] line-clamp-2 mb-6">{{ event.description }}</p>
              
              <div class="mt-auto pt-4 border-t border-[#f3f0eb] flex justify-between items-end">
                <div>
                  <span class="block text-[10px] text-[#9ca3af] mb-0.5">Budget</span>
                  <span class="text-[14px] font-bold text-[#1C2340]">${{ event.budget.toLocaleString() }}</span>
                </div>
              </div>
              
              <button class="w-full mt-5 py-2.5 bg-[#F5F0E8] hover:bg-[#1C2340] hover:text-white text-[#1C2340] text-[12px] font-bold rounded-xl transition-colors">
                ✓ Manage Tasks
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <nav class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1C2340] rounded-full px-6 py-3 flex items-center gap-6 shadow-[0_20px_40px_rgba(28,35,64,0.3)] z-50">
      <div class="flex items-center justify-center text-xl mr-2" title="EventSync">📅</div>
      
      <button class="w-10 h-10 bg-[#D4862A] text-white rounded-full flex items-center justify-center shadow-lg hover:-translate-y-1 transition-transform" title="My Events">
        <i class="fas fa-layer-group"></i>
      </button>
      <button class="w-10 h-10 text-[#9ca3af] hover:text-white rounded-full flex items-center justify-center transition-colors" title="Calendar">
        <i class="far fa-calendar-alt"></i>
      </button>
      <button class="w-10 h-10 text-[#9ca3af] hover:text-white rounded-full flex items-center justify-center transition-colors" title="Settings">
        <i class="fas fa-cog"></i>
      </button>

      <div class="w-px h-6 bg-[#2E3A5C] mx-2"></div>

      <div class="w-8 h-8 rounded-full bg-white text-[#1C2340] text-[11px] font-bold flex items-center justify-center">JD</div>
      <button @click="$emit('logout')" class="text-[12px] text-red-400 font-medium hover:text-red-300 ml-1">Logout</button>
    </nav>

    <div v-if="isModalOpen" class="fixed inset-0 bg-[#1C2340]/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div class="bg-white rounded-2xl p-8 max-w-[440px] w-full shadow-2xl">
        <h2 class="text-xl font-bold text-[#1C2340] mb-6">New Event</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-[11px] font-bold text-[#1C2340] uppercase mb-1.5">Event Title *</label>
            <input v-model="newEvent.title" type="text" class="w-full bg-[#F5F0E8] border border-[#e5e0d8] rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#D4862A]" />
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-8 pt-6 border-t border-[#e5e0d8]">
          <button @click="isModalOpen = false" class="px-5 py-2.5 text-[13px] font-semibold text-[#6b7280] hover:bg-[#F5F0E8] rounded-xl transition-colors">Cancel</button>
          <button @click="addEvent" class="px-5 py-2.5 text-[13px] font-semibold bg-[#1C2340] hover:bg-[#2E3A5C] text-white rounded-xl transition-colors">Create Event</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { mockEvents } from '../data/mockData.js';

const emit = defineEmits(['selectEvent', 'logout']);
const events = ref([...mockEvents]);
const isModalOpen = ref(false);

const newEvent = ref({ title: '', date: '', budget: null, location: '' });

function addEvent() {
  if (!newEvent.value.title) return alert('Title is required');
  events.value.push({
    id: 'ev' + Date.now(),
    title: newEvent.value.title,
    date: newEvent.value.date || 'TBD',
    location: newEvent.value.location || 'TBD',
    description: 'Newly created event.',
    budget: newEvent.value.budget || 0,
    color: '#D4862A',
    stats: { todo: 0, doing: 0, done: 0 }
  });
  isModalOpen.value = false;
  newEvent.value = { title: '', date: '', budget: null, location: '' };
}
</script>