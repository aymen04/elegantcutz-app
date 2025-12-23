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
        <DialogContent className="sm:max-w-lg bg-zinc-900 border-zinc-800 text-white p-0 overflow-hidden">
          <div className="p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6 animate-bounce-in">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Réservation Confirmée!</h2>
            <p className="text-zinc-400 mb-6">Votre rendez-vous a été enregistré avec succès.</p>

            <Card className="bg-zinc-800/50 border-zinc-700 text-left mb-6">
              <CardContent className="p-5 space-y-3">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Service</span>
                  <span className="text-white font-medium">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Barbier</span>
                  <span className="text-white font-medium">{selectedBarber?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Date</span>
                  <span className="text-white font-medium">
                    {selectedDate && format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Heure</span>
                  <span className="text-white font-medium">{selectedTime}</span>
                </div>
                <Separator className="bg-zinc-700" />
                <div className="flex justify-between">
                  <span className="text-zinc-400">Sous-total</span>
                  <span className="text-white">${selectedService?.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 text-sm">TPS (5%)</span>
                  <span className="text-zinc-400 text-sm">
                    ${((selectedService?.price || 0) * 0.05).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 text-sm">TVQ (9.975%)</span>
                  <span className="text-zinc-400 text-sm">
                    ${((selectedService?.price || 0) * 0.09975).toFixed(2)}
                  </span>
                </div>
                <Separator className="bg-zinc-700" />
                <div className="flex justify-between">
                  <span className="text-zinc-300 font-medium">Total</span>
                  <span className="text-amber-500 font-bold text-lg">
                    ${((selectedService?.price || 0) * 1.14975).toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <p className="text-sm text-zinc-500 mb-6">
              Un email de confirmation sera envoyé à <span className="text-amber-500">{customerInfo.email}</span>
            </p>

            <Button onClick={handleClose} className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold">
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl lg:max-w-4xl bg-zinc-900 border-zinc-800 text-white p-0 overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="bg-zinc-950 p-6 border-b border-zinc-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Réserver un Rendez-vous</h2>
            <Button variant="ghost" size="icon" onClick={handleClose} className="text-zinc-400 hover:text-white">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Steps */}
          <div className="flex items-center justify-between">
            {steps.map((s, index) => (
              <div key={s.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      step > s.id
                        ? 'bg-amber-500 text-zinc-950'
                        : step === s.id
                        ? 'bg-amber-500/20 border-2 border-amber-500 text-amber-500'
                        : 'bg-zinc-800 text-zinc-500'
                    }`}
                  >
                    {step > s.id ? <Check className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${step >= s.id ? 'text-white' : 'text-zinc-500'}`}>
                    {s.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 sm:w-24 h-0.5 mx-2 ${step > s.id ? 'bg-amber-500' : 'bg-zinc-800'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="max-h-[60vh]">
          <div className="p-6">
            {/* Step 1: Service Selection */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Choisissez un service</h3>
                <div className="grid gap-3">
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
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              selectedService?.id === service.id ? 'bg-amber-500/20' : 'bg-zinc-700'
                            }`}
                          >
                            {service.category === 'special' ? (
                              <Crown className="w-5 h-5 text-amber-500" />
                            ) : (
                              <Scissors className="w-5 h-5 text-amber-500" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-white">{service.name}</h4>
                              {service.popular && (
                                <Badge className="bg-amber-500/20 text-amber-500 text-xs">Populaire</Badge>
                              )}
                            </div>
                            <p className="text-sm text-zinc-400 line-clamp-1">{service.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-amber-500">${service.price}</p>
                          <p className="text-xs text-zinc-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {service.duration} min
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
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Choisissez votre barbier</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                      <CardContent className="p-5 text-center">
                        <div className="w-20 h-20 rounded-full bg-zinc-700 mx-auto mb-4 overflow-hidden">
                          <img
                            src={barber.image}
                            alt={barber.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h4 className="font-semibold text-white mb-1">{barber.name}</h4>
                        <p className="text-sm text-amber-500/80 mb-3">{barber.role}</p>
                        <div className="flex items-center justify-center gap-1 mb-3">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          <span className="text-white font-medium">{barber.rating}</span>
                          <span className="text-zinc-500 text-sm">({barber.reviews})</span>
                        </div>
                        <div className="flex flex-wrap justify-center gap-1">
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
              <div className="grid lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Choisissez une date</h3>
                  <Calendar
                    mode="single"
                    selected={selectedDate || undefined}
                    onSelect={(date) => setDate(date || null)}
                    disabled={isDateDisabled}
                    locale={fr}
                    className="rounded-lg border border-zinc-700 bg-zinc-800/50 p-3"
                    classNames={{
                      day_selected: 'bg-amber-500 text-zinc-950 hover:bg-amber-400',
                      day_today: 'bg-zinc-700 text-white',
                      day_disabled: 'text-zinc-600 opacity-50',
                      day: 'hover:bg-zinc-700 text-white',
                      head_cell: 'text-zinc-400',
                      caption: 'text-white',
                      nav_button: 'text-zinc-400 hover:text-white hover:bg-zinc-700',
                    }}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Choisissez une heure</h3>
                  {selectedDate ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {getAvailableSlots().length > 0 ? (
                        getAvailableSlots().map((slot) => (
                          <Button
                            key={slot}
                            variant="outline"
                            onClick={() => setTime(slot)}
                            className={`${
                              selectedTime === slot
                                ? 'bg-amber-500 border-amber-500 text-zinc-950 hover:bg-amber-400'
                                : 'border-zinc-700 text-white hover:border-amber-500 hover:text-amber-500'
                            }`}
                          >
                            {slot}
                          </Button>
                        ))
                      ) : (
                        <p className="col-span-full text-zinc-500 text-center py-8">
                          Aucun créneau disponible pour cette date
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-48 text-zinc-500">
                      Sélectionnez d'abord une date
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Customer Info */}
            {step === 4 && (
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-4">Vos informations</h3>

                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-zinc-300">Nom complet *</Label>
                    <Input
                      id="name"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ name: e.target.value })}
                      placeholder="Jean Dupont"
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-amber-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-zinc-300">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({ email: e.target.value })}
                      placeholder="jean@example.com"
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-amber-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-zinc-300">Téléphone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ phone: e.target.value })}
                      placeholder="(514) 555-0123"
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-amber-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-zinc-300">Notes (optionnel)</Label>
                    <Textarea
                      id="notes"
                      value={customerInfo.notes}
                      onChange={(e) => setCustomerInfo({ notes: e.target.value })}
                      placeholder="Instructions spéciales, préférences..."
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-amber-500 min-h-[100px]"
                    />
                  </div>
                </div>

                {/* Summary */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Résumé</h3>
                  <Card className="bg-zinc-800/50 border-zinc-700">
                    <CardContent className="p-5 space-y-4">
                      <div className="flex items-center gap-4 pb-4 border-b border-zinc-700">
                        <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                          <Scissors className="w-5 h-5 text-amber-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{selectedService?.name}</h4>
                          <p className="text-sm text-zinc-400">{selectedService?.duration} minutes</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 pb-4 border-b border-zinc-700">
                        <div className="w-12 h-12 rounded-full bg-zinc-700 overflow-hidden">
                          <img
                            src={selectedBarber?.image}
                            alt={selectedBarber?.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{selectedBarber?.name}</h4>
                          <p className="text-sm text-zinc-400">{selectedBarber?.role}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 pb-4 border-b border-zinc-700">
                        <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                          <CalendarDays className="w-5 h-5 text-amber-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">
                            {selectedDate && format(selectedDate, 'EEEE d MMMM', { locale: fr })}
                          </h4>
                          <p className="text-sm text-zinc-400">{selectedTime}</p>
                        </div>
                      </div>

                      {/* Prix détaillé avec taxes */}
                      <div className="space-y-2 pt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-400">Sous-total</span>
                          <span className="text-white">${selectedService?.price.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-500 text-sm">TPS (5%)</span>
                          <span className="text-zinc-400 text-sm">
                            ${((selectedService?.price || 0) * 0.05).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-500 text-sm">TVQ (9.975%)</span>
                          <span className="text-zinc-400 text-sm">
                            ${((selectedService?.price || 0) * 0.09975).toFixed(2)}
                          </span>
                        </div>
                        <Separator className="bg-zinc-700 my-2" />
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-300 font-medium">Total</span>
                          <span className="text-2xl font-bold text-amber-500">
                            ${((selectedService?.price || 0) * 1.14975).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <p className="text-xs text-zinc-500 mt-4">
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
        <div className="p-6 border-t border-zinc-800 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={step === 1}
            className="text-zinc-400 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>

          {step < 4 ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold px-8"
            >
              Continuer
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed() || isSubmitting}
              className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold px-8"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Confirmation...
                </>
              ) : (
                'Confirmer la Réservation'
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
