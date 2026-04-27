<template>
  <div class="min-h-screen bg-[#F5F0E8] font-sans flex flex-col">
    <header class="bg-white border-b border-[#e5e0d8] px-8 py-4 flex justify-between items-center z-10 shrink-0">
      <div>
        <h1 class="text-2xl font-bold text-[#1C2340]">Profile</h1>
        <p class="text-[13px] text-[#9ca3af] mt-0.5">Account details and session settings</p>
      </div>
      <button class="w-10 h-10 bg-[#D4862A] text-white rounded-full flex items-center justify-center shadow-lg" title="Profile">
        <i class="fas fa-user text-[12px]"></i>
      </button>
    </header>

    <main class="flex-1 p-8 pb-32">
      <div class="max-w-[900px] mx-auto space-y-6">
        <div class="bg-white rounded-2xl border border-[#e5e0d8] shadow-sm overflow-hidden">
          <div class="h-1.5 w-full bg-[#D4862A]"></div>
          <div class="p-6 flex items-center gap-5">
            <div class="w-16 h-16 rounded-full bg-[#1C2340] text-white text-xl font-bold flex items-center justify-center shrink-0">
              {{ initials }}
            </div>
            <div class="flex-1">
              <span class="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1 block">Signed in as</span>
              <h2 class="text-xl font-bold text-[#1C2340]">{{ store.user?.username }}</h2>
              <p class="text-[13px] text-[#9ca3af] mt-1">Your events, notes, and calendar tasks are saved to this account.</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="bg-white p-5 rounded-2xl border border-[#e5e0d8] shadow-sm flex flex-col justify-center">
            <span class="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Events</span>
            <span class="text-2xl font-bold text-[#1C2340]">{{ store.events.length }}</span>
          </div>
          <div class="bg-white p-5 rounded-2xl border border-[#e5e0d8] shadow-sm flex flex-col justify-center">
            <span class="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Daily Tasks</span>
            <span class="text-2xl font-bold text-[#1C2340]">{{ store.allTasks.length }}</span>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-[#e5e0d8] shadow-sm p-6">
          <h3 class="text-[15px] font-bold text-[#1C2340] mb-2">Session</h3>
          <p class="text-[13px] text-[#9ca3af] mb-5">Sign out from this device when you are done planning.</p>
          <button @click="logout" class="bg-[#1C2340] hover:bg-red-500 text-white px-5 py-2.5 rounded-xl text-[13px] font-bold shadow-lg transition-colors inline-flex items-center gap-2">
            <i class="fas fa-sign-out-alt text-[11px]"></i> Logout
          </button>
        </div>
      </div>
    </main>

    <nav class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/75 backdrop-blur-md border border-white/70 rounded-full px-6 py-3 flex items-center gap-6 shadow-xl z-50 text-[#1C2340]">
      <LogoMark variant="nav" class="mr-1" />
      <button @click="$emit('goBack')" class="w-10 h-10 bg-[#F5F0E8]/80 text-[#9ca3af] hover:text-[#1C2340] rounded-full flex items-center justify-center transition-all" title="My Events"><i class="fas fa-layer-group"></i></button>
      <button @click="$emit('openCalendar')" class="w-10 h-10 bg-[#F5F0E8]/80 text-[#9ca3af] hover:text-[#1C2340] rounded-full flex items-center justify-center transition-all" title="Open Calendar"><i class="far fa-calendar-alt"></i></button>
    </nav>
  </div>
</template>

<script setup>
import LogoMark from './LogoMark.vue';
import { computed } from 'vue';
import { store } from '../store.js';

defineEmits(['goBack', 'openCalendar']);

const initials = computed(() => {
  const username = store.user?.username || 'User';
  return username.slice(0, 2).toUpperCase();
});

function logout() {
  store.logout();
}
</script>
