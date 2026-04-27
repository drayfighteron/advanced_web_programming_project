<script setup>
import { computed, ref, watch } from 'vue';
import { store } from '../store';
import LogoMark from './LogoMark.vue';

const username = ref('');
const password = ref('');
const errorMsg = ref(localStorage.getItem('myevents_auth_message') || '');
localStorage.removeItem('myevents_auth_message');
const fieldErrors = ref({});
const isRegistering = ref(false);
const isSubmitting = ref(false);

const pageTitle = computed(() => (isRegistering.value ? 'Create your account' : 'Welcome back'));
const submitLabel = computed(() => (isRegistering.value ? 'Create Account' : 'Sign In'));
const helperText = computed(() => (
  isRegistering.value
    ? 'Create an account to organize events, track tasks, and keep your schedule in one place.'
    : 'Sign in to manage your events, tasks, and calendar securely.'
));

watch(isRegistering, () => {
  errorMsg.value = '';
  fieldErrors.value = {};
  password.value = '';
});

function validateForm() {
  const errors = {};
  const cleanUsername = username.value.trim();

  if (!cleanUsername) {
    errors.username = 'Username is required.';
  } else if (cleanUsername.length < 3) {
    errors.username = 'Username must be at least 3 characters.';
  } else if (cleanUsername.length > 30) {
    errors.username = 'Username must be 30 characters or fewer.';
  } else if (!/^[a-zA-Z0-9_-]+$/.test(cleanUsername)) {
    errors.username = 'Username can only use letters, numbers, underscores, and hyphens.';
  }

  if (!password.value) {
    errors.password = 'Password is required.';
  } else if (password.value.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }

  fieldErrors.value = errors;
  return Object.keys(errors).length === 0;
}

function readableAuthError(err) {
  const message = err.response?.data?.error || '';
  if (message.toLowerCase().includes('invalid credentials')) {
    return 'Username or password is incorrect.';
  }
  if (message.toLowerCase().includes('already taken')) {
    return 'That username is already taken. Please choose another one.';
  }
  return message || 'Unable to complete the request. Please try again.';
}

const handleSubmit = async () => {
  errorMsg.value = '';

  if (!validateForm()) return;

  isSubmitting.value = true;
  try {
    if (isRegistering.value) {
      await store.register(username.value, password.value);
    } else {
      await store.login(username.value, password.value);
    }
  } catch (err) {
    errorMsg.value = readableAuthError(err);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-[#F5F0E8] font-sans flex items-center justify-center px-4 py-10">
    <div class="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[1.15fr_440px] bg-white rounded-[32px] border border-[#e5e0d8] shadow-2xl overflow-hidden">
      <section class="hidden lg:flex bg-[#1C2340] text-white p-12 flex-col justify-between relative overflow-hidden min-h-[720px]">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(212,134,42,0.18),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.08),_transparent_26%),radial-gradient(circle_at_78%_20%,_rgba(212,134,42,0.18),_transparent_16%)]"></div>
        <div class="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-white/6"></div>
        <div class="absolute top-20 right-20 w-44 h-44 rounded-full bg-[#D4862A]/18 border border-white/10"></div>

        <div class="relative z-10">
          <LogoMark variant="headerDark" />
          <div class="mt-16 max-w-xl">
            <p class="text-[12px] uppercase tracking-[0.22em] text-white/55 font-bold mb-4">Event management workspace</p>
            <h1 class="text-5xl leading-tight font-bold">Plan real events, track tasks, and stay organized.</h1>
            <p class="text-white/72 text-[16px] leading-8 mt-6 max-w-lg">
              Manage multiple events, assign tasks, track progress through To Do, Doing, and Done, and keep everything connected to your calendar.
            </p>
          </div>
        </div>

        <div class="relative z-10 grid grid-cols-3 gap-4">
          <div class="rounded-3xl border border-white/10 bg-white/8 backdrop-blur-sm p-5">
            <p class="text-[10px] uppercase tracking-[0.18em] text-white/55 font-bold">Feature</p>
            <p class="text-lg font-semibold mt-3">Event Planning</p>
            <p class="text-[12px] text-white/65 leading-5 mt-2">Create and organize multiple real-world events.</p>
          </div>
          <div class="rounded-3xl border border-white/10 bg-white/8 backdrop-blur-sm p-5">
            <p class="text-[10px] uppercase tracking-[0.18em] text-white/55 font-bold">Feature</p>
            <p class="text-lg font-semibold mt-3">Task Tracking</p>
            <p class="text-[12px] text-white/65 leading-5 mt-2">Move tasks between To Do, Doing, and Done.</p>
          </div>
          <div class="rounded-3xl border border-white/10 bg-white/8 backdrop-blur-sm p-5">
            <p class="text-[10px] uppercase tracking-[0.18em] text-white/55 font-bold">Feature</p>
            <p class="text-lg font-semibold mt-3">Calendar View</p>
            <p class="text-[12px] text-white/65 leading-5 mt-2">Follow due dates and schedules in one place.</p>
          </div>
        </div>
      </section>

      <section class="p-8 sm:p-10 lg:p-12 flex flex-col justify-center bg-[#FCFBF8]">
        <div class="mb-10">
          <LogoMark variant="header" />
        </div>

        <div class="mb-8">
          <h2 class="text-4xl font-bold text-[#1C2340]">{{ pageTitle }}</h2>
          <p class="text-[14px] text-[#8f98a8] mt-3 leading-7">{{ helperText }}</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-5" novalidate>
          <div>
            <label for="username" class="block text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1.5">Username</label>
            <input
              id="username"
              v-model="username"
              type="text"
              autocomplete="username"
              class="w-full border rounded-2xl px-5 py-4 text-[15px] focus:outline-none transition-colors bg-[#F5F0E8]"
              :class="fieldErrors.username ? 'border-red-400 focus:border-red-500' : 'border-[#e5e0d8] focus:border-[#D4862A]'"
              placeholder="Enter your username"
              @input="fieldErrors.username = ''"
            />
            <p v-if="fieldErrors.username" class="text-red-500 text-[12px] mt-1.5">{{ fieldErrors.username }}</p>
          </div>

          <div>
            <label for="password" class="block text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1.5">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              autocomplete="current-password"
              class="w-full border rounded-2xl px-5 py-4 text-[15px] focus:outline-none transition-colors bg-[#F5F0E8]"
              :class="fieldErrors.password ? 'border-red-400 focus:border-red-500' : 'border-[#e5e0d8] focus:border-[#D4862A]'"
              placeholder="At least 6 characters"
              @input="fieldErrors.password = ''"
            />
            <p v-if="fieldErrors.password" class="text-red-500 text-[12px] mt-1.5">{{ fieldErrors.password }}</p>
          </div>

          <div v-if="errorMsg" class="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-red-600 text-[13px]">
            {{ errorMsg }}
          </div>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full bg-[#D4862A] hover:bg-[#b57121] disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 rounded-2xl text-[15px] font-bold transition-all shadow-lg hover:-translate-y-0.5"
          >
            {{ isSubmitting ? 'Please wait...' : submitLabel }}
          </button>
        </form>

        <button
          type="button"
          @click="isRegistering = !isRegistering"
          class="w-full mt-6 text-[14px] font-semibold text-[#1C2340] hover:text-[#D4862A] transition-colors"
        >
          {{ isRegistering ? 'Already have an account? Sign in' : "Don't have an account? Create one" }}
        </button>
      </section>
    </div>
  </div>
</template>
