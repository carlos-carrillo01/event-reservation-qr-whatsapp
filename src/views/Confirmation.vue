<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <div v-if="reservation" class="card text-center animate-fade-in">
        <!-- Success Icon -->
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span class="text-4xl">✅</span>
        </div>

        <!-- Title -->
        <h1 class="text-3xl font-bold text-gray-900 mb-2">¡Reserva Confirmada!</h1>
        <p class="text-lg text-gray-600 mb-8">Tu código QR está listo</p>

        <!-- WhatsApp Status -->
        <div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div class="flex items-center justify-center gap-2 mb-2">
            <span class="text-green-600">📱</span>
            <p class="text-green-800 font-medium">Confirmación enviada por WhatsApp</p>
          </div>
          <p class="text-green-700 text-sm">
            Se ha abierto WhatsApp con tu confirmación de reserva lista para enviar al número {{ reservation.whatsappPhone }}
          </p>
        </div>

        <!-- Reservation Details -->
        <div class="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Detalles de la Reserva</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div>
              <p class="text-sm text-gray-600">Código:</p>
              <p class="font-semibold text-lg">{{ reservation.code }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Evento:</p>
              <p class="font-semibold">{{ reservation.eventName }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Fecha:</p>
              <p class="font-semibold">{{ formatDate(reservation.date) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Hora:</p>
              <p class="font-semibold">{{ reservation.time }}</p>
            </div>
            <div class="md:col-span-2">
              <p class="text-sm text-gray-600">Nombre:</p>
              <p class="font-semibold">{{ reservation.fullName }}</p>
            </div>
            <div class="md:col-span-2">
              <p class="text-sm text-gray-600">WhatsApp:</p>
              <p class="font-semibold">{{ reservation.whatsappPhone }}</p>
            </div>
          </div>
        </div>

        <!-- QR Code -->
        <div v-if="reservation.qrCode" class="mb-8">
          <div class="bg-white p-6 rounded-lg shadow-lg border-2 border-gray-200 inline-block">
            <img
              :src="reservation.qrCode"
              alt="Código QR de Reserva"
              class="mx-auto mb-4"
            />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mt-4 mb-2">Código QR de Reserva</h3>
          <p class="text-gray-600">Presenta este código en tu cita</p>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            @click="sendToWhatsApp"
            class="btn-success flex items-center justify-center gap-2"
          >
            📱 Reenviar por WhatsApp
          </button>
          
          <button
            @click="goHome"
            class="btn-primary flex items-center justify-center gap-2"
          >
            🎫 Nueva Reserva
          </button>
        </div>

        <!-- Additional Info -->
        <div class="mt-8 p-4 bg-blue-50 rounded-lg">
          <p class="text-sm text-gray-700">
            <strong>💡 Consejo:</strong> Guarda una captura de pantalla de este código QR 
            y también úsalo a través de WhatsApp para tener fácil acceso el día del evento.
          </p>
        </div>

        <!-- WhatsApp Instructions -->
        <div class="mt-4 p-4 bg-yellow-50 rounded-lg">
          <p class="text-sm text-gray-700">
            <strong>📱 ¿No se abrió WhatsApp?</strong> Puedes reenviar la confirmación usando el botón "Reenviar por WhatsApp" 
            o buscar tu reserva en la sección "Mis Reservas".
          </p>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else-if="loading" class="card text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <p class="text-gray-600">Cargando reserva...</p>
      </div>

      <!-- Error State -->
      <div v-else class="card text-center">
        <div class="text-6xl mb-4">❌</div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Reserva no encontrada</h1>
        <p class="text-gray-600 mb-6">No se pudo encontrar la reserva solicitada.</p>
        <button @click="goHome" class="btn-primary">
          🏠 Volver al inicio
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useReservations } from '../composables/useReservations';
import type { Reservation } from '../types';

const router = useRouter();
const { reservations, sendToWhatsApp: sendWhatsApp } = useReservations();

const props = defineProps<{
  reservationId: string;
}>();

const loading = ref(true);

const reservation = computed((): Reservation | null => {
  return reservations.value.find(r => r.id === props.reservationId) || null;
});

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const sendToWhatsApp = () => {
  if (reservation.value) {
    sendWhatsApp(reservation.value, true);
  }
};

const goHome = () => {
  router.push({ name: 'Home' });
};

onMounted(() => {
  // Simulate loading delay
  setTimeout(() => {
    loading.value = false;
  }, 1000);
});
</script>