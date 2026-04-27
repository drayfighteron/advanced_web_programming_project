import { createRouter, createWebHistory } from 'vue-router';

// The project keeps page rendering in App.vue, while Vue Router handles clean URLs.
const PlaceholderView = { template: '<div />' };

const routes = [
  { path: '/', redirect: '/events' },
  { path: '/login', name: 'login', component: PlaceholderView },
  { path: '/events', name: 'events', component: PlaceholderView },
  { path: '/events/:id/:slug?', name: 'event-detail', component: PlaceholderView },
  { path: '/calendar', name: 'calendar', component: PlaceholderView },
  { path: '/profile', name: 'profile', component: PlaceholderView },
  { path: '/:pathMatch(.*)*', redirect: '/events' }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
