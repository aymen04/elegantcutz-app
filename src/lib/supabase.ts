import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hyphinfufzrhepajgpeo.supabase.co';
const supabaseAnonKey = 'sb_publishable_ze-tvqC4TvW73WHCj3G9CA_oJAfdLpU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types pour la table bookings
export interface BookingInsert {
  client_name: string;
  client_email: string;
  client_phone: string;
  service_id: string;
  service_name: string;
  service_price: number;
  service_duration: number;
  barber_id: string;
  barber_name: string;
  appointment_date: string; // Format: YYYY-MM-DD
  appointment_time: string; // Format: HH:MM
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
}

export interface BookingRow extends BookingInsert {
  id: string;
  created_at: string;
}

// Fonction pour créer une réservation
export async function createBooking(booking: BookingInsert) {
  const { data, error } = await supabase
    .from('bookings')
    .insert([booking])
    .select()
    .single();

  if (error) {
    console.error('Error creating booking:', error);
    throw error;
  }

  return data as BookingRow;
}

// Fonction pour vérifier les créneaux déjà réservés
export async function getBookedSlots(barberId: string, date: string) {
  const { data, error } = await supabase
    .from('bookings')
    .select('appointment_time, service_duration')
    .eq('barber_id', barberId)
    .eq('appointment_date', date)
    .neq('status', 'cancelled');

  if (error) {
    console.error('Error fetching booked slots:', error);
    throw error;
  }

  return data || [];
}

// Fonction pour envoyer l'email de confirmation
export interface BookingEmailData {
  clientName: string;
  clientEmail: string;
  serviceName: string;
  barberName: string;
  appointmentDate: string;
  appointmentTime: string;
  price: number;
}

export async function sendBookingConfirmationEmail(emailData: BookingEmailData) {
  const { data, error } = await supabase.functions.invoke('send-booking-email', {
    body: emailData,
  });

  if (error) {
    console.error('Error sending confirmation email:', error);
    // Ne pas throw l'erreur pour ne pas bloquer la réservation
    return null;
  }

  return data;
}
