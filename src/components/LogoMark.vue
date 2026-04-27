<template>
  <div :class="wrapperClass" title="MyEvents">
    <span :class="iconClass">
      <i class="fas fa-calendar-check"></i>
    </span>
    <span v-if="showText" :class="textClass">My<span class="text-[#D4862A]">Events</span></span>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  variant: {
    type: String,
    default: 'icon'
  }
});

const showText = computed(() => ['header', 'headerDark', 'nav'].includes(props.variant));

const wrapperClass = computed(() => {
  if (props.variant === 'header') {
    return 'inline-flex items-center gap-3';
  }
  if (props.variant === 'headerDark') {
    return 'inline-flex items-center gap-3';
  }
  if (props.variant === 'nav') {
    return 'inline-flex items-center gap-2 bg-white/55 border border-white/70 rounded-2xl px-3 py-2 overflow-hidden shrink-0';
  }
  return 'w-10 h-10 rounded-full bg-[#F5F0E8]/80 border border-[#e5e0d8] flex items-center justify-center overflow-hidden shrink-0';
});

const iconClass = computed(() => {
  if (props.variant === 'headerDark') {
    return 'w-10 h-10 rounded-2xl bg-[#D4862A] text-white flex items-center justify-center text-base font-black shadow-lg';
  }
  if (props.variant === 'header') {
    return 'w-10 h-10 rounded-2xl bg-[#1C2340] text-white flex items-center justify-center text-base font-black shadow-lg';
  }
  if (props.variant === 'nav') {
    return 'w-7 h-7 rounded-xl bg-[#1C2340] text-white flex items-center justify-center text-xs font-black';
  }
  return 'text-[#D4862A] text-lg font-black';
});

const textClass = computed(() => {
  if (props.variant === 'headerDark') {
    return 'text-[32px] leading-none font-semibold text-white';
  }
  if (props.variant === 'header') {
    return 'text-[32px] leading-none font-semibold text-[#1C2340]';
  }
  return 'text-lg leading-none font-semibold text-[#1C2340]';
});
</script>
