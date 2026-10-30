import { TemplateId } from '@/data/types';

export interface TemplateSpec {
  key: string;
  val: string;
}

export interface TemplateMetadata {
  id: TemplateId;
  name: string;
  tag: string;
  category: 'vedic' | 'palace' | 'south' | 'modern';
  icon: string;
  description: string;
  specs: TemplateSpec[];
  defaultCouple: {
    groom: string;
    bride: string;
    city: string;
  };
  demoPath: string;
}

export const MASTER_TEMPLATES: TemplateMetadata[] = [
  {
    id: '08_unforgettable_buddhist_wedding',
    name: 'Buddhist Serenity Vivah',
    tag: 'Serene Temple',
    category: 'vedic',
    icon: '☸️',
    description: 'Sacred Bodh Gaya Mahabodhi temple theme featuring calibrated 3D silk cloth physics, Bodhi tree parallax, and serene Buddhist flute music.',
    specs: [
      { val: 'WebGL 3D', key: 'Physics' },
      { val: '24 FPS', key: 'Framerate' },
      { val: 'Temple Flute', key: 'Audio' },
    ],
    defaultCouple: {
      groom: 'Siddharth',
      bride: 'Maya',
      city: 'Bodh Gaya, Bihar',
    },
    demoPath: '/templates/08_unforgettable_buddhist_wedding/',
  },
  {
    id: '07_unforgettable_ram_mandir',
    name: 'Ram Mandir Devotion',
    tag: 'Vedic Vivah',
    category: 'vedic',
    icon: '🚩',
    description: 'Divine Ayodhya Ram Mandir royal architecture, ornate stone carvings, golden ceremonial motifs, and auspicious traditional shehnai hymns.',
    specs: [
      { val: 'Devotional', key: 'Style' },
      { val: 'Shehnai', key: 'Audio' },
      { val: 'Stone & Gold', key: 'Palette' },
    ],
    defaultCouple: {
      groom: 'Akash',
      bride: 'Drashti',
      city: 'Pune, Maharashtra',
    },
    demoPath: '/templates/07_unforgettable_ram_mandir/',
  },
  {
    id: '01_unforgettable_temple_grace',
    name: 'Temple Grace Gopuram',
    tag: 'Traditional South',
    category: 'south',
    icon: '🛕',
    description: 'Traditional South Indian Gopuram architectural majesty with sacred bell chimes, bronze kalasha motifs, and classic temple elegance.',
    specs: [
      { val: 'Gopuram', key: 'Style' },
      { val: 'Nadaswaram', key: 'Audio' },
      { val: 'Temple Gold', key: 'Palette' },
    ],
    defaultCouple: {
      groom: 'Rahul',
      bride: 'Kiran',
      city: 'Chennai, Tamil Nadu',
    },
    demoPath: '/templates/01_unforgettable_temple_grace/',
  },
  {
    id: '02_unforgettable_radha_krishna',
    name: 'Radha Krishna Vrindavan',
    tag: 'Divine Vrindavan',
    category: 'vedic',
    icon: '🦚',
    description: 'Divine Vrindavan love storybook with peacock feather motifs, sacred Yamuna river aesthetic, and sacred bansuri flute resonance.',
    specs: [
      { val: 'Vrindavan', key: 'Theme' },
      { val: 'Bansuri', key: 'Audio' },
      { val: 'Peacock Blue', key: 'Vibe' },
    ],
    defaultCouple: {
      groom: 'Krishna',
      bride: 'Radha',
      city: 'Mathura, Uttar Pradesh',
    },
    demoPath: '/templates/02_unforgettable_radha_krishna/',
  },
  {
    id: '03_unforgettable_pastel_elegance',
    name: 'Royal Pastel Luxury',
    tag: 'Modern Chic',
    category: 'modern',
    icon: '🌸',
    description: 'Contemporary royal chic with blush pastels, delicate botanical gold foil inlays, and modern minimalist wedding luxury.',
    specs: [
      { val: 'Minimal Chic', key: 'Style' },
      { val: 'Piano & Strings', key: 'Audio' },
      { val: 'Blush & Gold', key: 'Palette' },
    ],
    defaultCouple: {
      groom: 'Shiv',
      bride: 'Parwati',
      city: 'Udaipur, Rajasthan',
    },
    demoPath: '/templates/03_unforgettable_pastel_elegance/',
  },
  {
    id: '04_unforgettable_ayodhya_heritage',
    name: 'Ayodhya Vedic Mandir',
    tag: 'Sacred Ayodhya',
    category: 'vedic',
    icon: '🏹',
    description: 'Vedic heritage mandir ceremony with sacred bells, auspicious Sanskrit shlokas, and authentic ceremonial timelines for royal unions.',
    specs: [
      { val: 'Vedic Vivah', key: 'Style' },
      { val: 'Sanskrit Mantras', key: 'Audio' },
      { val: 'Saffron & Gold', key: 'Palette' },
    ],
    defaultCouple: {
      groom: 'Abhishek',
      bride: 'Kanika',
      city: 'Ayodhya, Uttar Pradesh',
    },
    demoPath: '/templates/04_unforgettable_ayodhya_heritage/',
  },
  {
    id: '05_unforgettable_meenakshi_royal',
    name: 'Meenakshi Royal Sanctuary',
    tag: 'Dravidian Heritage',
    category: 'south',
    icon: '🌺',
    description: 'Dravidian temple sanctuary inspired by Madurai stone carvings, grand lotus water ponds, and auspicious ceremonial melodies.',
    specs: [
      { val: 'South Heritage', key: 'Style' },
      { val: 'Nadaswaram', key: 'Audio' },
      { val: 'Temple Stone', key: 'Art' },
    ],
    defaultCouple: {
      groom: 'Vishu',
      bride: 'Kavya',
      city: 'Madurai, Tamil Nadu',
    },
    demoPath: '/templates/05_unforgettable_meenakshi_royal/',
  },
  {
    id: '06_unforgettable_udaipur_palace',
    name: 'Udaipur Lake Palace',
    tag: 'Royal Palace',
    category: 'palace',
    icon: '👑',
    description: 'Regal Rajasthani lakeside heritage with Lake Pichola palace backdrops, royal elephant processions, and majestic ceremonial timelines.',
    specs: [
      { val: 'Royal Lake', key: 'Style' },
      { val: 'Santoor', key: 'Audio' },
      { val: 'Palace Grandeur', key: 'Vibe' },
    ],
    defaultCouple: {
      groom: 'Abhishek',
      bride: 'Kanika',
      city: 'Udaipur, Rajasthan',
    },
    demoPath: '/templates/06_unforgettable_udaipur_palace/',
  },
];
