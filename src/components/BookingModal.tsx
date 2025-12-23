import { useState, useEffect } from 'react';
import { format, addDays, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Check,
  ChevronLeft,
  Clock,
  Star,
  Scissors,
  User,
  CalendarDays,
  Loader2,
  CheckCircle2,
  Crown,
  X,
} from 'lucide-react';
import { useBookingStore } from '@/lib/store';
import { services, barbers, type Service, type Barber } from '@/lib/data';
import { createBooking, getBookedSlots, sendBookingConfirmationEmail } from '@/lib/supabase';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedService?: Service | null;
  preSelectedBarber?: Barber | null;
}

const steps = [
  { id: 1, title: 'Service', icon: Scissors },
  { id: 2, title: 'Barbier', icon: User },
  { id: 3, title: 'Date & Heure', icon: CalendarDays },
  { id: 4, title: 'Confirmation', icon: Check },
];

export function BookingModal({
  isOpen,
  onClose,
  preSelectedService,
  preSelectedBarber,
}: BookingModalProps) {
  const {
    step,
    selectedService,
    selectedBarber,
    selectedDate,
    selectedTime,
    customerInfo,
    setStep,
    setService,
    setBarber,
    setDate,
    setTime,
    setCustomerInfo,
    reset,
    canProceed,
  } = useBookingStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (preSelectedService) {
        setService(preSelectedService);
        if (preSelectedBarber) {
          setBarber(preSelectedBarber);
          setStep(3);
        } else {
          setStep(2);
        }
      } else if (preSelectedBarber) {
        setBarber(preSelectedBarber);
        setStep(1);
      }
    }
  }, [isOpen, preSelectedService, preSelectedBarber, setService, setBarber, setStep]);

  // Charger les créneaux déjà réservés quand la date ou le barbier change
  useEffect(() => {
    async function loadBookedSlots() {
      if (selectedBarber && selectedDate) {
        try {
          const dateStr = format(selectedDate, 'yyyy-MM-dd');
          const booked = await getBookedSlots(selectedBarber.id, dateStr);
          // Extraire les heures déjà réservées
          const slots = booked.map((b) => b.appointment_time.slice(0, 5));
          setBookedSlots(slots);
        } catch (err) {
          console.error('Error loading booked slots:', err);
        }
      }
    }
    loadBookedSlots();
  }, [selectedBarber, selectedDate]);

  const handleClose = () => {
    reset();
    setIsSuccess(false);
    setError(null);
    setBookedSlots([]);
    onClose();
  };

  const handleNext = () => {
    if (canProceed() && step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (!canProceed() || !selectedService || !selectedBarber || !selectedDate || !selectedTime) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const appointmentDateFormatted = format(selectedDate, 'yyyy-MM-dd');

      await createBooking({
        client_name: customerInfo.name,
        client_email: customerInfo.email,
        client_phone: customerInfo.phone,
        service_id: selectedService.id,
        service_name: selectedService.name,
        service_price: selectedService.price,
        service_duration: selectedService.duration,
        barber_id: selectedBarber.id,
        barber_name: selectedBarber.name,
        appointment_date: appointmentDateFormatted,
        appointment_time: selectedTime,
        status: 'confirmed',
        notes: customerInfo.notes || undefined,
      });

      // Envoyer l'email de confirmation (en arrière-plan, ne bloque pas)
      sendBookingConfirmationEmail({
        clientName: customerInfo.name,
        clientEmail: customerInfo.email,
        serviceName: selectedService.name,
        barberName: selectedBarber.name,
        appointmentDate: format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr }),
        appointmentTime: selectedTime,
        price: selectedService.price,
      });

      setIsSuccess(true);
    } catch (err) {
      console.error('Booking error:', err);
      setError('Une erreur est survenue lors de la réservation. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAvailableSlots = () => {
    if (!selectedBarber || !selectedDate) return [];
    const dayOfWeek = selectedDate.getDay();
    const availability = selectedBarber.availability.find((a) => a.day === dayOfWeek);
    if (!availability) return [];

    let slots = availability.slots;

    // Filtrer les créneaux passés si c'est aujourd'hui
    if (isSameDay(selectedDate, new Date())) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      slots = slots.filter((slot) => {
        const [hour, minute] = slot.split(':').map(Number);
        return hour > currentHour || (hour === currentHour && minute > currentMinute);
      });
    }

    // Filtrer les créneaux déjà réservés
    slots = slots.filter((slot) => !bookedSlots.includes(slot));

    return slots;
  };

  const isDateDisabled = (date: Date) => {
    if (!selectedBarber) return true;
    const dayOfWeek = date.getDay();
    const hasAvailability = selectedBarber.availability.some((a) => a.day === dayOfWeek);
    const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
    const isTooFar = date > addDays(new Date(), 30);
    return !hasAvailability || isPast || isTooFar;
  };

  // Success State
  if (isSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="w-[95vw] max-w-lg bg-zinc-900 border-zinc-800 text-white p-0 overflow-hidden">
          <div className="p-4 sm:p-8 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4 sm:mb-6 animate-bounce-in">
              <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Réservation Confirmée!</h2>
            <p className="text-zinc-400 mb-4 sm:mb-6 text-sm sm:text-base">Votre rendez-vous a été enregistré avec succès.</p>

            <Card className="bg-zinc-800/50 border-zinc-700 text-left mb-4 sm:mb-6">
              <CardContent className="p-3 sm:p-5 space-y-2 sm:space-y-3">
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-zinc-400">Service</span>
                  <span className="text-white font-medium truncate ml-2">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-zinc-400">Barbier</span>
                  <span className="text-white font-medium">{selectedBarber?.name}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-zinc-400">Date</span>
                  <span className="text-white font-medium text-right">
                    {selectedDate && format(selectedDate, 'd MMM yyyy', { locale: fr })}
                  </span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-zinc-400">Heure</span>
                  <span className="text-white font-medium">{selectedTime}</span>
                </div>
                <Separator className="bg-zinc-700" />
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Sous-total</span>
                  <span className="text-white">${selectedService?.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-zinc-500">TPS (5%)</span>
                  <span className="text-zinc-400">
                    ${((selectedService?.price || 0) * 0.05).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-zinc-500">TVQ (9.975%)</span>
                  <span className="text-zinc-400">
                    ${((selectedService?.price || 0) * 0.09975).toFixed(2)}
                  </span>
                </div>
                <Separator className="bg-zinc-700" />
                <div className="flex justify-between">
                  <span className="text-zinc-300 font-medium text-sm">Total</span>
                  <span className="text-amber-500 font-bold text-base sm:text-lg">
                    ${((selectedService?.price || 0) * 1.14975).toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <p className="text-xs sm:text-sm text-zinc-500 mb-4 sm:mb-6">
              Un email de confirmation sera envoyé à <span className="text-amber-500 break-all">{customerInfo.email}</span>
            </p>

            <Button onClick={handleClose} className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-sm sm:text-base py-2.5 sm:py-3">
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-2xl lg:max-w-4xl bg-zinc-900 border-zinc-800 text-white p-0 overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="bg-zinc-950 p-3 sm:p-6 border-b border-zinc-800">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-base sm:text-xl font-bold">Réserver un Rendez-vous</h2>
            <Button variant="ghost" size="icon" onClick={handleClose} className="text-zinc-400 hover:text-white h-8 w-8 sm:h-10 sm:w-10">
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>

          {/* Steps - Compact on mobile */}
          <div className="flex items-center justify-between">
            {steps.map((s, index) => (
              <div key={s.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      step > s.id
                        ? 'bg-amber-500 text-zinc-950'
                        : step === s.id
                        ? 'bg-amber-500/20 border-2 border-amber-500 text-amber-500'
                        : 'bg-zinc-800 text-zinc-500'
                    }`}
                  >
                    {step > s.id ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : <s.icon className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </div>
                  <span className={`text-[10px] sm:text-xs mt-1 sm:mt-2 font-medium ${step >= s.id ? 'text-white' : 'text-zinc-500'}`}>
                    {s.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-6 sm:w-16 lg:w-24 h-0.5 mx-1 sm:mx-2 ${step > s.id ? 'bg-amber-500' : 'bg-zinc-800'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="max-h-[55vh] sm:max-h-[60vh]">
          <div className="p-3 sm:p-6">
            {/* Step 1: Service Selection */}
            {step === 1 && (
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Choisissez un service</h3>
                <div className="grid gap-2 sm:gap-3">
                  {services.map((service) => (
                    <Card
                      key={service.id}
                      onClick={() => setService(service)}
                      className={`cursor-pointer transition-all duration-300 ${
                        selectedService?.id === service.id
                          ? 'bg-amber-500/10 border-amber-500'
                          : 'bg-zinc-800/50 border-zinc-700 hover:border-zinc-600'
                      }`}
                    >
                      <CardContent className="p-3 sm:p-4 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                          <div
                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 ${
                              selectedService?.id === service.id ? 'bg-amber-500/20' : 'bg-zinc-700'
                            }`}
                          >
                            {service.category === 'special' ? (
                              <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                            ) : (
                              <Scissors className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-semibold text-white text-sm sm:text-base truncate">{service.name}</h4>
                              {service.popular && (
                                <Badge className="bg-amber-500/20 text-amber-500 text-[10px] sm:text-xs px-1.5 py-0.5">Populaire</Badge>
                              )}
                            </div>
                            <p className="text-xs sm:text-sm text-zinc-400 line-clamp-1">{service.description}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-base sm:text-xl font-bold text-amber-500">${service.price}</p>
                          <p className="text-[10px] sm:text-xs text-zinc-500 flex items-center justify-end gap-1">
                            <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> {service.duration} min
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Barber Selection */}
            {step === 2 && (
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Choisissez votre barbier</h3>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
                  {barbers
                    .filter((barber) => selectedService?.barberIds.includes(barber.id))
                    .map((barber) => (
                    <Card
                      key={barber.id}
                      onClick={() => setBarber(barber)}
                      className={`cursor-pointer transition-all duration-300 ${
                        selectedBarber?.id === barber.id
                          ? 'bg-amber-500/10 border-amber-500'
                          : 'bg-zinc-800/50 border-zinc-700 hover:border-zinc-600'
                      }`}
                    >
                      <CardContent className="p-3 sm:p-5 text-center">
                        <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-zinc-700 mx-auto mb-2 sm:mb-4 overflow-hidden">
                          <img
                            src={barber.image}
                            alt={barber.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h4 className="font-semibold text-white mb-0.5 sm:mb-1 text-sm sm:text-base truncate">{barber.name}</h4>
                        <p className="text-xs sm:text-sm text-amber-500/80 mb-2 sm:mb-3 truncate">{barber.role}</p>
                        <div className="flex items-center justify-center gap-1 mb-2 sm:mb-3">
                          <Star className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500 fill-amber-500" />
                          <span className="text-white font-medium text-xs sm:text-base">{barber.rating}</span>
                          <span className="text-zinc-500 text-[10px] sm:text-sm">({barber.reviews})</span>
                        </div>
                        <div className="hidden sm:flex flex-wrap justify-center gap-1">
                          {barber.specialties.slice(0, 2).map((s) => (
                            <Badge key={s} variant="outline" className="text-xs border-zinc-600 text-zinc-400">
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Date & Time Selection */}
            {step === 3 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Choisissez une date</h3>
                  <Calendar
                    mode="single"
                    selected={selectedDate || undefined}
                    onSelect={(date) => setDate(date || null)}
                    disabled={isDateDisabled}
                    locale={fr}
                    className="rounded-lg border border-zinc-700 bg-zinc-800/50 p-2 sm:p-3 w-full [&_.rdp-month]:w-full [&_.rdp-table]:w-full"
                    classNames={{
                      day_selected: 'bg-amber-500 text-zinc-950 hover:bg-amber-400',
                      day_today: 'bg-zinc-700 text-white',
                      day_disabled: 'text-zinc-600 opacity-50',
                      day: 'hover:bg-zinc-700 text-white h-8 w-8 sm:h-9 sm:w-9 text-sm',
                      head_cell: 'text-zinc-400 text-xs sm:text-sm',
                      caption: 'text-white text-sm sm:text-base',
                      nav_button: 'text-zinc-400 hover:text-white hover:bg-zinc-700 h-7 w-7 sm:h-8 sm:w-8',
                      cell: 'text-center p-0',
                    }}
                  />
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Choisissez une heure</h3>
                  {selectedDate ? (
                    <div className="grid grid-cols-4 sm:grid-cols-4 gap-1.5 sm:gap-2">
                      {getAvailableSlots().length > 0 ? (
                        getAvailableSlots().map((slot) => (
                          <Button
                            key={slot}
                            variant="outline"
                            onClick={() => setTime(slot)}
                            className={`text-xs sm:text-sm px-2 sm:px-4 py-2 h-auto ${
                              selectedTime === slot
                                ? 'bg-amber-500 border-amber-500 text-zinc-950 hover:bg-amber-400'
                                : 'border-zinc-700 text-white hover:border-amber-500 hover:text-amber-500'
                            }`}
                          >
                            {slot}
                          </Button>
                        ))
                      ) : (
                        <p className="col-span-full text-zinc-500 text-center py-6 sm:py-8 text-sm">
                          Aucun créneau disponible pour cette date
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-32 sm:h-48 text-zinc-500 text-sm">
                      Sélectionnez d'abord une date
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Customer Info */}
            {step === 4 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Vos informations</h3>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="name" className="text-zinc-300 text-sm">Nom complet *</Label>
                    <Input
                      id="name"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ name: e.target.value })}
                      placeholder="Jean Dupont"
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-amber-500 h-10 sm:h-11 text-sm"
                    />
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="email" className="text-zinc-300 text-sm">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({ email: e.target.value })}
                      placeholder="jean@example.com"
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-amber-500 h-10 sm:h-11 text-sm"
                    />
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="phone" className="text-zinc-300 text-sm">Téléphone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ phone: e.target.value })}
                      placeholder="(514) 555-0123"
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-amber-500 h-10 sm:h-11 text-sm"
                    />
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="notes" className="text-zinc-300 text-sm">Notes (optionnel)</Label>
                    <Textarea
                      id="notes"
                      value={customerInfo.notes}
                      onChange={(e) => setCustomerInfo({ notes: e.target.value })}
                      placeholder="Instructions spéciales, préférences..."
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-amber-500 min-h-[80px] sm:min-h-[100px] text-sm"
                    />
                  </div>
                </div>

                {/* Summary */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Résumé</h3>
                  <Card className="bg-zinc-800/50 border-zinc-700">
                    <CardContent className="p-3 sm:p-5 space-y-3 sm:space-y-4">
                      <div className="flex items-center gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-zinc-700">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                          <Scissors className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-white text-sm sm:text-base truncate">{selectedService?.name}</h4>
                          <p className="text-xs sm:text-sm text-zinc-400">{selectedService?.duration} minutes</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-zinc-700">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-zinc-700 overflow-hidden shrink-0">
                          <img
                            src={selectedBarber?.image}
                            alt={selectedBarber?.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-white text-sm sm:text-base truncate">{selectedBarber?.name}</h4>
                          <p className="text-xs sm:text-sm text-zinc-400 truncate">{selectedBarber?.role}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-zinc-700">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                          <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-white text-sm sm:text-base">
                            {selectedDate && format(selectedDate, 'EEEE d MMMM', { locale: fr })}
                          </h4>
                          <p className="text-xs sm:text-sm text-zinc-400">{selectedTime}</p>
                        </div>
                      </div>

                      {/* Prix détaillé avec taxes */}
                      <div className="space-y-1.5 sm:space-y-2 pt-1 sm:pt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-400 text-sm">Sous-total</span>
                          <span className="text-white text-sm">${selectedService?.price.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-500 text-xs sm:text-sm">TPS (5%)</span>
                          <span className="text-zinc-400 text-xs sm:text-sm">
                            ${((selectedService?.price || 0) * 0.05).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-500 text-xs sm:text-sm">TVQ (9.975%)</span>
                          <span className="text-zinc-400 text-xs sm:text-sm">
                            ${((selectedService?.price || 0) * 0.09975).toFixed(2)}
                          </span>
                        </div>
                        <Separator className="bg-zinc-700 my-1.5 sm:my-2" />
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-300 font-medium text-sm">Total</span>
                          <span className="text-xl sm:text-2xl font-bold text-amber-500">
                            ${((selectedService?.price || 0) * 1.14975).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <p className="text-[10px] sm:text-xs text-zinc-500 mt-3 sm:mt-4">
                    * En confirmant, vous acceptez nos conditions d'utilisation et notre politique d'annulation.
                  </p>

                  {error && (
                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-3 sm:p-6 border-t border-zinc-800 flex items-center justify-between gap-2">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={step === 1}
            className="text-zinc-400 hover:text-white text-sm px-2 sm:px-4"
          >
            <ChevronLeft className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Retour</span>
          </Button>

          {step < 4 ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold px-4 sm:px-8 text-sm sm:text-base"
            >
              Continuer
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed() || isSubmitting}
              className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold px-3 sm:px-8 text-xs sm:text-base"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1 sm:mr-2 animate-spin" />
                  <span className="hidden sm:inline">Confirmation...</span>
                  <span className="sm:hidden">...</span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">Confirmer la Réservation</span>
                  <span className="sm:hidden">Confirmer</span>
                </>
              )}
            </Button>
          )}
        </div>

        <style>{`
          @keyframes bounce-in {
            0% { transform: scale(0); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          .animate-bounce-in {
            animation: bounce-in 0.5s ease;
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}
