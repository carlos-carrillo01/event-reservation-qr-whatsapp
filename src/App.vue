<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useReservations } from './composables/useReservations';

const { loadReservations } = useReservations();

onMounted(() => {
  loadReservations();
});
</script>