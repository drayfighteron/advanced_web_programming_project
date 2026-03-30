<template>
  <div class="min-h-screen bg-[#F5F0E8] flex flex-col font-sans text-[#1C2340] relative pb-32">
    <header class="bg-white border-b border-[#e5e0d8] px-8 py-4 flex justify-between items-center z-10 shrink-0">
      <div>
        <div class="flex items-center gap-2 text-[13px] mb-1">
          <button @click="$emit('goBack')" class="text-[#9ca3af] hover:text-[#D4862A] font-semibold flex items-center gap-1 transition-colors">
            <i class="fas fa-arrow-left"></i> Back to Events
          </button>
          <span class="text-gray-300">/</span>
          <div class="flex items-center gap-1.5 font-medium text-[#1C2340]">
            <span>💫</span> {{ event?.title || 'Selected Event' }}
          </div>
        </div>
        <h1 class="text-2xl font-bold text-[#1C2340]">Event Preparation Board</h1>
      </div>
      
      <div class="flex items-center gap-6">
        <div class="text-[12px] font-bold text-[#6b7280]">
          Total Budget: <span class="text-[#1C2340]">${{ event?.budget?.toLocaleString() || '0' }}</span>
        </div>
        <div class="bg-[#F5F0E8] border border-[#e5e0d8] px-4 py-2 rounded-xl flex items-center gap-2.5">
          <span class="text-[10px] font-bold uppercase tracking-wider text-[#D4862A] flex items-center gap-1">🎯 Daily Focus</span>
          <input v-if="isEditingFocus" v-model="dailyFocus" @blur="isEditingFocus = false" @keyup.enter="isEditingFocus = false" class="text-[12px] font-semibold text-[#1C2340] bg-white border border-[#D4862A] rounded px-2 py-0.5 outline-none w-[150px]" autoFocus />
          <span v-else @click="isEditingFocus = true" class="text-[12px] font-semibold text-[#1C2340] cursor-pointer hover:text-[#D4862A] transition-colors border-b border-dashed border-transparent hover:border-[#D4862A]" title="Click to edit">
            {{ dailyFocus || 'Set a focus...' }}
          </span>
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
          <button @click="openTaskModal()" class="w-full p-2.5 bg-white border border-[#e5e0d8] text-[#1C2340] rounded-xl text-[12px] font-semibold mb-3 hover:border-[#D4862A] hover:text-[#D4862A] transition-colors shadow-sm">
            ➕ Add New Task
          </button>
          <draggable v-model="todoTasks" group="tasks" item-key="id" class="flex-1 overflow-y-auto space-y-3 pb-4 min-h-[150px] custom-scrollbar" ghost-class="opacity-40" @change="syncTaskStatuses">
            <template #item="{ element }">
              <TaskCard :task="element" @edit="openTaskModal(element)" />
            </template>
          </draggable>
        </div>

        <div class="flex flex-col w-[320px] max-h-full">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-2.5 h-2.5 rounded-full bg-[#60a5fa]"></div>
            <h3 class="text-[14px] font-bold text-[#1C2340]">Doing</h3>
            <span class="text-[11px] font-semibold text-[#9ca3af] bg-white px-2 py-0.5 rounded-[10px] border border-[#e5e0d8]">{{ doingTasks.length }}</span>
          </div>
          <draggable v-model="doingTasks" group="tasks" item-key="id" class="flex-1 overflow-y-auto space-y-3 pb-4 min-h-[150px] custom-scrollbar pt-[46px]" ghost-class="opacity-40" @change="syncTaskStatuses">
            <template #item="{ element }">
              <TaskCard :task="element" @edit="openTaskModal(element)" />
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
            <span class="text-[11px] font-bold text-[#D4862A] bg-white border border-[#e5e0d8] px-2 py-1 rounded-[10px]">
              ${{ totalSpent.toLocaleString() }} spent
            </span>
          </div>
          <draggable v-model="doneTasks" group="tasks" item-key="id" class="flex-1 overflow-y-auto space-y-3 pb-4 min-h-[150px] custom-scrollbar pt-[46px]" ghost-class="opacity-40" @change="syncTaskStatuses">
            <template #item="{ element }">
              <TaskCard :task="element" @edit="openTaskModal(element)" />
            </template>
          </draggable>
        </div>

      </div>
    </main>

    <nav class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white border border-[#e5e0d8] rounded-full px-6 py-3 flex items-center gap-6 shadow-xl z-50 text-[#1C2340]">
      <div class="flex items-center justify-center text-xl mr-2" title="EventSync">📅</div>

      <button @click="$emit('goBack')" class="w-10 h-10 bg-[#F5F0E8] text-[#9ca3af] hover:text-[#1C2340] rounded-full flex items-center justify-center transition-all" title="My Events">
        <i class="fas fa-layer-group"></i>
      </button>

      <button class="w-10 h-10 bg-[#D4862A] text-white rounded-full flex items-center justify-center shadow-lg -translate-y-1 transition-all" title="Task Dashboard">
        <i class="fas fa-tasks"></i>
      </button>
      
      <button @click="$emit('openCalendar')" class="w-10 h-10 bg-[#F5F0E8] text-[#9ca3af] hover:text-[#1C2340] rounded-full flex items-center justify-center transition-all" title="Open Calendar">
        <i class="far fa-calendar-alt"></i>
      </button>

      <div class="w-px h-6 bg-[#e5e0d8] mx-2"></div>
      <div class="w-8 h-8 rounded-full bg-[#1C2340] text-white text-[11px] font-bold flex items-center justify-center">JD</div>
    </nav>

    <div v-if="isTaskModalOpen" class="fixed inset-0 bg-[#1C2340]/50 flex items-center justify-center z-50 px-4">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md border border-[#e5e0d8] shadow-2xl">
        <h2 class="text-xl font-bold text-[#1C2340] mb-4">{{ isEditingTask ? 'Edit Task' : 'Add New Task' }}</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Title</label>
            <input v-model="currentTask.title" type="text" class="w-full border border-[#e5e0d8] rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:border-[#D4862A]" placeholder="Task Title" />
          </div>
          <div>
            <label class="block text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Description</label>
            <textarea v-model="currentTask.description" rows="2" class="w-full border border-[#e5e0d8] rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:border-[#D4862A]" placeholder="Task details..."></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Status</label>
              <select v-model="currentTask.status" class="w-full border border-[#e5e0d8] rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:border-[#D4862A] bg-white">
                <option>To Do</option>
                <option>Doing</option>
                <option>Done</option>
              </select>
            </div>
            <div>
              <label class="block text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Priority</label>
              <select v-model="currentTask.priority" class="w-full border border-[#e5e0d8] rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:border-[#D4862A] bg-white">
                <option>High Priority</option>
                <option>Medium Priority</option>
                <option>Low Priority</option>
                <option>Done</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Due Date</label>
              <input v-model="currentTask.dueDate" type="text" class="w-full border border-[#e5e0d8] rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:border-[#D4862A]" placeholder="e.g. July 1" />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Cost ($)</label>
              <input v-model.number="currentTask.cost" type="number" class="w-full border border-[#e5e0d8] rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:border-[#D4862A]" placeholder="0" />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Assignee</label>
              <input v-model="currentTask.assignee" type="text" class="w-full border border-[#e5e0d8] rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:border-[#D4862A]" placeholder="Name" />
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button @click="isTaskModalOpen = false" class="px-4 py-2 text-[12px] font-semibold text-[#9ca3af] hover:text-[#1C2340] transition-colors">Cancel</button>
          <button @click="saveTask" class="bg-[#D4862A] hover:bg-[#b57121] text-white px-4 py-2 rounded-xl text-[12px] font-bold transition-colors shadow-lg">Save Task</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import draggable from 'vuedraggable';
import TaskCard from './TaskCard.vue';
import { globalTasks } from '../store.js';

defineEmits(['goBack', 'openCalendar']);

const props = defineProps({
  event: { type: Object, default: null }
});

const dailyFocus = ref('Book the DJ');
const isEditingFocus = ref(false);

const todoTasks = ref([]);
const doingTasks = ref([]);
const doneTasks = ref([]);

watch(() => props.event, (newEvent) => {
  if (newEvent) {
    todoTasks.value = globalTasks.value.filter(t => t.eventId === newEvent.id && t.status === 'To Do');
    doingTasks.value = globalTasks.value.filter(t => t.eventId === newEvent.id && t.status === 'Doing');
    doneTasks.value = globalTasks.value.filter(t => t.eventId === newEvent.id && t.status === 'Done');
  }
}, { immediate: true });

const totalSpent = computed(() => {
  return doneTasks.value.reduce((sum, task) => sum + (Number(task.cost) || 0), 0);
});

const isTaskModalOpen = ref(false);
const isEditingTask = ref(false);
const currentTask = ref({});

function openTaskModal(task = null) {
  if (task) {
    isEditingTask.value = true;
    currentTask.value = { ...task }; 
  } else {
    isEditingTask.value = false;
    currentTask.value = { id: Date.now(), title: '', description: '', status: 'To Do', priority: 'Medium Priority', assignee: '', dueDate: '', cost: null, eventId: props.event.id };
  }
  isTaskModalOpen.value = true;
}

function syncToGlobalStore() {
  globalTasks.value = globalTasks.value.filter(t => t.eventId !== props.event.id);
  globalTasks.value.push(...todoTasks.value, ...doingTasks.value, ...doneTasks.value);
}

function saveTask() {
  if (!currentTask.value.title) return alert('Title is required');
  if (!currentTask.value.eventId) currentTask.value.eventId = props.event.id;
  
  todoTasks.value = todoTasks.value.filter(t => t.id !== currentTask.value.id);
  doingTasks.value = doingTasks.value.filter(t => t.id !== currentTask.value.id);
  doneTasks.value = doneTasks.value.filter(t => t.id !== currentTask.value.id);

  if (currentTask.value.status === 'To Do') todoTasks.value.unshift({ ...currentTask.value });
  else if (currentTask.value.status === 'Doing') doingTasks.value.unshift({ ...currentTask.value });
  else if (currentTask.value.status === 'Done') doneTasks.value.unshift({ ...currentTask.value });

  syncToGlobalStore();
  isTaskModalOpen.value = false;
}

function syncTaskStatuses() {
  todoTasks.value.forEach(task => task.status = 'To Do');
  doingTasks.value.forEach(task => task.status = 'Doing');
  doneTasks.value.forEach(task => task.status = 'Done');
  syncToGlobalStore();
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #9ca3af; }
</style>