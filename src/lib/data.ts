// Types
export interface Barber {
  id: string;
  name: string;
  role: string;
  description: string;
  image: string;
  rating: number;
  reviews: number;
  specialties: string[];
  availability: DayAvailability[];
}

export interface DayAvailability {
  day: number; // 0 = Sunday, 1 = Monday, etc.
  slots: string[];
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  duration: number; // in minutes
  price: number;
  category: 'haircut' | 'beard' | 'combo' | 'special' | 'extra' | 'nails' | 'other';
  popular?: boolean;
  barberIds: string[]; // IDs des barbiers qui peuvent effectuer ce service
}

export interface Booking {
  id: string;
  service: Service;
  barber: Barber;
  date: Date;
  time: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
}

// Data
export const services: Service[] = [
  {
    id: 'special-december-vip',
    name: '[SPÉCIAL DÉCEMBRE] Service VIP',
    description: 'Coupe complète + taille de barbe + serviette chaude + masque visage. 45$ au lieu de 75$. Sans barbe: 35$. Offre limitée à décembre!',
    duration: 30,
    price: 45,
    category: 'special',
    popular: true,
    barberIds: ['hamed', 'vincent', 'ikram'],
  },
  {
    id: 'haircut',
    name: 'Coupe / Haircut',
    duration: 30,
    price: 35,
    category: 'haircut',
    barberIds: ['ikram', 'vincent'],
  },
  {
    id: 'haircut-beard',
    name: 'Coupe & Barbe / Haircut & Beard',
    duration: 45,
    price: 45,
    category: 'combo',
    popular: true,
    barberIds: ['ikram', 'vincent'],
  },
  {
    id: 'haircut-kids',
    name: 'Coupe Enfant',
    description: 'Pour enfants de 0 à 12 ans.',
    duration: 30,
    price: 25,
    category: 'haircut',
    barberIds: ['vincent'],
  },
  {
    id: 'skinfade',
    name: 'Skinfade / Haircut (Coupe Cheveux)',
    duration: 30,
    price: 40,
    category: 'haircut',
    popular: true,
    barberIds: ['hamed'],
  },
  {
    id: 'kids-skinfade',
    name: 'Kids Skinfade (Coupe Enfants)',
    description: 'Pour enfants de 0 à 12 ans.',
    duration: 30,
    price: 30,
    category: 'haircut',
    barberIds: ['hamed', 'ikram'],
  },
  {
    id: 'skinfade-beard',
    name: 'Skinfade & Beard (Cheveux & Barbe)',
    duration: 30,
    price: 50,
    category: 'combo',
    barberIds: ['hamed'],
  },
  {
    id: 'curly-hair',
    name: 'Curly Hair (Perm Frisés)',
    duration: 60,
    price: 90,
    category: 'special',
    barberIds: ['hamed'],
  },
  {
    id: 'line-up',
    name: 'Line Up (Contour)',
    duration: 10,
    price: 30,
    category: 'haircut',
    barberIds: ['hamed'],
  },
  // Extra Services
  {
    id: 'black-mask',
    name: 'Black Mask (Masque Noir)',
    duration: 10,
    price: 15,
    category: 'extra',
    barberIds: ['hamed'],
  },
  {
    id: 'face-nose-waxing',
    name: 'Face & Nose Waxing (Epilation Faciale + Nez)',
    duration: 15,
    price: 15,
    category: 'extra',
    barberIds: ['hamed', 'ikram'],
  },
  {
    id: 'mens-facial-cleansing',
    name: "Men's Facial Cleansing / Soin du Visage Homme",
    description: 'Nettoyage en profondeur et hydratation pour une peau éclatante. Deep cleansing and hydration for a fresh, healthy look.',
    duration: 60,
    price: 120,
    category: 'extra',
    barberIds: ['hamed'],
  },
  // Nail Services
  {
    id: 'nail-art',
    name: 'Nail Art (Supplément)',
    description: 'Design nail art simple ou détaillé (prix selon design). Simple or advanced nail art design.',
    duration: 20,
    price: 10,
    category: 'nails',
    barberIds: ['anosha'],
  },
  {
    id: 'mani-pedi-combo',
    name: 'Mani + Pedi Combo',
    description: 'Soin complet des mains et pieds en une seule visite. Complete hand and foot care in one appointment.',
    duration: 90,
    price: 65,
    category: 'nails',
    popular: true,
    barberIds: ['anosha'],
  },
  {
    id: 'manicure-classique',
    name: 'Manicure Classique',
    description: 'Nettoyage des cuticules, limage des ongles et vernis. Clean cuticles, nail shaping and polish.',
    duration: 40,
    price: 25,
    category: 'nails',
    barberIds: ['anosha'],
  },
  {
    id: 'pedicure-spa',
    name: 'Pédicure Spa',
    description: 'Pédicure spa relaxante avec bain de pieds, exfoliation et soin des ongles. Relaxing spa pedicure with foot soak, exfoliation and nail care.',
    duration: 60,
    price: 40,
    category: 'nails',
    barberIds: ['anosha'],
  },
  // Other
  {
    id: 'premium-vip-package',
    name: 'Premium VIP Package',
    description: 'Coupe + barbe + soin facial VIP. Nettoyage, exfoliation, vapeur, masque anti-âge, tonification, hydratation et massage relaxant.',
    duration: 60,
    price: 180,
    category: 'other',
    popular: true,
    barberIds: ['hamed'],
  },
  {
    id: 'contour',
    name: 'Contour',
    duration: 30,
    price: 25,
    category: 'other',
    barberIds: ['vincent', 'ikram'],
  },
];

