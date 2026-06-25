import express from 'express';
import adminAuth from '../../middleware/adminAuth.js';
import pb from '../../utils/pocketbaseClient.js';

const router = express.Router();

// Apply admin authentication middleware to all routes in this file
router.use(adminAuth);

const DEFAULT_PRICING = {
  chat: { price: 500, duration: 10 },
  audio: { price: 1000, duration: 15 },
  video: { price: 1500, duration: 30 },
};

// GET /admin/pricing - Get current pricing (protected)
router.get('/', async (req, res) => {
  const pricing = await pb.collection('pricing').getFullList();

  if (pricing.length === 0) {
    return res.json({
      pricing: DEFAULT_PRICING,
    });
  }

  const pricingMap = {};
  pricing.forEach(p => {
    pricingMap[p.consultationType] = {
      price: p.price,
      duration: p.duration,
      enabled: p.enabled !== false,
    };
  });

  res.json({
    pricing: pricingMap,
  });
});

// PUT /admin/pricing - Update pricing (protected)
router.put('/', async (req, res) => {
  const { chat, audio, video } = req.body;

  if (!chat || !audio || !video) {
    return res.status(400).json({ error: 'All consultation types must have pricing' });
  }

  // Delete existing pricing
  const existing = await pb.collection('pricing').getFullList();
  for (const item of existing) {
    await pb.collection('pricing').delete(item.id);
  }

  // Create new pricing
  const created = [];
  for (const [type, data] of Object.entries({ chat, audio, video })) {
    const pricing = await pb.collection('pricing').create({
      consultationType: type,
      price: data.price,
      duration: data.duration,
      enabled: true,
    });
    created.push(pricing);
  }

  res.json({
    message: 'Pricing updated successfully',
    pricing: {
      chat,
      audio,
      video,
    },
  });
});

// GET /admin/pricing/history - Get pricing history (protected)
router.get('/history', async (req, res) => {
  const pricing = await pb.collection('pricing').getFullList({
    sort: '-updatedAt',
  });

  res.json({
    history: pricing.map(p => ({
      id: p.id,
      consultationType: p.consultationType,
      price: p.price,
      duration: p.duration,
      changedAt: p.updatedAt,
    })),
  });
});

export default router;
