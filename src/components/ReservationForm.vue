<template>
  
  <div class="card animate-slide-up">
    <h2 class="text-2xl font-bold text-gray-900 mb-6">Nueva Reserva</h2>
    
    <!-- Filtro por categoría -->
    
    <div class="mb-6">
      <label class="form-label">Categoría de Evento</label>
      <select
        v-model="selectedCategory"
        @change="onCategoryChange"
        class="form-input"
      >
        <option value="all">Todas las categorías</option>
        <option value="Cultura">🎭 Cultura</option>
        <option value="Hospedaje">🏨 Hospedaje</option>
        <option value="Conciertos">🎵 Conciertos</option>
      </select>
    </div>

    <!-- Selector de evento -->
    <div class="mb-6">
      <label class="form-label">Evento *</label>
      <select
        v-model="form.eventId"
        @change="onEventChange"
        class="form-input"
        required
      >
        <option value="">Selecciona un evento</option>
        <optgroup 
          v-for="category in categoriesWithEvents" 
          :key="category.name"
          :label="category.label"
        >
          <option
            v-for="event in category.events"
            :key="event.id"
            :value="event.id"
          >
            {{ event.name }} - {{ event.location }}
            <span v-if="event.price > 0">(${{ event.price }})</span>
            <span v-else>(Gratis)</span>
          </option>
        </optgroup>
      </select>
    </div>

    <!-- Información del evento seleccionado -->
    <div v-if="selectedEvent" class="mb-6 p-4 bg-green-50 rounded-lg">
      <div class="flex items-start justify-between mb-3">
        <div>
          <h4 class="font-medium text-gray-900 mb-1">{{ selectedEvent.name }}</h4>
          <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {{ getCategoryIcon(selectedEvent.category) }} {{ selectedEvent.category }}
          </span>
        </div>
        <div class="text-right">
          <span v-if="selectedEvent.price > 0" class="text-lg font-bold text-green-600">
            ${{ selectedEvent.price }}
          </span>
          <span v-else class="text-lg font-bold text-green-600">
            🆓 Gratis
          </span>
        </div>
      </div>
      
      <p class="text-sm text-gray-600 mb-3">{{ selectedEvent.description }}</p>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-500">
        <div class="flex items-center gap-1">
          <span>📍</span>
          <span>{{ selectedEvent.location }}</span>
        </div>
        <div class="flex items-center gap-1">
          <span>📅</span>
          <span>{{ formatDate(selectedEvent.date) }}</span>
        </div>
        <div class="flex items-center gap-1">
          <span>⏰</span>
          <span>{{ selectedEvent.time }}</span>
        </div>
      </div>
      
      <div class="mt-3 text-sm text-gray-500">
        <span>👥 Capacidad: {{ selectedEvent.capacity }} personas</span>
      </div>
    </div>

    <form @submit.prevent="submitReservation" class="space-y-6">
      
      <!-- Información personal -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="form-label">Nombre Completo *</label>
          <input
            v-model="form.fullName"
            type="text"
            class="form-input"
            placeholder="Tu nombre completo"
            required
          />
        </div>

        <div>
          <label class="form-label">Correo Electrónico *</label>
          <input
            v-model="form.email"
            type="email"
            class="form-input"
            placeholder="tu@email.com"
            required
          />
        </div>
      </div>

      <div>
        <label class="form-label">Teléfono WhatsApp *</label>
        <input
          v-model="form.whatsappPhone"
          type="tel"
          class="form-input"
          placeholder="+34 123 456 789"
          required
        />
        <p class="text-xs text-gray-500 mt-1">
          📱 Se enviará automáticamente la confirmación a este número
        </p>
      </div>

      <div>
        <label class="form-label">Notas Adicionales</label>
        <textarea
          v-model="form.notes"
          class="form-input resize-none"
          rows="4"
          placeholder="Información adicional..."
        ></textarea>
      </div>

      <!-- Opción de envío por WhatsApp -->
      <div class="bg-green-50 p-4 rounded-lg">
        <div class="flex items-center gap-3">
          <input
            id="sendWhatsApp"
            v-model="form.sendWhatsApp"
            type="checkbox"
            class="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
          />
          
          <label for="sendWhatsApp" class="text-sm font-medium text-gray-900">
            📱 Enviar confirmación automáticamente por WhatsApp
          </label>
          
        </div>
        
        <p class="text-xs text-gray-600 mt-2 ml-7">
          Al crear la reserva, se abrirá WhatsApp automáticamente con el mensaje de confirmación listo para enviar
        </p>
        
      </div>

      <button
        type="submit"
        :disabled="loading || !form.eventId"
        class="btn-primary w-full flex items-center justify-center gap-2"
      >
        <span v-if="loading">Creando reserva...</span>
        <span v-else>🎫 Crear Reserva</span>
      </button>
    </form>

    <!-- Mensaje de confirmación -->
    <div v-if="showSuccessMessage" class="mt-6 p-4 bg-green-100 border border-green-400 rounded-lg">
      <div class="flex items-center gap-2">
        <span class="text-green-600">✅</span>
        <p class="text-green-800 font-medium">¡Reserva creada exitosamente!</p>
      </div>
      <p class="text-green-700 text-sm mt-1">
        {{ form.sendWhatsApp ? 'Se ha abierto WhatsApp con tu confirmación.' : 'Puedes enviar la confirmación manualmente desde "Mis Reservas".' }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useEvents } from '../composables/useEvents';