export const barbers: Barber[] = [
  {
    id: 'hamed',
    name: 'Hamed',
    role: 'Owner Barber & Stylist',
    description: 'With over 13 years of experience, I specialize in precision cuts, modern styles, and expert grooming. As the owner of ELEGANT CUT, my focus is on providing exceptional service and creating a professional, welcoming experience for every client.',
    image: '/hamed.webp',
    rating: 5.0,
    reviews: 156,
    specialties: ['Skinfade', 'Curly Hair', 'Facial'],
    availability: [
      { day: 1, slots: ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'] },
      { day: 2, slots: ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'] },
      { day: 3, slots: ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'] },
      { day: 4, slots: ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'] },
      { day: 5, slots: ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'] },
      { day: 6, slots: ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'] },
    ],
  },
  {
    id: 'vincent',
    name: 'Vincent',
    role: 'Junior Barber & Stylist',
    description: 'Nous sommes heureux de vous présenter Vincent, notre nouveau barbier apprenti. Il sait déjà très bien couper les cheveux et continue de perfectionner ses techniques sous la supervision d\'un barbier professionnel. Venez encourager la relève et profitez d\'une coupe propre à un excellent prix!',
    image: '/vincent.webp',
    rating: 4.9,
    reviews: 98,
    specialties: ['Coupe Classique', 'Coupe Enfant', 'Contour'],
    availability: [
      { day: 1, slots: ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'] },
      { day: 2, slots: ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'] },
      { day: 3, slots: ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'] },
      { day: 4, slots: ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'] },
      { day: 5, slots: ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'] },
      { day: 6, slots: ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'] },
    ],
  },
  {
    id: 'ikram',
    name: 'Ikram',
    role: 'Barber & Stylist',
    description: 'Nous sommes heureux d\'accueillir Ikram, notre nouveau barbier venu du Pakistan, avec 10 ans d\'expérience dans la coupe masculine. We are happy to welcome Ikram, our new barber from Pakistan, with 10 years of experience in men\'s haircuts.',
    image: '/ikram.webp',
    rating: 4.9,
    reviews: 87,
    specialties: ['Coupe', 'Barbe', 'Kids Skinfade'],
    availability: [
      { day: 1, slots: ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'] },
      { day: 2, slots: ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'] },
      { day: 3, slots: ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'] },
      { day: 4, slots: ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'] },
      { day: 5, slots: ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'] },
      { day: 6, slots: ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'] },
    ],
  },
  {
    id: 'anosha',
    name: 'Anosha',
    role: 'Nail Artist | Manicure & Pedicure',
    description: 'I am a dedicated nail artist focused on providing clean, high-quality manicure and pedicure services. I value precision, comfort, and creating a relaxing experience for every client.',
    image: '/anosha.webp',
    rating: 4.8,
    reviews: 67,
    specialties: ['Manucure', 'Pédicure', 'Nail Art'],
    availability: [
      { day: 1, slots: ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'] },
      { day: 2, slots: ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'] },
      { day: 3, slots: ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'] },
      { day: 4, slots: ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'] },
      { day: 5, slots: ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'] },
      { day: 6, slots: ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'] },
    ],
  },
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Amine B.',
    avatar: 'A',
    rating: 5,
    text: 'Merci Ikram, très professionnel!',
    date: '2024-12-19',
  },
  {
    id: '2',
    name: 'Nicolas P.',
    avatar: 'N',
    rating: 5,
    text: 'Great service 6 stars! Asked Hamed for a fresh mullet.',
    date: '2024-12-16',
  },
  {
    id: '3',
    name: 'Sean F.',
    avatar: 'S',
    rating: 5,
    text: "I stumbled upon this hidden gem in Brossard. Hamed was on point - he gave me a sick fade and beard cut. Don't judge a book by its cover, go check it out!",
    date: '2024-12-16',
  },
  {
    id: '4',
    name: 'Jay',
    avatar: 'J',
    rating: 5,
    text: "Gave this place a try after seeing it on social media. Hamed was professional and friendly. He understood what I wanted and delivered. They also provide a complimentary espresso that is wonderful!",
    date: '2024-12-16',
  },
  {
    id: '5',
    name: 'Mario J.',
    avatar: 'M',
    rating: 5,
    text: "Merci Ikram pour le service professionnel. C'est ma 2e fois à ce salon. Toujours bien reçu et très satisfait de ma coupe. Je recommande Élégant Cut, vous allez repartir satisfait d'un travail impeccable!",
    date: '2024-12-15',
  },
  {
    id: '6',
    name: 'Jp G.',
    avatar: 'J',
    rating: 5,
    text: 'Très professionnel et très propre! Merci beaucoup pour la coupe!',
    date: '2024-12-15',
  },
];

export const businessHours = [
  { day: 'Dimanche', hours: 'Fermé', isOpen: false },
  { day: 'Lundi', hours: '10h00 - 16h00', isOpen: true },
  { day: 'Mardi', hours: '10h00 - 19h00', isOpen: true },
  { day: 'Mercredi', hours: '10h00 - 19h00', isOpen: true },
  { day: 'Jeudi', hours: '10h00 - 20h00', isOpen: true },
  { day: 'Vendredi', hours: '10h00 - 20h00', isOpen: true },
  { day: 'Samedi', hours: '10h00 - 18h00', isOpen: true },
];

export const businessInfo = {
  name: 'Elegant Cutz',
  tagline: "L'Art de la Coupe Parfaite",
  address: '2152 Boul. Lapinière local 112, Québec J4W 1L9',
  phone: '(438) 998-4414',
  email: 'hamedbarber123@gmail.com',
  instagram: '@elegantcut_beautylounge',
  facebook: 'Elegant Cut',
  yearsInBusiness: 10,
  totalClients: 205,
  googleRating: 4.9,
};
