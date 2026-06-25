
export const consultationServices = [
  {
    id: 'tarot-reading',
    name: 'Tarot Reading',
    icon: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1682566737262-4ee52c933e5a',
    description: 'Spiritual guidance through tarot cards, life insights, and future predictions.',
    duration: '',
    price: '',
    benefits: [
      'Clarity on life decisions',
      'Spiritual insights',
      'Future guidance',
      'Personalized readings'
    ]
  },
  {
    id: 'kundli-vishleshan',
    name: 'Kundli Vishleshan',
    icon: 'Star',
    image: 'https://images.unsplash.com/photo-1685478237361-a5b50d0eb76b',
    description: 'Comprehensive Vedic birth chart analysis, planetary positions, life path insights, and remedies.',
    duration: '',
    price: '',
    benefits: [
      'Understand life purpose',
      'Planetary influences',
      'Personalized remedies',
      'Career & relationship insights'
    ]
  },
  {
    id: 'reiki-healing',
    name: 'Reiki Healing Consultation',
    icon: 'Zap',
    image: 'https://images.unsplash.com/photo-1649434216517-34ed72ca28e9',
    description: 'Deep energy healing and chakra balancing to cleanse blockages and promote profound spiritual wellness.',
    duration: '',
    price: '',
    benefits: [
      'Chakra Balancing',
      'Energy Cleansing',
      'Spiritual Healing',
      'Stress Relief'
    ]
  },
  {
    id: 'personalized-consultancy',
    name: 'Personalized Consultancy',
    icon: 'Heart',
    image: 'https://images.unsplash.com/photo-1567868547823-6412002b77bd',
    description: 'One-on-one customized guidance combining astrology, tarot, reiki, and tailored life coaching.',
    duration: '',
    price: '',
    benefits: [
      'Customized Guidance',
      'Multi-Modality Approach',
      'Life Coaching',
      'Spiritual Direction'
    ]
  }
];

export const consultationPricingOptions = [
  {
    id: 'chat',
    type: 'Chat Consultation',
    duration: 10,
    price: 500,
    icon: 'MessageCircle',
    description: 'Quick answers and instant spiritual insights via secure text chat.'
  },
  {
    id: 'audio',
    type: 'Audio Consultation',
    duration: 15,
    price: 1000,
    icon: 'Phone',
    description: 'Detailed discussion and personalized guidance over a voice call.'
  },
  {
    id: 'video',
    type: 'Video Consultation',
    duration: 30,
    price: 1500,
    icon: 'Video',
    description: 'In-depth face-to-face spiritual reading and comprehensive analysis.',
    recommended: true
  }
];
