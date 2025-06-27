import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Confirmation from '../views/Confirmation.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/confirmation/:reservationId',
    name: 'Confirmation',
    component: Confirmation,
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;