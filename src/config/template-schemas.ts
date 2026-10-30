import { TemplateId, WeddingInviteData } from '@/data/types';

export interface TemplateFieldSchema {
  id: TemplateId;
  name: string;
  themeTag: string;
  icon: string;
  category: 'vedic' | 'palace' | 'south' | 'modern';
  description: string;
  defaultCouple: {
    groom: string;
    bride: string;
    groomParents: string;
    brideParents: string;
    city: string;
    monogram: string;
    hashtag: string;
    greetingNote: string;
  };
  defaultShloka: {
    deity: string;
    verseSanskrit: string;
    verseEnglish: string;
    translation: string;
  };
  defaultEvents: Array<{
    title: string;
    date: string;
    day: string;
    time: string;
    venueName: string;
    venueAddress: string;
    mapDeepLink: string;
    dressCode: string;
  }>;
  defaultLogistics: {
    weather: string;
    valetParking: string;
    contactName: string;
    contactNumber: string;
    dressCode: string;
    accommodation: string;
  };
  defaultAudio: {
    title: string;
    fileSrc: string;
  };
  imageSlots: Array<{
    key: string;
    label: string;
    description: string;
    defaultUrl: string;
  }>;
}

export const TEMPLATE_SCHEMAS: Record<TemplateId, TemplateFieldSchema> = {
  '07_unforgettable_ram_mandir': {
    id: '07_unforgettable_ram_mandir',
    name: 'Ram Mandir Devotion',
    themeTag: 'Ayodhya Vedic Vivah',
    icon: '🚩',
    category: 'vedic',
    description: 'Divine Ayodhya Ram Mandir royal architecture, sacred saffron flags, golden ceremonial motifs, and auspicious traditional shehnai hymns.',
    defaultCouple: {
      groom: 'Akash',
      bride: 'Drashti',
      groomParents: 'Smt. & Shri Vikram Mehra',
      brideParents: 'Smt. & Shri Alok Verma',
      city: 'Jaipur, Rajasthan',
      monogram: 'A & D',
      hashtag: '#AkashKiDrashti',
      greetingNote: 'With the divine blessings of Lord Rama and our beloved elders, we cordially invite you to celebrate our holy union.',
    },
    defaultShloka: {
      deity: 'Lord Rama & Maha Vishnu',
      verseSanskrit: 'मंगलम् भगवान विष्णुः मंगलम् गरुड़ध्वजः। मंगलम् पुण्डरीकाक्षः मंगलाय तनो हरिः॥',
      verseEnglish: 'Mangalam Bhagwan Vishnuh, Mangalam Garudadhwajah, Mangalam Pundarikakshah, Mangalaya Tano Harih.',
      translation: 'May all auspiciousness and divine grace be bestowed upon this sacred journey of two souls.',
    },
    defaultEvents: [
      {
        title: 'Shubh Mehndi & Sangeet',
        date: '19th Nov 2026',
        day: 'Thursday',
        time: '4:00 PM Onwards',
        venueName: 'The Heritage Haveli Courtyard',
        venueAddress: 'Jaipur, Rajasthan',
        mapDeepLink: 'https://maps.google.com/?q=Jaipur,Rajasthan',
        dressCode: 'Bright Festive Lehengas & Kurtas',
      },
      {
        title: 'Vedic Vivah Sanskar & Pheras',
        date: '20th Nov 2026',
        day: 'Friday',
        time: '6:00 PM Onwards',
        venueName: 'Rambagh Mandir Mandap',
        venueAddress: 'Jaipur, Rajasthan',
        mapDeepLink: 'https://maps.google.com/?q=Jaipur,Rajasthan',
        dressCode: 'Regal Royal Indian Traditional (Maroon & Gold)',
      },
      {
        title: 'Grand Royal Reception',
        date: '21st Nov 2026',
        day: 'Saturday',
        time: '7:30 PM Onwards',
        venueName: 'The Royal Ballroom',
        venueAddress: 'Jaipur, Rajasthan',
        mapDeepLink: 'https://maps.google.com/?q=Jaipur,Rajasthan',
        dressCode: 'Formal Black Tie & Heavy Silks',
      },
    ],
    defaultLogistics: {
      weather: 'Crisp November Evening (18°C - 22°C)',
      valetParking: 'Complimentary valet parking available at Royal Porch Entrance Gate',
      contactName: 'Vikram Mehra (Hospitality Team)',
      contactNumber: '+91 99110 54321',
      dressCode: 'Regal Traditional / Heritage Attire',
      accommodation: 'Luxury heritage suites reserved at the palace venue for outstation guests.',
    },
    defaultAudio: {
      title: 'Deva Shree Ganesha Divine Flute',
      fileSrc: '/templates/07_unforgettable_ram_mandir/audio/mjZh3ISr0YDK01kdBZisCq18TDo.mp3',
    },
    imageSlots: [
      {
        key: 'heroPhoto',
        label: 'Hero Cover Photo',
        description: 'Primary couple portrait displayed on initial load',
        defaultUrl: '/templates/07_unforgettable_ram_mandir/images/3JekLBRwVWegsCm3gX3wOcYeM.webp',
      },
      {
        key: 'groomPhoto',
        label: 'Groom Portrait',
        description: 'Solo photograph for Meet the Groom card',
        defaultUrl: '/templates/07_unforgettable_ram_mandir/images/yL9Xz2N5cM9T4jX8kL2m1p0q.webp',
      },
      {
        key: 'bridePhoto',
        label: 'Bride Portrait',
        description: 'Solo photograph for Meet the Bride card',
        defaultUrl: '/templates/07_unforgettable_ram_mandir/images/kP3wE8m9tL1r4s7v0x2y5n6q.webp',
      },
      {
        key: 'gallery1',
        label: 'Love Story / Candid Photo',
        description: 'Secondary candid portrait in journey gallery',
        defaultUrl: '/templates/07_unforgettable_ram_mandir/images/mQ2wE4r6t8y0u1i3o5p7a9s.webp',
      },
    ],
  },

  '08_unforgettable_buddhist_wedding': {
    id: '08_unforgettable_buddhist_wedding',
    name: 'Buddhist Serenity Vivah',
    themeTag: 'Sacred Bodh Gaya',
    icon: '☸️',
    category: 'vedic',
    description: 'Sacred Bodh Gaya Mahabodhi temple theme featuring calibrated 3D silk cloth physics, Bodhi tree parallax, and serene Buddhist flute meditation.',
    defaultCouple: {
      groom: 'Siddharth',
      bride: 'Maya',
      groomParents: 'Shri Hemant Vardhan & Smt. Sunita Vardhan',
      brideParents: 'Shri Arvind Sharma & Smt. Meena Sharma',
      city: 'Pune, Maharashtra',
      monogram: 'S & M',
      hashtag: '#MayaFoundHerSiddharth',
      greetingNote: 'Together with their families, cordially invite you to celebrate the holy wedding ceremony and sacred Buddhist blessings.',
    },
    defaultShloka: {
      deity: 'Buddha Triple Gem (Triratna)',
      verseSanskrit: 'बुद्धं शरणं गच्छामि • धर्मं शरणं गच्छामि • संघं शरणं गच्छामि',
      verseEnglish: 'Buddham Saranam Gacchami • Dhammam Saranam Gacchami • Sangham Saranam Gacchami',
      translation: 'May wisdom, boundless compassion, and peaceful harmony bless this sacred union for all lifetimes.',
    },
    defaultEvents: [
      {
        title: 'Buddh Vandana & Ring Ceremony',
        date: '28th Aug 2026',
        day: 'Thursday',
        time: '4:00 PM Onwards',
        venueName: 'Lotus Pavilion Hall',
        venueAddress: 'Pune, Maharashtra',
        mapDeepLink: 'https://maps.google.com/?q=Pune,Maharashtra',
        dressCode: 'Indo-Western & Pastel Silks',
      },
      {
        title: 'Sacred Pheras & Triple Gem Blessings',
        date: '29th Aug 2026',
        day: 'Friday',
        time: '6:00 PM Onwards',
        venueName: 'The Grand Lotus Sanctuary',
        venueAddress: 'Pune, Maharashtra',
        mapDeepLink: 'https://maps.google.com/?q=Pune,Maharashtra',
        dressCode: 'Royal Traditional Wedding Attire',
      },
    ],
    defaultLogistics: {
      weather: 'Pleasant monsoon evening (24°C - 28°C)',
      valetParking: 'Complimentary valet parking available at East Sanctuary Gate',
      contactName: 'Rohit Sharma (Guest Liaison)',
      contactNumber: '+91 98200 12345',
      dressCode: 'Royal Pastels / Traditional Elegant Attire',
      accommodation: 'Suites reserved at sanctuary guesthouse for outstation family members.',
    },
    defaultAudio: {
      title: 'Sacred Flute & Bells Meditation',
      fileSrc: '/templates/08_unforgettable_buddhist_wedding/audio/mjZh3ISr0YDK01kdBZisCq18TDo.mp3',
    },
    imageSlots: [
      {
        key: 'heroPhoto',
        label: 'Hero Cover Photo',
        description: 'Centered couple portrait between sacred 3D silk flags',
        defaultUrl: '/templates/08_unforgettable_buddhist_wedding/images/Left Flag.webp',
      },
      {
        key: 'groomPhoto',
        label: 'Groom Solo Photo',
        description: 'Groom bio photo card',
        defaultUrl: '/templates/08_unforgettable_buddhist_wedding/images/g_portrait.webp',
      },
      {
        key: 'bridePhoto',
        label: 'Bride Solo Photo',
        description: 'Bride bio photo card',
        defaultUrl: '/templates/08_unforgettable_buddhist_wedding/images/b_portrait.webp',
      },
    ],
  },

  '01_unforgettable_temple_grace': {
    id: '01_unforgettable_temple_grace',
    name: 'Temple Grace Gopuram',
    themeTag: 'Traditional South Indian',
    icon: '🛕',
    category: 'south',
    description: 'Traditional South Indian Gopuram architectural majesty with sacred bell chimes, bronze kalasha motifs, and classic temple elegance.',
    defaultCouple: {
      groom: 'Rahul',
      bride: 'Kiran',
      groomParents: 'Shri K. Sundaram & Smt. Lakshmi Sundaram',
      brideParents: 'Shri R. Natarajan & Smt. Meenakshi Natarajan',
      city: 'Chennai, Tamil Nadu',
      monogram: 'R & K',
      hashtag: '#RahulWedsKiran',
      greetingNote: 'Seek the blessings of Lord Venkateswara as we step into our new life together with our families.',
    },
    defaultShloka: {
      deity: 'Lord Ganesha & Venkateswara',
      verseSanskrit: 'वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥',
      verseEnglish: 'Vakratunda Mahakaya Suryakoti Samaprabha, Nirvighnam Kuru Me Deva Sarvakaryeshu Sarvada.',
      translation: 'O Lord with curved trunk and immense brilliance, make our new journey auspicious and obstacle-free.',
    },
    defaultEvents: [
      {
        title: 'Shubh Muhurtham & Mangalyadharanam',
        date: '14th Dec 2026',
        day: 'Monday',
        time: '7:30 AM - 9:00 AM',
        venueName: 'Sri Venkateswara Mandapam',
        venueAddress: 'Chennai, Tamil Nadu',
        mapDeepLink: 'https://maps.google.com/?q=Chennai',
        dressCode: 'Kanchipuram Silk Sarees & Traditional Veshtis',
      },
      {
        title: 'Evening Wedding Reception',
        date: '14th Dec 2026',
        day: 'Monday',
        time: '6:30 PM Onwards',
        venueName: 'The Leela Palace Grand Ballroom',
        venueAddress: 'Chennai, Tamil Nadu',
        mapDeepLink: 'https://maps.google.com/?q=Chennai',
        dressCode: 'Traditional South Indian Formal',
      },
    ],
    defaultLogistics: {
      weather: 'Pleasant coastal breeze (26°C - 30°C)',
      valetParking: 'Valet parking available at Gopuram Entrance Arch',
      contactName: 'S. Ramanathan',
      contactNumber: '+91 94440 12345',
      dressCode: 'Traditional South Silk & Gold Zari',
      accommodation: 'Reserved suites at The Leela Palace for traveling guests.',
    },
    defaultAudio: {
      title: 'Auspicious Classical Nadaswaram',
      fileSrc: '/templates/01_unforgettable_temple_grace/audio/nadaswaram.mp3',
    },
    imageSlots: [
      {
        key: 'heroPhoto',
        label: 'Gopuram Hero Photo',
        description: 'Couple framed by traditional South Indian brass kalashas',
        defaultUrl: '/templates/01_unforgettable_temple_grace/images/hero.webp',
      },
    ],
  },

  '02_unforgettable_radha_krishna': {
    id: '02_unforgettable_radha_krishna',
    name: 'Radha Krishna Vrindavan',
    themeTag: 'Divine Vrindavan Love',
    icon: '🦚',
    category: 'vedic',
    description: 'Divine Vrindavan love storybook with peacock feather motifs, sacred Yamuna river aesthetic, and sacred bansuri flute resonance.',
    defaultCouple: {
      groom: 'Krishna',
      bride: 'Radha',
      groomParents: 'Shri Nanda & Smt. Yashoda',
      brideParents: 'Shri Vrishbhanu & Smt. Kirti',
      city: 'Mathura, Uttar Pradesh',
      monogram: 'R & K',
      hashtag: '#RadhaKrishnaPrem',
      greetingNote: 'Immersed in sacred devotion and love, we invite you to be part of our divine wedding celebrations.',
    },
    defaultShloka: {
      deity: 'Radha Krishna',
      verseSanskrit: 'राधे तू बड़भागिनी कौन तपस्या कीन। तीन लोक तरण तारण सो तेरे आधीन॥',
      verseEnglish: 'Radhe Tu Badbhagini Kaun Tapasya Keen, Teen Lok Taran Taran So Tere Aadhin.',
      translation: 'O Radha, you are infinitely blessed; the Lord of the three worlds is bound by your pure love.',
    },
    defaultEvents: [
      {
        title: 'Raas Leela Sangeet & Dandiya',
        date: '5th Feb 2027',
        day: 'Friday',
        time: '6:00 PM Onwards',
        venueName: 'Vrindavan Garden Pavilion',
        venueAddress: 'Mathura, Uttar Pradesh',
        mapDeepLink: 'https://maps.google.com/?q=Mathura',
        dressCode: 'Vibrant Peacock Blue & Yellow Festive',
      },
      {
        title: 'Anand Vivah Sanskar',
        date: '6th Feb 2027',
        day: 'Saturday',
        time: '10:00 AM Onwards',
        venueName: 'Yamuna Riverfront Mandap',
        venueAddress: 'Mathura, Uttar Pradesh',
        mapDeepLink: 'https://maps.google.com/?q=Mathura',
        dressCode: 'Traditional Silk Festive Attire',
      },
    ],
    defaultLogistics: {
      weather: 'Cool spring afternoon (16°C - 21°C)',
      valetParking: 'Valet parking stationed at Yamuna Gate',
      contactName: 'Gopal Sharma',
      contactNumber: '+91 97110 55443',
      dressCode: 'Peacock Shades / Floral Indian Formal',
      accommodation: 'Riverfront cottages reserved for guests.',
    },
    defaultAudio: {
      title: 'Divine Bansuri Meditation',
      fileSrc: '/templates/02_unforgettable_radha_krishna/audio/bansuri.mp3',
    },
    imageSlots: [
      {
        key: 'heroPhoto',
        label: 'Peacock Arch Hero Photo',
        description: 'Centered couple portrait with Vrindavan peacocks',
        defaultUrl: '/templates/02_unforgettable_radha_krishna/images/hero.webp',
      },
    ],
  },

  '03_unforgettable_pastel_elegance': {
    id: '03_unforgettable_pastel_elegance',
    name: 'Royal Pastel Luxury',
    themeTag: 'Modern Minimalist Chic',
    icon: '🌸',
    category: 'modern',
    description: 'Contemporary royal chic with blush pastels, delicate botanical gold foil inlays, and modern minimalist wedding luxury.',
    defaultCouple: {
      groom: 'Shiv',
      bride: 'Parwati',
      groomParents: 'Dr. & Mrs. Malhotra',
      brideParents: 'Mr. & Mrs. Kapoor',
      city: 'Udaipur, Rajasthan',
      monogram: 'S & P',
      hashtag: '#ShivAndParwati',
      greetingNote: 'We request the honor of your presence as we celebrate our love, laughter, and happily ever after.',
    },
    defaultShloka: {
      deity: 'Love & Harmony',
      verseSanskrit: 'यत्र नार्यस्तु पूज्यन्ते रमन्ते तत्र देवताः। यत्रैतास्तु न पूज्यन्ते सर्वास्तत्राफलाः क्रियाः॥',
      verseEnglish: 'Yatra Naryastu Pujyante Ramante Tatra Devatah.',
      translation: 'Where mutual respect and devotion dwell, there divine bliss resides eternally.',
    },
    defaultEvents: [
      {
        title: 'Cocktails & Golden Sunset Soiree',
        date: '18th Jan 2027',
        day: 'Sunday',
        time: '5:30 PM Onwards',
        venueName: 'The Lakefront Terrace',
        venueAddress: 'Udaipur, Rajasthan',
        mapDeepLink: 'https://maps.google.com/?q=Udaipur',
        dressCode: 'Modern Pastels & Tuxedos',
      },
      {
        title: 'White & Blush Floral Vivah',
        date: '19th Jan 2027',
        day: 'Monday',
        time: '4:30 PM Onwards',
        venueName: 'The Glasshouse Pavilion',
        venueAddress: 'Udaipur, Rajasthan',
        mapDeepLink: 'https://maps.google.com/?q=Udaipur',
        dressCode: 'Blush Pink, Sage & Champagne Gold',
      },
    ],
    defaultLogistics: {
      weather: 'Pleasant winter sunset (19°C)',
      valetParking: 'VIP Valet concierge at Glasshouse North Foyer',
      contactName: 'Ananya Malhotra',
      contactNumber: '+91 98190 22334',
      dressCode: 'Subtle Pastels & Contemporary Formal',
      accommodation: 'Luxury lake view villas arranged at the resort.',
    },
    defaultAudio: {
      title: 'Romantic Acoustic Strings & Piano',
      fileSrc: '/templates/03_unforgettable_pastel_elegance/audio/strings.mp3',
    },
    imageSlots: [
      {
        key: 'heroPhoto',
        label: 'Blush Floral Hero Photo',
        description: 'Main portrait in minimalist gold arch',
        defaultUrl: '/templates/03_unforgettable_pastel_elegance/images/hero.webp',
      },
    ],
  },

  '04_unforgettable_ayodhya_heritage': {
    id: '04_unforgettable_ayodhya_heritage',
    name: 'Ayodhya Vedic Mandir',
    themeTag: 'Sacred Mandir Vivah',
    icon: '🏹',
    category: 'vedic',
    description: 'Vedic heritage mandir ceremony with sacred bells, auspicious Sanskrit shlokas, and authentic ceremonial timelines for royal unions.',
    defaultCouple: {
      groom: 'Abhishek',
      bride: 'Kanika',
      groomParents: 'Shri & Smt. D. K. Singhania',
      brideParents: 'Shri & Smt. S. P. Agrawal',
      city: 'Ayodhya, Uttar Pradesh',
      monogram: 'A & K',
      hashtag: '#AbhiKiKanika',
      greetingNote: 'In the sacred realm of Ayodhya, surrounded by Vedic chants and holy fires, we invite you to bless our marriage.',
    },
    defaultShloka: {
      deity: 'Lord Rama & Sita',
      verseSanskrit: 'राम लक्ष्मण जानकी जय बोलो हनुमान की। मंगल भवन अमंगल हारी द्रबहु सुदसरथ अजर बिहारी॥',
      verseEnglish: 'Mangala Bhavana Amangala Haari, Drabahu Sudasaratha Ajira Bihaari.',
      translation: 'May the divine presence of Sri Rama remove all tribulations and bring eternal peace.',
    },
    defaultEvents: [
      {
        title: 'Shri Sunderkand Path & Bhajan Sandhya',
        date: '10th Mar 2027',
        day: 'Wednesday',
        time: '4:00 PM Onwards',
        venueName: 'Saryu Riverfront Mandap',
        venueAddress: 'Ayodhya, Uttar Pradesh',
        mapDeepLink: 'https://maps.google.com/?q=Ayodhya',
        dressCode: 'Saffron & Traditional Ethnic',
      },
      {
        title: 'Vedic Pheras & Saptapadi Ceremony',
        date: '11th Mar 2027',
        day: 'Thursday',
        time: '5:30 PM Onwards',
        venueName: 'Ayodhya Heritage Palace',
        venueAddress: 'Ayodhya, Uttar Pradesh',
        mapDeepLink: 'https://maps.google.com/?q=Ayodhya',
        dressCode: 'Royal Banarasi Silks & Sherwanis',
      },
    ],
    defaultLogistics: {
      weather: 'Crisp spring breeze (20°C - 24°C)',
      valetParking: 'Valet service stationed at Saryu Gate',
      contactName: 'Raghav Singhania',
      contactNumber: '+91 98390 11223',
      dressCode: 'Vedic Traditional Indian Formal',
      accommodation: 'Heritage guest accommodations along the sacred river.',
    },
    defaultAudio: {
      title: 'Sacred Sanskrit Mantras & Conch',
      fileSrc: '/templates/04_unforgettable_ayodhya_heritage/audio/mantras.mp3',
    },
    imageSlots: [
      {
        key: 'heroPhoto',
        label: 'Mandir Pillar Hero Photo',
        description: 'Portrait framed by carved sandstone pillars',
        defaultUrl: '/templates/04_unforgettable_ayodhya_heritage/images/hero.webp',
      },
    ],
  },

  '05_unforgettable_meenakshi_royal': {
    id: '05_unforgettable_meenakshi_royal',
    name: 'Meenakshi Royal Sanctuary',
    themeTag: 'Dravidian Temple Royalty',
    icon: '🌺',
    category: 'south',
    description: 'Dravidian temple sanctuary inspired by Madurai stone carvings, grand lotus water ponds, and auspicious ceremonial melodies.',
    defaultCouple: {
      groom: 'Vishu',
      bride: 'Kavya',
      groomParents: 'Shri M. Balakrishnan & Smt. Shanthi',
      brideParents: 'Shri T. Subramaniam & Smt. Radha',
      city: 'Madurai, Tamil Nadu',
      monogram: 'V & K',
      hashtag: '#VishuWedsKavya',
      greetingNote: 'With the blessings of Goddess Meenakshi and Lord Sundareswarar, we cordially invite you to our wedding.',
    },
    defaultShloka: {
      deity: 'Goddess Meenakshi',
      verseSanskrit: 'सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके। शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते॥',
      verseEnglish: 'Sarva Mangala Mangalye Shive Sarvartha Sadhike, Sharanye Tryambake Gauri Narayani Namostute.',
      translation: 'Auspicious of all auspiciousness, fulfilling all desires; we surrender unto the Divine Mother.',
    },
    defaultEvents: [
      {
        title: 'Traditional Oonjal & Garland Exchange',
        date: '2nd Apr 2027',
        day: 'Friday',
        time: '8:00 AM Onwards',
        venueName: 'The Golden Lotus Pavilion',
        venueAddress: 'Madurai, Tamil Nadu',
        mapDeepLink: 'https://maps.google.com/?q=Madurai',
        dressCode: 'Traditional Madurai Cottons & Pure Kanchipuram Silks',
      },
      {
        title: 'Sacred Vivaha Samskaram',
        date: '2nd Apr 2027',
        day: 'Friday',
        time: '10:30 AM Onwards',
        venueName: 'Royal Sanctuary Mandap',
        venueAddress: 'Madurai, Tamil Nadu',
        mapDeepLink: 'https://maps.google.com/?q=Madurai',
        dressCode: 'Traditional South Indian Temple Formal',
      },
    ],
    defaultLogistics: {
      weather: 'Warm morning breeze (27°C - 31°C)',
      valetParking: 'Valet parking at Lotus Pond Archway',
      contactName: 'Karthik Subramaniam',
      contactNumber: '+91 94880 77665',
      dressCode: 'Pure South Silks & Dhotis',
      accommodation: 'Heritage resort suites arranged for all guests.',
    },
    defaultAudio: {
      title: 'Grand Temple Nadaswaram & Thavil',
      fileSrc: '/templates/05_unforgettable_meenakshi_royal/audio/thavil.mp3',
    },
    imageSlots: [
      {
        key: 'heroPhoto',
        label: 'Lotus Temple Hero Photo',
        description: 'Centered couple portrait with stone temple pillars',
        defaultUrl: '/templates/05_unforgettable_meenakshi_royal/images/hero.webp',
      },
    ],
  },

  '06_unforgettable_udaipur_palace': {
    id: '06_unforgettable_udaipur_palace',
    name: 'Udaipur Palace Royalty',
    themeTag: 'Regal Rajputana Luxury',
    icon: '🏰',
    category: 'palace',
    description: 'Regal Rajputana luxury wedding inspired by Udaipur lake palaces, grand marble jharokhas, torchlit courtyards, and royal royal trumpets.',
    defaultCouple: {
      groom: 'Abhishek',
      bride: 'Kanika',
      groomParents: 'Rana & Rani Saheb of Mewar',
      brideParents: 'Thakur & Thakurani Saheb',
      city: 'Udaipur, Rajasthan',
      monogram: 'A & K',
      hashtag: '#RoyalUdaipurVivah',
      greetingNote: 'In the grand halls of Lake Palace Udaipur, amidst royal traditions and celebrations, we invite you to grace our wedding.',
    },
    defaultShloka: {
      deity: 'Lord Eklingji (Shiva)',
      verseSanskrit: 'ॐ नमः शिवाय शुभं कुरु कुरु शिवाय नमः ॐ। एकलिंगेश्वरो रक्षतु सदा सर्वमंगलम्॥',
      verseEnglish: 'Om Namah Shivaya Shubham Kuru Kuru Shivaya Namah Om, Eklingeshwaro Rakshatu Sada Sarvamangalam.',
      translation: 'May Lord Eklingji shower supreme auspiciousness, protection, and eternal harmony on this union.',
    },
    defaultEvents: [
      {
        title: 'Shubh Mehndi by the Lake',
        date: '24th Feb 2027',
        day: 'Wednesday',
        time: '3:00 PM Onwards',
        venueName: 'Lake Pichola Promenade',
        venueAddress: 'Udaipur, Rajasthan',
        mapDeepLink: 'https://maps.google.com/?q=Udaipur',
        dressCode: 'Royal Rajasthani Lehariya & Bandhej',
      },
      {
        title: 'Rajputana Vivah Sanskar',
        date: '25th Feb 2027',
        day: 'Thursday',
        time: '6:30 PM Onwards',
        venueName: 'The Jagmandir Island Courtyard',
        venueAddress: 'Udaipur, Rajasthan',
        mapDeepLink: 'https://maps.google.com/?q=Udaipur',
        dressCode: 'Regal Royal Sherwanis & Poshaaks',
      },
    ],
    defaultLogistics: {
      weather: 'Crisp lake evening (17°C - 21°C)',
      valetParking: 'Private boat jetty transfer from City Palace Jetty',
      contactName: 'Bhanwar Singh (Royal Concierge)',
      contactNumber: '+91 99280 44332',
      dressCode: 'Royal Heritage Poshaaks & Jodhpuris',
      accommodation: 'Palace island rooms arranged for all esteemed guests.',
    },
    defaultAudio: {
      title: 'Royal Rajasthani Shehnai & Nagada',
      fileSrc: '/templates/06_unforgettable_udaipur_palace/audio/shehnai.mp3',
    },
    imageSlots: [
      {
        key: 'heroPhoto',
        label: 'Palace Jharokha Hero Photo',
        description: 'Grand royal portrait set in carved marble jharokha',
        defaultUrl: '/templates/06_unforgettable_udaipur_palace/images/hero.webp',
      },
    ],
  },
};