import { useReservations } from '../composables/useReservations';
import type { Event } from '../types';

const router = useRouter();
const { getEventsByCategory, getCategories, getEventById, allEvents } = useEvents();
const { createReservation, loading } = useReservations();

const selectedEvent = ref<Event | null>(null);
const showSuccessMessage = ref(false);
const selectedCategory = ref('all');

const form = reactive({
  fullName: '',
  email: '',
  whatsappPhone: '',
  eventId: '',
  notes: '',
  sendWhatsApp: true // Por defecto habilitado
});

// Eventos filtrados por categoría
const filteredEvents = computed(() => {
  if (selectedCategory.value === 'all') {
    return allEvents.value;
  }
  return getEventsByCategory(selectedCategory.value);
});

// Agrupar eventos por categoría para el select
const categoriesWithEvents = computed(() => {
  const categories = [
    { name: 'Cultura', label: '🎭 Cultura', events: [] as Event[] },
    { name: 'Hospedaje', label: '🏨 Hospedaje', events: [] as Event[] },
    { name: 'Conciertos', label: '🎵 Conciertos', events: [] as Event[] }
  ];

  filteredEvents.value.forEach(event => {
    const category = categories.find(cat => cat.name === event.category);
    if (category) {
      category.events.push(event);
    }
  });

  return categories.filter(cat => cat.events.length > 0);
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

const getCategoryIcon = (category: string): string => {
  const icons: Record<string, string> = {
    'Cultura': '🎭',
    'Hospedaje': '🏨',
    'Conciertos': '🎵'
  };
  return icons[category] || '📅';
};

const onCategoryChange = () => {
  // Limpiar selección de evento cuando cambia la categoría
  form.eventId = '';
  selectedEvent.value = null;
};

const onEventChange = () => {
  if (form.eventId) {
    selectedEvent.value = getEventById(form.eventId) || null;
  } else {
    selectedEvent.value = null;
  }
};

const submitReservation = async () => {
  if (!selectedEvent.value) return;

  try {
    const reservation = await createReservation({
      fullName: form.fullName,
      email: form.email,
      whatsappPhone: form.whatsappPhone,
      eventId: form.eventId,
      eventName: selectedEvent.value.name,
      date: selectedEvent.value.date,
      time: selectedEvent.value.time,
      notes: form.notes
    }, form.sendWhatsApp); // Pasar la opción de envío por WhatsApp

    // Mostrar mensaje de éxito
    showSuccessMessage.value = true;
    
    // Ocultar mensaje después de 5 segundos
    setTimeout(() => {
      showSuccessMessage.value = false;
    }, 5000);

    // Redirect to confirmation page después de un breve delay
    setTimeout(() => {
      router.push({ name: 'Confirmation', params: { reservationId: reservation.id } });
    }, 2000);

  } catch (error) {
    console.error('Error creating reservation:', error);
    alert('Error al crear la reserva. Por favor, inténtalo de nuevo.');
  }
};
</script>
