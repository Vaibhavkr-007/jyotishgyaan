export const astrologyCourses = [
  {
    id: 'astro-1',
    title: 'Foundations of Vedic Astrology',
    description: 'Discover the ancient wisdom of Vedic astrology. Learn to read birth charts, understand planetary influences, and interpret cosmic patterns that shape human destiny.',
    duration: '8 sessions',
    price: 127,
    category: 'astrology',
    level: 'Beginner',
    image: 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d'
  },
  {
    id: 'astro-2',
    title: 'Advanced Planetary Transits',
    description: 'Master the art of predicting life events through planetary movements. Understand dashas, transits, and their profound impact on personal and collective consciousness.',
    duration: '12 sessions',
    price: 197,
    category: 'astrology',
    level: 'Advanced',
    image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a'
  },
  {
    id: 'astro-3',
    title: 'Relationship Astrology & Synastry',
    description: 'Explore the cosmic connections between souls. Learn to analyze compatibility, understand karmic relationships, and guide others in their relationship journeys.',
    duration: '6 sessions',
    price: 149,
    category: 'astrology',
    level: 'Intermediate',
    image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b'
  }
];

export const meditationCourses = [
  {
    id: 'med-1',
    title: 'Chakra Meditation Mastery',
    description: 'Journey through the seven energy centers of your being. Learn powerful techniques to balance, activate, and harmonize your chakras for holistic wellbeing.',
    duration: '5 sessions',
    price: 89,
    category: 'meditation',
    level: 'Beginner',
    image: 'https://images.unsplash.com/photo-1611566620327-5e879d9b0955'
  },
  {
    id: 'med-2',
    title: 'Transcendental Meditation Practice',
    description: 'Access deeper states of consciousness through ancient meditation techniques. Cultivate inner peace, clarity, and spiritual awakening in your daily practice.',
    duration: '8 sessions',
    price: 134,
    category: 'meditation',
    level: 'Intermediate',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773'
  }
];

export const reikiCourses = [
  {
    id: 'reiki-1',
    title: 'Reiki Level 1: Self-Healing',
    description: 'Begin your journey as a Reiki practitioner. Learn to channel universal life force energy for self-healing, stress relief, and energetic balance.',
    duration: '4 sessions',
    price: 167,
    category: 'reiki',
    level: 'Beginner',
    image: 'https://images.unsplash.com/photo-1649434216517-34ed72ca28e9'
  },
  {
    id: 'reiki-2',
    title: 'Reiki Level 2: Practitioner Training',
    description: 'Deepen your healing abilities with sacred symbols and distance healing techniques. Prepare to offer professional Reiki sessions to others.',
    duration: '6 sessions',
    price: 214,
    category: 'reiki',
    level: 'Intermediate',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b'
  }
];

export const tarotCourses = [
  {
    id: 'tarot-1',
    title: 'Tarot Reading Fundamentals',
    description: 'Unlock the mysteries of the 78 cards. Learn card meanings, spreads, and intuitive reading techniques to guide yourself and others with clarity.',
    duration: '7 sessions',
    price: 119,
    category: 'tarot',
    level: 'Beginner',
    image: 'https://images.unsplash.com/photo-1682566737262-4ee52c933e5a'
  },
  {
    id: 'tarot-2',
    title: 'Advanced Tarot & Intuitive Development',
    description: 'Refine your intuitive abilities and master complex spreads. Connect deeply with the cards to deliver transformative readings that inspire and heal.',
    duration: '10 sessions',
    price: 183,
    category: 'tarot',
    level: 'Advanced',
    image: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2'
  }
];

export const allCourses = [
  ...astrologyCourses,
  ...meditationCourses,
  ...reikiCourses,
  ...tarotCourses
];