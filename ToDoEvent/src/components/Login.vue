<template>
  <div class="min-h-screen bg-[#F5F0E8] flex items-center justify-center p-4 font-sans">
    <div class="bg-white rounded-[20px] shadow-[0_20px_60px_rgba(28,35,64,0.08)] p-10 w-full max-w-[420px] border border-[#e5e0d8]">
      
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-[#1C2340] flex items-center justify-center gap-2 mb-2">
          EventSync <span class="text-2xl">💫</span>
        </h1>
        <p class="text-[13px] text-[#6b7280]">Secure Event Management Platform</p>
      </div>

      <div class="flex rounded-xl overflow-hidden border border-[#e5e0d8] mb-6">
        <button class="flex-1 py-2.5 text-[13px] font-semibold bg-[#1C2340] text-white">Sign In</button>
        <button class="flex-1 py-2.5 text-[13px] font-semibold bg-white text-[#6b7280] hover:bg-[#F5F0E8] transition-colors">Create Account</button>
      </div>

      <form @submit.prevent="$emit('login')" class="space-y-4">
        <div>
          <label class="block text-[11px] font-bold text-[#1C2340] uppercase tracking-wider mb-1.5">Email</label>
          <input type="email" value="john.doe@eventsync.ca" class="w-full bg-[#F5F0E8] border border-[#e5e0d8] rounded-xl px-4 py-3 text-[14px] text-[#1C2340] focus:outline-none focus:border-[#D4862A] transition-colors" />
        </div>
        
        <div>
          <label class="block text-[11px] font-bold text-[#1C2340] uppercase tracking-wider mb-1.5">Password</label>
          <input type="password" value="••••••••" class="w-full bg-[#F5F0E8] border border-[#e5e0d8] rounded-xl px-4 py-3 text-[14px] text-[#1C2340] focus:outline-none focus:border-[#D4862A] transition-colors" />
        </div>

        <button type="submit" class="w-full bg-[#1C2340] hover:bg-[#2E3A5C] text-white font-semibold rounded-xl py-3 text-[14px] transition-all transform hover:-translate-y-0.5 mt-2 shadow-lg shadow-[#1C2340]/20">
          Sign In
        </button>
      </form>

      <div class="mt-6 text-center text-[11px] text-[#9ca3af] flex items-center justify-center gap-1.5">
        🔒 Secure connection · All data encrypted
      </div>
      
      <div class="mt-6 pt-6 border-t border-[#e5e0d8] text-center">
        <p class="text-[11px] text-[#9ca3af] mb-1">Milestone 2 Demo — any credentials accepted</p>
        <button @click="$emit('login')" class="text-[12px] text-[#D4862A] font-semibold hover:underline">Fill demo credentials</button>
      </div>
    </div>
  </div>
</template>

<script setup>
// No complex logic needed here yet, we just emit an event to the parent App.vue when they click login
defineEmits(['login']);
</script>