import { ref, computed } from 'vue';
import type { Event } from '../types';

export function useEvents() {
  // Eventos organizados por categorías
  const allEvents = ref<Event[]>([
    // Cultura
    {
      id: '1',
      name: 'Exposición de Arte Contemporáneo',
      description: 'Descubre las últimas tendencias del arte contemporáneo',
      location: 'Fresnillo, Zacatecas',
      latitude: 40.4154,
      longitude: -3.6883,
      date: '2025-07-15',
      time: '10:00',
      category: 'Cultura',
      capacity: 150,
      price: 100
    },
    {
      id: '2',
      name: 'Festival de Teatro Clásico',
      description: 'Las mejores obras del teatro clásico español',
      location: 'Teatro, Zacatecas',
      latitude: 40.4180,
      longitude: -3.7108,
      date: '2025-07-18',
      time: '20:00',
      category: 'Cultura',
      capacity: 300,
      price: 35
    },
    {
      id: '3',
      name: 'Conferencia de Historia Medieval',
      description: 'Explorando los misterios de la Edad Media',
      location: 'IPN, Zacatecas',
      latitude: 40.4493,
      longitude: -3.7284,
      date: '2025-07-22',
      time: '18:00',
      category: 'Cultura',
      capacity: 100,
      price: 0
    },

    // Hospedaje (Eventos relacionados con turismo y alojamiento)
    {
      id: '4',
      name: 'Feria de Turismo Rural',
      description: 'Descubre los mejores destinos rurales de España',
      location: 'Cerro de la Bufa, Zacatecas',
      latitude: 41.3851,
      longitude: 2.1734,
      date: '2025-07-20',
      time: '09:00',
      category: 'Hospedaje',
      capacity: 500,
      price: 15
    },
    {
      id: '5',
      name: 'Encuentro de Hoteles Boutique',
      description: 'Networking para profesionales del sector hotelero',
      location: 'Hotel Minero, Zacatecas',
      latitude: 40.4153,
      longitude: -3.6953,
      date: '2025-07-25',
      time: '14:00',
      category: 'Hospedaje',
      capacity: 200,
      price: 50
    },
    {
      id: '6',
      name: 'Jornada de Turismo Sostenible',
      description: 'Iniciativas para un turismo más responsable',
      location: 'Centro de Convenciones, Fresnillo',
      latitude: 39.4699,
      longitude: -0.3763,
      date: '2025-07-28',
      time: '10:00',
      category: 'Hospedaje',
      capacity: 250,
      price: 100
    },

    // Conciertos
    {
      id: '7',
      name: 'Concierto de Jazz en Vivo',
      description: 'Una noche mágica con los mejores músicos de jazz',
      location: 'Centro, Fresnillo',
      latitude: 40.4154,
      longitude: -3.6883,
      date: '2025-07-16',
      time: '21:00',
      category: 'Conciertos',
      capacity: 120,
      price: 180
    },
    {
      id: '8',
      name: 'Festival de Rock Independiente',
      description: 'Las mejores bandas emergentes del rock nacional',
      location: 'Centro de convenciones, Fresnillo',
      latitude: 40.4089,
      longitude: -3.6827,
      date: '2025-07-19',
      time: '20:30',
      category: 'Conciertos',
      capacity: 800,
      price: 150
    },
    {
      id: '9',
      name: 'Concierto de Música Clásica',
      description: 'Orquesta Sinfónica interpretando obras maestras',
      location: 'Auditorio Nacional, Zacatecas',
      latitude: 40.4365,
      longitude: -3.6803,
      date: '2025-07-23',
      time: '19:30',
      category: 'Conciertos',
      capacity: 600,
      price: 200
    },
    {
      id: '10',
      name: 'Noche de Flamenco Auténtico',
      description: 'Espectáculo tradicional de flamenco andaluz',
      location: 'calera, Zacatecas',
      latitude: 41.3788,
      longitude: 2.1732,
      date: '2025-07-26',
      time: '22:00',
      category: 'Conciertos',
      capacity: 80,
      price: 150
    },
    {
      id: '11',
      name: 'Festival de Música Electrónica',
      description: 'Los mejores DJs de la escena electrónica europea',
      location: 'Zacatecas, ',
      latitude: 40.3833,
      longitude: -3.6167,
      date: '2025-07-30',
      time: '23:00',
      category: 'Conciertos',
      capacity: 1000,
      price: 400
    }
  ]);

  const loading = ref(false);
  const error = ref<string | null>(null);

  // Obtener eventos por categoría
  const getEventsByCategory = (category: string): Event[] => {
    return allEvents.value.filter(event => 
      event.category.toLowerCase() === category.toLowerCase()
    );
  };

  // Obtener todas las categorías disponibles
  const getCategories = (): string[] => {
    const categories = [...new Set(allEvents.value.map(event => event.category))];
    return categories.sort();
  };

  const getEventById = (id: string): Event | undefined => {
    return allEvents.value.find(event => event.id === id);
  };

  const searchEvents = (query: string, category?: string): Event[] => {
    let filteredEvents = allEvents.value;

    // Filtrar por categoría si se especifica
    if (category && category !== 'all') {
      filteredEvents = filteredEvents.filter(event =>
        event.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filtrar por texto de búsqueda
    if (query.trim()) {
      filteredEvents = filteredEvents.filter(event =>
        event.name.toLowerCase().includes(query.toLowerCase()) ||
        event.description.toLowerCase().includes(query.toLowerCase()) ||
        event.location.toLowerCase().includes(query.toLowerCase())
      );
    }

    return filteredEvents;
  };

  // Obtener eventos próximos (ordenados por fecha)
  const getUpcomingEvents = (limit?: number): Event[] => {
    const now = new Date();
    const upcoming = allEvents.value
      .filter(event => new Date(event.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return limit ? upcoming.slice(0, limit) : upcoming;
  };

  return {
    allEvents,
    loading,
    error,
    getEventsByCategory,
    getCategories,
    getEventById,
    searchEvents,
    getUpcomingEvents
  };
}