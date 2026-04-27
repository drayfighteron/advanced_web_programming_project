<template>
  <Login v-if="route.name === 'login' || !store.user" />

  <div v-else class="min-h-screen w-full flex flex-col">
    <EventOverview
      v-if="route.name === 'events'"
      @selectEvent="goToDashboard"
      @openCalendar="goToCalendar"
      @openProfile="goToProfile"
    />

    <Dashboard
      v-else-if="route.name === 'event-detail'"
      :event="selectedEvent"
      @goBack="goToEvents"
      @openCalendar="goToCalendar"
      @openProfile="goToProfile"
      @eventUpdated="handleEventUpdated"
    />

    <CalendarView
      v-else-if="route.name === 'calendar'"
      @goBack="goToEvents"
      @selectEvent="goToDashboard"
      @openProfile="goToProfile"
    />

    <Profile
      v-else-if="route.name === 'profile'"
      @goBack="goToEvents"
      @openCalendar="goToCalendar"
    />

    <div v-if="showErrorModal" class="fixed inset-0 bg-[#1C2340]/50 flex items-center justify-center z-[100] px-4">
      <div class="bg-white rounded-2xl p-6 w-full max-w-sm border border-[#e5e0d8] shadow-2xl text-center">
        <div class="w-12 h-12 bg-[#F5F0E8] text-[#D4862A] rounded-full flex items-center justify-center mx-auto mb-4 text-xl">⚠️</div>
        <h3 class="text-lg font-bold text-[#1C2340] mb-2">No Event Selected</h3>
        <p class="text-[13px] text-[#9ca3af] mb-6">Please select an event first to view its tasks.</p>
        <button @click="closeErrorModal" class="w-full bg-[#D4862A] hover:bg-[#b57121] text-white py-2.5 rounded-xl text-[13px] font-bold transition-colors shadow-lg">Go to Events</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, watch, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { store } from './store.js';
import Login from './components/Login.vue';
import EventOverview from './components/EventOverview.vue';
import Dashboard from './components/Dashboard.vue';
import CalendarView from './components/CalendarView.vue';
import Profile from './components/Profile.vue';

const route = useRoute();
const router = useRouter();
const showErrorModal = ref(false);

// Resolve the selected event from the URL id, so refresh/direct links still work.
const selectedEvent = computed(() => {
  if (route.name !== 'event-detail') return null;
  return store.events.find((item) => Number(item.id) === Number(route.params.id)) || null;
});

onMounted(async () => {
  window.addEventListener('myevents:auth-expired', handleAuthExpired);
  if (store.user) {
    const hasSession = await store.checkSession();
    if (hasSession && route.name === 'login') goToEvents(true);
    return;
  }
  if (route.name !== 'login') router.replace({ name: 'login' });
});

onUnmounted(() => {
  window.removeEventListener('myevents:auth-expired', handleAuthExpired);
});

watch(
  () => store.user,
  async (user) => {
    if (!user) {
      if (route.name !== 'login') router.replace({ name: 'login' });
      return;
    }
    await store.fetchEvents();
    await store.fetchAllTasks();
    if (route.name === 'login') goToEvents(true);
  }
);

watch(
  () => route.fullPath,
  async () => {
    showErrorModal.value = false;
    if (!store.user && route.name !== 'login') {
      router.replace({ name: 'login' });
      return;
    }
    if (store.user && route.name === 'login') {
      goToEvents(true);
      return;
    }
    if (store.user && route.name === 'event-detail') {
      if (!store.events.length) await store.fetchEvents();
      if (!selectedEvent.value) {
        showErrorModal.value = true;
        goToEvents(true);
      }
    }
  }
);

// Used only to make event detail URLs readable, for example /events/3-wedding-planning.
function slugify(value) {
  return String(value || 'event').toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'event';
}
function goToEvents(replace = false) {
  const method = replace ? router.replace : router.push;
  method({ name: 'events' });
}
function goToCalendar(replace = false) {
  const method = replace ? router.replace : router.push;
  method({ name: 'calendar' });
}
function goToProfile(replace = false) {
  const method = replace ? router.replace : router.push;
  method({ name: 'profile' });
}
function goToDashboard(event, replace = false) {
  const method = replace ? router.replace : router.push;
  method({ name: 'event-detail', params: { id: event.id, slug: slugify(event.title) } });
}
function handleEventUpdated(updatedEvent) {
  const event = store.events.find((item) => Number(item.id) === Number(updatedEvent.id));
  if (route.name === 'event-detail' && event) goToDashboard(event, true);
}
function handleAuthExpired() {
  localStorage.setItem('myevents_auth_message', 'Your session expired. Please log in again.');
  store.clearSession();
  router.replace({ name: 'login' });
}
function closeErrorModal() {
  showErrorModal.value = false;
  goToEvents(true);
}
</script>

<style>
html,
body,
#app {
  margin: 0;
  padding: 0;
  min-height: 100%;
  background-color: #F5F0E8;
}
body { overflow-y: auto; }
</style>
