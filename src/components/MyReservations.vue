<template>
  <div class="card animate-slide-up">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Mis Reservas</h2>
      <div class="text-sm text-gray-500">
        Total: {{ stats.total }} | Confirmadas: {{ stats.confirmed }}
      </div>
    </div>

    <!-- Buscador por email -->
    <div class="mb-6">
      <label class="form-label">Buscar por email</label>
      <input
        v-model="searchEmail"
        type="email"
        class="form-input"
        placeholder="Ingresa tu email para ver tus reservas"
        @input="searchReservations"
      />
    </div>

    <!-- Lista de reservas -->
    <div v-if="filteredReservations.length > 0" class="space-y-4">
      <div
        v-for="reservation in filteredReservations"
        :key="reservation.id"
        class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between mb-3">
          <div>
            <h3 class="font-semibold text-gray-900">{{ reservation.eventName }}</h3>
            <p class="text-sm text-gray-600">{{ reservation.code }}</p>
          </div>
          <span
            :class="[
              'status-badge',
              reservation.status === 'confirmed' ? 'status-confirmed' : 'status-pending'
            ]"
          >
            {{ getStatusText(reservation.status) }}
          </span>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
          <div class="flex items-center gap-1">
            <span>📅</span>
            <span>{{ formatDate(reservation.date) }}</span>
          </div>
          <div class="flex items-center gap-1">
            <span>⏰</span>
            <span>{{ reservation.time }}</span>
          </div>
          <div class="flex items-center gap-1">
            <span>👤</span>
            <span>{{ reservation.fullName }}</span>
          </div>
          <div class="flex items-center gap-1">
            <span>📧</span>
            <span>{{ reservation.email }}</span>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button
            @click="sendToWhatsApp(reservation)"
            class="btn-success text-sm py-2 px-4 flex items-center gap-2"
          >
            📱 Reenviar por WhatsApp
          </button>
          
          <button
            @click="viewReservation(reservation)"
            class="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            Ver detalles
          </button>

          <button
            v-if="reservation.status === 'confirmed'"
            @click="cancelReservation(reservation.id)"
            class="text-red-600 hover:text-red-700 text-sm font-medium ml-auto"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>

    <!-- Estado vacío -->
    <div v-else-if="searchEmail" class="text-center py-12">
      <div class="text-6xl mb-4">📅</div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No se encontraron reservas</h3>
      <p class="text-gray-600">No hay reservas asociadas a este email.</p>
    </div>

    <div v-else class="text-center py-12">
      <div class="text-6xl mb-4">🎫</div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Ingresa tu email</h3>
      <p class="text-gray-600">Para ver tus reservas, ingresa tu email en el campo de arriba.</p>
    </div>

    <!-- Modal de detalles de reserva -->
    <div
      v-if="showModal && selectedReservation"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click="closeModal"
    >
      <div
        class="bg-white rounded-xl p-6 max-w-md w-full"
        @click.stop
      >
        <div class="text-center mb-6">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl">✅</span>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Detalles de la Reserva</h3>
        </div>

        <div class="space-y-3 mb-6">
          <div class="flex justify-between">
            <span class="text-gray-600">Código:</span>
            <span class="font-medium">{{ selectedReservation.code }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Evento:</span>
            <span class="font-medium">{{ selectedReservation.eventName }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Fecha:</span>
            <span class="font-medium">{{ formatDate(selectedReservation.date) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Hora:</span>
            <span class="font-medium">{{ selectedReservation.time }}</span>
          </div>
        </div>

        <!-- QR Code -->
        <div v-if="selectedReservation.qrCode" class="text-center mb-6">
          <img
            :src="selectedReservation.qrCode"
            alt="Código QR"
            class="mx-auto mb-2 border border-gray-200 rounded-lg"
          />
          <p class="text-sm text-gray-600">Presenta este código en tu cita</p>
        </div>

        <div class="flex gap-3">
          <button
            @click="sendToWhatsApp(selectedReservation)"
            class="btn-success flex-1 text-sm"
          >
            📱 Enviar por WhatsApp
          </button>
          <button
            @click="closeModal"
            class="btn-primary flex-1 text-sm"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useReservations } from '../composables/useReservations';
import type { Reservation } from '../types';

const {
  reservations,
  stats,
  getReservationsByEmail,
  cancelReservation: cancelRes,
  sendToWhatsApp
} = useReservations();

const searchEmail = ref('');
const showModal = ref(false);
const selectedReservation = ref<Reservation | null>(null);

const filteredReservations = computed(() => {
  if (!searchEmail.value) return [];
  return getReservationsByEmail(searchEmail.value.trim().toLowerCase());
});

const searchReservations = () => {
  // La búsqueda se hace automáticamente con el computed
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    'confirmed': 'confirmado',
    'pending': 'pendiente',
    'cancelled': 'cancelado'
  };
  return statusMap[status] || status;
};

const viewReservation = (reservation: Reservation) => {
  selectedReservation.value = reservation;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedReservation.value = null;
};

const cancelReservation = (id: string) => {
  if (confirm('¿Estás seguro de que quieres cancelar esta reserva?')) {
    cancelRes(id);
  }
};
</script>