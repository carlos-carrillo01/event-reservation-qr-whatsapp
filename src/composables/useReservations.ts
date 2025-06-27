import { ref, computed } from 'vue';
import type { Reservation } from '../types';
import QRCode from 'qrcode';

export function useReservations() {
  const reservations = ref<Reservation[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Cargar reservas del localStorage al inicializar
  const loadReservations = () => {
    try {
      const stored = localStorage.getItem('reservations');
      if (stored) {
        reservations.value = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error cargando reservas:', e);
    }
  };

  // Guardar reservas en localStorage
  const saveReservations = () => {
    try {
      localStorage.setItem('reservations', JSON.stringify(reservations.value));
    } catch (e) {
      console.error('Error guardando reservas:', e);
    }
  };

  // Generar código único de reserva
  const generateReservationCode = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'RES-';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Generar código QR
  const generateQRCode = async (reservationCode: string): Promise<string> => {
    try {
      const qrDataUrl = await QRCode.toDataURL(reservationCode, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      return qrDataUrl;
    } catch (err) {
      console.error('Error generando QR:', err);
      throw new Error('No se pudo generar el código QR');
    }
  };

  // Generar mensaje de WhatsApp
  const generateWhatsAppMessage = (reservation: Reservation): string => {
    const formatDate = (dateString: string): string => {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    return `¡Hola ${reservation.fullName}! 👋

✅ *Tu reserva ha sido confirmada*

🎫 *Código de Reserva:* ${reservation.code}
📅 *Evento:* ${reservation.eventName}
📅 *Fecha:* ${formatDate(reservation.date)}
⏰ *Hora:* ${reservation.time}
👤 *Nombre:* ${reservation.fullName}
📧 *Email:* ${reservation.email}

📱 *Importante:* Presenta este código QR en el evento.

${reservation.notes ? `📝 *Notas:* ${reservation.notes}` : ''}

¡Te esperamos! 🎉

_Sistema de Reservas - ${new Date().getFullYear()}_`;
  };

  // Enviar por WhatsApp
  const sendToWhatsApp = (reservation: Reservation, autoOpen: boolean = false) => {
    const message = generateWhatsAppMessage(reservation);
    const phone = reservation.whatsappPhone.replace(/\D/g, '');
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    
    if (autoOpen) {
      // Abrir automáticamente en una nueva pestaña
      window.open(url, '_blank');
    } else {
      // Solo generar la URL para uso manual
      return url;
    }
  };

  // Crear nueva reserva con envío automático por WhatsApp
  const createReservation = async (
    reservationData: Omit<Reservation, 'id' | 'code' | 'status' | 'qrCode' | 'createdAt'>,
    sendWhatsApp: boolean = true
  ): Promise<Reservation> => {
    loading.value = true;
    error.value = null;

    try {
      const code = generateReservationCode();
      const qrCode = await generateQRCode(code);

      const newReservation: Reservation = {
        ...reservationData,
        id: Date.now().toString(),
        code,
        status: 'confirmed',
        qrCode,
        createdAt: new Date().toISOString()
      };

      reservations.value.push(newReservation);
      saveReservations();

      // Enviar automáticamente por WhatsApp si está habilitado
      if (sendWhatsApp) {
        // Pequeño delay para asegurar que la reserva se guarde correctamente
        setTimeout(() => {
          sendToWhatsApp(newReservation, true);
        }, 500);
      }

      return newReservation;
    } catch (err: any) {
      error.value = err.message || 'Error creando la reserva';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Buscar reserva por código
  const findReservationByCode = (code: string): Reservation | undefined => {
    return reservations.value.find(r => r.code === code);
  };

  // Obtener reservas por email
  const getReservationsByEmail = (email: string): Reservation[] => {
    return reservations.value.filter(r => r.email === email);
  };

  // Cancelar reserva
  const cancelReservation = (id: string): boolean => {
    const index = reservations.value.findIndex(r => r.id === id);
    if (index !== -1) {
      reservations.value[index].status = 'cancelled';
      saveReservations();
      return true;
    }
    return false;
  };

  // Computed para estadísticas
  const stats = computed(() => ({
    total: reservations.value.length,
    confirmed: reservations.value.filter(r => r.status === 'confirmed').length,
    pending: reservations.value.filter(r => r.status === 'pending').length,
    cancelled: reservations.value.filter(r => r.status === 'cancelled').length
  }));

  // Inicializar
  loadReservations();

  return {
    reservations,
    loading,
    error,
    stats,
    createReservation,
    findReservationByCode,
    getReservationsByEmail,
    cancelReservation,
    generateWhatsAppMessage,
    sendToWhatsApp,
    loadReservations
  };
}