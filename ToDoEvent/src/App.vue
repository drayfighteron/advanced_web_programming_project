<template>
  <Login 
    v-if="!isAuthenticated" 
    @login="handleLogin" 
  />

  <div v-else class="h-screen w-full flex flex-col">
    
    <EventOverview 
      v-if="currentView === 'events'" 
      @selectEvent="goToDashboard" 
      @openCalendar="currentView = 'calendar'"
      @openDashboard="goToActiveDashboard"
    />

    <Dashboard 
      v-else-if="currentView === 'dashboard'" 
      :event="selectedEvent" 
      @goBack="currentView = 'events'" 
      @openCalendar="currentView = 'calendar'"
    />

    <CalendarView 
      v-else-if="currentView === 'calendar'" 
      @goBack="currentView = 'events'"
      @selectEvent="goToDashboard"
      @openDashboard="goToActiveDashboard"
    />

    <div v-if="showErrorModal" class="fixed inset-0 bg-[#1C2340]/50 flex items-center justify-center z-[100] px-4">
      <div class="bg-white rounded-2xl p-6 w-full max-w-sm border border-[#e5e0d8] shadow-2xl text-center">
        <div class="w-12 h-12 bg-[#F5F0E8] text-[#D4862A] rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
          ⚠️
        </div>
        <h3 class="text-lg font-bold text-[#1C2340] mb-2">No Event Selected</h3>
        <p class="text-[13px] text-[#9ca3af] mb-6">Please select an event from the Events Overview first to view its tasks!</p>
        <button @click="closeErrorModal" class="w-full bg-[#D4862A] hover:bg-[#b57121] text-white py-2.5 rounded-xl text-[13px] font-bold transition-colors shadow-lg">
          Go to Events
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import Login from './components/Login.vue';
import EventOverview from './components/EventOverview.vue';
import Dashboard from './components/Dashboard.vue';
import CalendarView from './components/CalendarView.vue';

const isAuthenticated = ref(false);
const currentView = ref('events');
const selectedEvent = ref(null);
const showErrorModal = ref(false);

function handleLogin() {
  isAuthenticated.value = true;
  currentView.value = 'events';
}

function goToDashboard(event) {
  selectedEvent.value = event;
  currentView.value = 'dashboard';
}

function goToActiveDashboard() {
  if (selectedEvent.value) {
    currentView.value = 'dashboard';
  } else {
    showErrorModal.value = true;
  }
}

function closeErrorModal() {
  showErrorModal.value = false;
  currentView.value = 'events';
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
  background-color: #F5F0E8; 
}
</style>