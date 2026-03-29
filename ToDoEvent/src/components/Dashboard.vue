<template>
  <div class="min-h-screen bg-[#F5F0E8] flex flex-col font-sans text-[#1C2340] relative pb-32">
    
    <header class="bg-white border-b border-[#e5e0d8] px-8 py-4 flex flex-col gap-4 z-10 shrink-0">
      
      <div class="flex items-center gap-2 text-[13px]">
        <button @click="$emit('goBack')" class="text-[#9ca3af] hover:text-[#D4862A] font-semibold flex items-center gap-1 transition-colors">
          <i class="fas fa-arrow-left"></i> Back to Events
        </button>
        <span class="text-gray-300">/</span>
        <div class="flex items-center gap-1.5">
          <span>📅</span>
          <span class="font-medium text-[#1C2340]">Tech Conference 2026</span>
        </div>
      </div>

      <div class="flex justify-between items-end">
        <h1 class="text-2xl font-bold text-[#1C2340]">Event Preparation Board</h1>
        
        <div class="bg-[#F5F0E8] border border-[#e5e0d8] px-4 py-2 rounded-xl flex items-center gap-2.5">
          <span class="text-[10px] font-bold uppercase tracking-wider text-[#D4862A] flex items-center gap-1">⭐ Daily Focus</span>
          <span class="text-[12px] font-semibold text-[#1C2340]">Book the DJ</span>
        </div>
      </div>
    </header>

    <main class="flex-1 overflow-x-auto p-8 flex items-start">
      
      <div class="flex gap-6 h-full">
        
        <div class="flex flex-col w-[320px] max-h-full">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-2.5 h-2.5 rounded-full bg-[#94a3b8]"></div>
            <h3 class="text-[14px] font-bold text-[#1C2340]">To Do</h3>
            <span class="text-[11px] font-semibold text-[#9ca3af] bg-white px-2 py-0.5 rounded-[10px] border border-[#e5e0d8]">{{ todoTasks.length }}</span>
          </div>
          
          <button class="w-full p-2.5 bg-white border border-[#e5e0d8] text-[#1C2340] rounded-xl text-[12px] font-semibold mb-3 hover:border-[#D4862A] hover:text-[#D4862A] transition-colors shadow-sm">
            ＋ Add New Task
          </button>
          
          <draggable v-model="todoTasks" group="tasks" item-key="id" class="flex-1 overflow-y-auto space-y-3 pb-4 min-h-[150px] custom-scrollbar" ghost-class="opacity-40">
            <template #item="{ element }">
              <TaskCard :task="element" />
            </template>
          </draggable>
        </div>

        <div class="flex flex-col w-[320px] max-h-full">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-2.5 h-2.5 rounded-full bg-[#60a5fa]"></div>
            <h3 class="text-[14px] font-bold text-[#1C2340]">Doing</h3>
            <span class="text-[11px] font-semibold text-[#9ca3af] bg-white px-2 py-0.5 rounded-[10px] border border-[#e5e0d8]">{{ doingTasks.length }}</span>
          </div>
          
          <draggable v-model="doingTasks" group="tasks" item-key="id" class="flex-1 overflow-y-auto space-y-3 pb-4 min-h-[150px] custom-scrollbar pt-[46px]" ghost-class="opacity-40">
            <template #item="{ element }">
              <TaskCard :task="element" />
            </template>
          </draggable>
        </div>

        <div class="flex flex-col w-[320px] max-h-full">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <div class="w-2.5 h-2.5 rounded-full bg-[#34d399]"></div>
              <h3 class="text-[14px] font-bold text-[#1C2340]">Done</h3>
              <span class="text-[11px] font-semibold text-[#9ca3af] bg-white px-2 py-0.5 rounded-[10px] border border-[#e5e0d8]">{{ doneTasks.length }}</span>
            </div>
            <span class="text-[11px] font-bold text-[#D4862A] bg-white border border-[#e5e0d8] px-2 py-1 rounded-[10px]">$5,000 spent</span>
          </div>
          
          <draggable v-model="doneTasks" group="tasks" item-key="id" class="flex-1 overflow-y-auto space-y-3 pb-4 min-h-[150px] custom-scrollbar pt-[46px]" ghost-class="opacity-40">
            <template #item="{ element }">
              <TaskCard :task="element" />
            </template>
          </draggable>
        </div>

      </div>
    </main>

    <nav class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1C2340] rounded-full px-6 py-3 flex items-center gap-6 shadow-[0_20px_40px_rgba(28,35,64,0.3)] z-50">
      <div class="flex items-center justify-center text-xl mr-2" title="EventSync">📅</div>
      
      <button @click="$emit('goBack')" class="w-10 h-10 bg-[#D4862A] text-white rounded-full flex items-center justify-center shadow-lg hover:-translate-y-1 transition-transform" title="My Events">
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
    </nav>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import draggable from 'vuedraggable';
import TaskCard from './TaskCard.vue';
import { mockTasks } from '../data/mockData.js';

const emit = defineEmits(['goBack']);

// Initialize the reactive arrays by filtering the mock data
const todoTasks = ref(mockTasks.filter(t => t.status === 'To Do'));
const doingTasks = ref(mockTasks.filter(t => t.status === 'Doing'));
const doneTasks = ref(mockTasks.filter(t => t.status === 'Done'));
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #9ca3af; }
</style>