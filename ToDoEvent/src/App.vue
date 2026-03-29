<template>
  <div>
    <Login 
      v-if="currentScreen === 'login'" 
      @login="currentScreen = 'overview'" 
    />
    
    <EventOverview 
      v-else-if="currentScreen === 'overview'" 
      @logout="currentScreen = 'login'"
      @selectEvent="goToKanban" 
    />
    
    <Dashboard 
      v-else-if="currentScreen === 'kanban'" 
      @goBack="currentScreen = 'overview'"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Login from './components/Login.vue';
import EventOverview from './components/EventOverview.vue';
import Dashboard from './components/Dashboard.vue';

// Manages the state of our app: 'login', 'overview', or 'kanban'
const currentScreen = ref('login');

function goToKanban(eventData) {
  // In a real app, you would pass the eventData ID to the Dashboard so it loads the right tasks.
  // For now, we just switch screens!
  currentScreen.value = 'kanban';
}
</script>