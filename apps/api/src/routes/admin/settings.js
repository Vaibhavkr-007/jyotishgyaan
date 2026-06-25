import express from 'express';
import adminAuth from '../../middleware/adminAuth.js';
import pb from '../../utils/pocketbaseClient.js';
import logger from '../../utils/logger.js';

const router = express.Router();

// Apply admin authentication middleware to all routes in this file
router.use(adminAuth);

const DEFAULT_SETTINGS = {
  profile: {
    name: 'Admin',
    email: process.env.ADMIN_EMAIL || 'admin@astrology.com',
    phone: '',
    avatar: '',
  },
  availability: {
    workingHours: {
      monday: { start: '09:00', end: '18:00' },
      tuesday: { start: '09:00', end: '18:00' },
      wednesday: { start: '09:00', end: '18:00' },
      thursday: { start: '09:00', end: '18:00' },
      friday: { start: '09:00', end: '18:00' },
      saturday: { start: '10:00', end: '16:00' },
      sunday: null,
    },
    timezone: 'Asia/Kolkata',
    bufferTime: 15,
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
  },
  payments: {
    paymentMethods: ['card', 'upi', 'netbanking'],
    currency: 'INR',
    taxSettings: {
      taxRate: 0,
      taxType: 'none',
    },
  },
  calcom: {
    apiKey: process.env.CALCOM_API_KEY || '',
    syncFrequency: 'hourly',
  },
  general: {
    businessName: 'Astrology Consultation',
    description: 'Professional astrology consultation services',
    contactInfo: {
      email: process.env.ADMIN_EMAIL || 'admin@astrology.com',
      phone: process.env.WHATSAPP_PHONE || '',
      website: '',
    },
  },
};

// GET /admin/settings - Get admin settings (protected)
router.get('/', async (req, res) => {
  console.log('[SETTINGS] ========== GET /admin/settings Request Received ==========');
  console.log(`[SETTINGS] User ID: ${req.userId}`);

  try {
    console.log('[SETTINGS] Fetching settings...');
    const settings = await pb.collection('settings').getFullList();

    if (settings.length === 0) {
      console.log('[SETTINGS] No settings found, returning defaults');
      return res.json({
        success: true,
        data: DEFAULT_SETTINGS,
      });
    }

    const settingsData = settings[0];
    console.log('[SETTINGS] Settings found');

    res.json({
      success: true,
      data: {
        profile: settingsData.profile || DEFAULT_SETTINGS.profile,
        availability: settingsData.availability || DEFAULT_SETTINGS.availability,
        notifications: settingsData.notifications || DEFAULT_SETTINGS.notifications,
        payments: settingsData.payments || DEFAULT_SETTINGS.payments,
        calcom: settingsData.calcom || DEFAULT_SETTINGS.calcom,
        general: settingsData.general || DEFAULT_SETTINGS.general,
      },
    });
  } catch (error) {
    console.log(`[SETTINGS] Error fetching settings: ${error.message}`);
    logger.warn('Settings collection not found, returning defaults');
    res.json({
      success: true,
      data: DEFAULT_SETTINGS,
    });
  }
});

// PUT /admin/settings - Update admin settings (protected)
router.put('/', async (req, res) => {
  console.log('[SETTINGS] ========== PUT /admin/settings Request Received ==========');
  console.log(`[SETTINGS] User ID: ${req.userId}`);
  console.log('[SETTINGS] Request body:', req.body);

  const { profile, availability, notifications, payments, calcom, general } = req.body;

  // Validate input
  if (profile && !profile.email) {
    console.log('[SETTINGS] Missing email in profile');
    return res.status(400).json({ error: 'Email is required in profile' });
  }

  if (availability && !availability.timezone) {
    console.log('[SETTINGS] Missing timezone in availability');
    return res.status(400).json({ error: 'Timezone is required in availability' });
  }

  if (general && !general.businessName) {
    console.log('[SETTINGS] Missing businessName in general');
    return res.status(400).json({ error: 'Business name is required in general settings' });
  }

  try {
    console.log('[SETTINGS] Fetching existing settings...');
    const existingSettings = await pb.collection('settings').getFullList();

    let updatedSettings;

    if (existingSettings.length > 0) {
      console.log('[SETTINGS] Updating existing settings...');
      updatedSettings = await pb.collection('settings').update(existingSettings[0].id, {
        profile: profile || DEFAULT_SETTINGS.profile,
        availability: availability || DEFAULT_SETTINGS.availability,
        notifications: notifications || DEFAULT_SETTINGS.notifications,
        payments: payments || DEFAULT_SETTINGS.payments,
        calcom: calcom || DEFAULT_SETTINGS.calcom,
        general: general || DEFAULT_SETTINGS.general,
      });
    } else {
      console.log('[SETTINGS] Creating new settings...');
      updatedSettings = await pb.collection('settings').create({
        profile: profile || DEFAULT_SETTINGS.profile,
        availability: availability || DEFAULT_SETTINGS.availability,
        notifications: notifications || DEFAULT_SETTINGS.notifications,
        payments: payments || DEFAULT_SETTINGS.payments,
        calcom: calcom || DEFAULT_SETTINGS.calcom,
        general: general || DEFAULT_SETTINGS.general,
      });
    }

    console.log('[SETTINGS] Settings updated successfully');

    res.json({
      success: true,
      data: {
        profile: updatedSettings.profile,
        availability: updatedSettings.availability,
        notifications: updatedSettings.notifications,
        payments: updatedSettings.payments,
        calcom: updatedSettings.calcom,
        general: updatedSettings.general,
      },
    });
  } catch (error) {
    console.log(`[SETTINGS] Error updating settings: ${error.message}`);
    logger.error('PUT /admin/settings error:', error.message);
    throw error;
  }
});

export default router;