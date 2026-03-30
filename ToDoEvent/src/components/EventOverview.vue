<template>
  <div class="min-h-screen bg-[#F5F0E8] font-sans flex flex-col relative pb-32">
    <header class="bg-white border-b border-[#e5e0d8] px-8 py-4 flex justify-between items-center z-10 shrink-0">
      <div>
        <h1 class="text-2xl font-bold text-[#1C2340]">My Events</h1>
        <p class="text-[13px] text-[#9ca3af] mt-0.5">{{ filteredEvents.length }} events managed</p>
      </div>
      <div class="flex items-center gap-4">
        <div class="relative">
          <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af] text-[13px]"></i>
          <input v-model="searchQuery" type="text" placeholder="Search events..." class="pl-10 pr-4 py-2.5 rounded-xl border border-[#e5e0d8] bg-[#F5F0E8] text-[13px] focus:outline-none focus:border-[#D4862A] w-[250px] transition-colors" />
        </div>
        <button @click="openAddModal" class="bg-[#D4862A] hover:bg-[#b57121] text-white px-5 py-2.5 rounded-xl text-[13px] font-bold shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2">
          <i class="fas fa-plus"></i> Add Event
        </button>
      </div>
    </header>

    <main class="flex-1 p-8 overflow-y-auto">
      <div class="max-w-[1200px] mx-auto space-y-8">
        <div class="grid grid-cols-4 gap-4">
          <div class="bg-white p-5 rounded-2xl border border-[#e5e0d8] shadow-sm flex flex-col justify-center">
            <span class="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Total Events</span>
            <span class="text-2xl font-bold text-[#1C2340]">{{ globalEvents.length }}</span>
          </div>
          <div class="bg-white p-5 rounded-2xl border border-[#e5e0d8] shadow-sm flex flex-col justify-center">
            <span class="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Total Budget</span>
            <span class="text-2xl font-bold text-[#1C2340]">${{ (globalEvents.reduce((sum, e) => sum + (e.budget || 0), 0) / 1000).toFixed(0) }}k</span>
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
          <div v-for="event in filteredEvents" :key="event.id" class="relative bg-white rounded-2xl border border-[#e5e0d8] shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col group">
            <div class="h-1.5 w-full" :style="{ backgroundColor: event.color }"></div>
            
            <div class="p-6 flex-1 flex flex-col mt-2">
              <h3 class="text-[16px] font-bold text-[#1C2340] mb-3 pr-6">{{ event.title }}</h3>
              <div class="flex flex-col gap-1.5 mb-4">
                <span class="text-[12px] text-[#6b7280] flex items-center gap-2"><i class="far fa-calendar text-[#9ca3af] w-3"></i> {{ event.date }}</span>
                <span class="text-[12px] text-[#6b7280] flex items-center gap-2"><i class="fas fa-map-marker-alt text-[#9ca3af] w-3"></i> {{ event.location }}</span>
              </div>
              <p class="text-[12px] text-[#9ca3af] line-clamp-2 mb-6">{{ event.description }}</p>

              <div class="mt-auto pt-4 border-t border-[#f3f0eb] flex justify-between items-end">
                <div>
                  <span class="block text-[10px] text-[#9ca3af] mb-0.5">Budget</span>
                  <span class="text-[14px] font-bold text-[#1C2340]">${{ event.budget?.toLocaleString() || 0 }}</span>
                </div>
              </div>

              <div class="flex gap-3 mt-5">
                <button @click.stop="openEditModal(event)" class="w-12 py-2.5 bg-[#F5F0E8] hover:bg-[#e5e0d8] text-[#D4862A] rounded-xl flex items-center justify-center transition-colors shadow-sm" title="Edit Event Details">
                  <i class="fas fa-pencil-alt text-[12px]"></i>
                </button>
                <button @click="$emit('selectEvent', event)" class="flex-1 py-2.5 bg-[#1C2340] hover:bg-[#2E3A5C] text-white text-[12px] font-bold rounded-xl transition-colors shadow-sm">
                  ✓ Manage Tasks
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <nav class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white border border-[#e5e0d8] rounded-full px-6 py-3 flex items-center gap-6 shadow-xl z-50 text-[#1C2340]">
      <div class="flex items-center justify-center text-xl mr-2" title="EventSync">📅</div>
      <button class="w-10 h-10 bg-[#D4862A] text-white rounded-full flex items-center justify-center shadow-lg -translate-y-1 transition-all" title="My Events"><i class="fas fa-layer-group"></i></button>
      <button @click="$emit('openDashboard')" class="w-10 h-10 bg-[#F5F0E8] text-[#9ca3af] hover:text-[#1C2340] rounded-full flex items-center justify-center transition-colors" title="Task Dashboard"><i class="fas fa-tasks"></i></button>
      <button @click="$emit('openCalendar')" class="w-10 h-10 bg-[#F5F0E8] text-[#9ca3af] hover:text-[#1C2340] rounded-full flex items-center justify-center transition-colors" title="Open Calendar"><i class="far fa-calendar-alt"></i></button>
      <div class="w-px h-6 bg-[#e5e0d8] mx-2"></div>
      <div class="w-8 h-8 rounded-full bg-[#1C2340] text-white text-[11px] font-bold flex items-center justify-center">JD</div>
    </nav>

    <div v-if="isModalOpen" class="fixed inset-0 bg-[#1C2340]/50 flex items-center justify-center z-50 px-4">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md border border-[#e5e0d8] shadow-2xl">
        <h2 class="text-xl font-bold text-[#1C2340] mb-4">{{ isEditing ? 'Edit Event' : 'Add New Event' }}</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Title</label>
            <input v-model="currentEvent.title" type="text" class="w-full border border-[#e5e0d8] rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:border-[#D4862A]" placeholder="Event Title" />
          </div>
          <div>
            <label class="block text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Description</label>
            <textarea v-model="currentEvent.description" rows="2" class="w-full border border-[#e5e0d8] rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:border-[#D4862A]" placeholder="Short description..."></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Date</label>
              <input v-model="currentEvent.date" type="text" class="w-full border border-[#e5e0d8] rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:border-[#D4862A]" placeholder="e.g. Sep 19, 2026" />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Budget ($)</label>
              <input v-model.number="currentEvent.budget" type="number" class="w-full border border-[#e5e0d8] rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:border-[#D4862A]" placeholder="5000" />
            </div>
          </div>
          <div>
            <label class="block text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Location</label>
            <input v-model="currentEvent.location" type="text" class="w-full border border-[#e5e0d8] rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:border-[#D4862A]" placeholder="Location" />
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
import { ref, computed } from 'vue';
import { globalEvents } from '../store.js';

defineEmits(['selectEvent', 'logout', 'openCalendar', 'openDashboard']);

const isModalOpen = ref(false);
const isEditing = ref(false);
const searchQuery = ref('');

const emptyEvent = { id: null, title: '', date: '', budget: null, location: '', description: '' };
const currentEvent = ref({ ...emptyEvent });

const filteredEvents = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return globalEvents.value;
  return globalEvents.value.filter(event => event.title.toLowerCase().includes(query));
});

function openAddModal() {
  isEditing.value = false;
  currentEvent.value = { ...emptyEvent }; 
  isModalOpen.value = true;
}

function openEditModal(event) {
  isEditing.value = true;
  currentEvent.value = { ...event };
  isModalOpen.value = true;
}

function saveEvent() {
  if (!currentEvent.value.title) return alert('Title is required');

  if (isEditing.value) {
    const index = globalEvents.value.findIndex(e => e.id === currentEvent.value.id);
    if (index !== -1) {
      globalEvents.value[index] = { ...currentEvent.value };
    }
  } else {
    globalEvents.value.unshift({
      ...currentEvent.value,
      id: 'ev' + Date.now(),
      budget: Number(currentEvent.value.budget) || 0,
      color: '#D4862A',
      stats: { todo: 0, doing: 0, done: 0 }
    });
  }
  isModalOpen.value = false;
}
</script>