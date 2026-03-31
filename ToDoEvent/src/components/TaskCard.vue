<template>
  <div 
    class="relative bg-white rounded-[10px] border border-[#e5e0d8] p-3 mb-2 transition-all duration-200 hover:shadow-[0_4px_14px_rgba(28,35,64,0.1)] hover:-translate-y-[1px] cursor-grab active:cursor-grabbing group"
    :class="{ 'opacity-85': task.status === 'Done' }"
  >
    
    <button 
      @click.stop="$emit('edit', task)" 
      class="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-[#F5F0E8] rounded-md text-[#D4862A] hover:bg-[#e5e0d8] transition-colors"
      title="Edit Task"
    >
      <i class="fas fa-pencil-alt text-[10px]"></i>
    </button>

    <h4 
      class="text-[13px] font-semibold text-[#1C2340] mb-1.5 pr-8"
      :class="{ 'line-through text-[#9ca3af]': task.status === 'Done' }"
    >
      {{ task.title }}
    </h4>
    
    <p v-if="task.description" class="text-[11px] text-[#9ca3af] leading-relaxed mb-2 line-clamp-2">
      {{ task.description }}
    </p>

    <span 
      class="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mb-1.5"
      :class="priorityClasses"
    >
      {{ task.priority }}
    </span>

    <div class="flex items-center justify-between mt-2">
      <span class="text-[10px] text-[#9ca3af] flex items-center gap-1">
        💫 {{ task.dueDate || 'No Date' }}
        <strong v-if="task.cost" class="font-semibold text-[#1C2340] ml-1">${{ task.cost }}</strong>
      </span>
      
      <div v-if="task.assignee" class="flex items-center gap-1 text-[10px] text-[#6b7280]">
        <span class="w-5 h-5 rounded-full text-white text-[8px] font-bold flex items-center justify-center" :style="{ backgroundColor: assigneeColor }">
          {{ assigneeInitials }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

defineEmits(['edit']);

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
});

const priorityClasses = computed(() => {
  if (props.task.priority === 'High Priority' || props.task.priority === 'High') return 'bg-[#fee2e2] text-[#b91c1c]';
  if (props.task.priority === 'Medium Priority' || props.task.priority === 'Medium') return 'bg-[#ffedd5] text-[#c2410c]';
  if (props.task.priority === 'Done' || props.task.priority === 'Low') return 'bg-[#dcfce7] text-[#15803d]';
  return 'bg-slate-100 text-slate-600';
});

const assigneeInitials = computed(() => {
  return props.task.assignee ? props.task.assignee.charAt(0).toUpperCase() : '?';
});

const assigneeColor = computed(() => {
  const colors = {
    'Rayan': '#D4862A',
    'Zakari': '#4A7C59',
    'Ismaël': '#C85A5A',
    'Pierre-A.': '#2E3A5C',
    'Nicolas': '#7C5CBF'
  };
  return colors[props.task.assignee] || '#94a3b8';
});
</script>