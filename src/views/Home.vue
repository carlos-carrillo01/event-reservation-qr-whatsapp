<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="text-center">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Sistema de Reservas</h1>
          <p class="text-lg text-gray-600">Reserva tu cita y recibe tu código QR por WhatsApp</p>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Formulario de Nueva Reserva -->
        <div>
          <ReservationForm />
        </div>

        <!-- Mis Reservas -->
        <div>
          <MyReservations />
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center text-gray-500">
          <p>&copy; 2025 Sistema de Reservas. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import ReservationForm from '../components/ReservationForm.vue';
import MyReservations from '../components/MyReservations.vue';
</script>