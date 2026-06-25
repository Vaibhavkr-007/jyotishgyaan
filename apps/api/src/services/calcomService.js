import 'dotenv/config';
import logger from '../utils/logger.js';

const CAL_COM_API_KEY = process.env.CALCOM_API_KEY;
const CAL_COM_BASE_URL = process.env.CALCOM_BASE_URL || 'https://api.cal.com/v2';

if (!CAL_COM_API_KEY) {
  logger.warn('CALCOM_API_KEY is not set in environment variables');
}

/**
 * Sleep for specified milliseconds
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Calculate exponential backoff delay
 * @param {number} attempt - Attempt number (0-indexed)
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {number} Delay in milliseconds
 */
const getBackoffDelay = (attempt, baseDelay = 1000) => {
  return baseDelay * Math.pow(2, attempt);
};

const calcomService = {
  /**
   * Get availability slots from Cal.com
   * @param {number} eventTypeId - Cal.com event type ID (5798043=chat, 5798042=audio, 5798041=video)
   * @param {string} startDate - Start date in YYYY-MM-DD format
   * @param {string} endDate - End date in YYYY-MM-DD format (optional, defaults to 7 days from start)
   * @returns {Promise<Array>} Array of available slots
   */
  async getAvailabilitySlots(eventTypeId, startDate, endDate) {
    console.log('[CALCOM] ========== getAvailabilitySlots Request ==========');
    console.log(`[CALCOM] eventTypeId: ${eventTypeId}`);
    console.log(`[CALCOM] startDate: ${startDate}`);
    console.log(`[CALCOM] endDate: ${endDate || '(not provided)'}`);

    if (!CAL_COM_API_KEY) {
      console.log('[CALCOM] ✗ CALCOM_API_KEY is not configured');
      logger.error('[CALCOM] CALCOM_API_KEY is not configured');
      throw new Error('Cal.com API key is not configured');
    }

    if (!eventTypeId) {
      console.log('[CALCOM] ✗ eventTypeId is required');
      logger.error('[CALCOM] eventTypeId is required');
      throw new Error('eventTypeId is required');
    }

    if (!startDate) {
      console.log('[CALCOM] ✗ startDate is required');
      logger.error('[CALCOM] startDate is required');
      throw new Error('startDate is required');
    }

    // ============================================================================
    // STEP 1: Validate and parse start date
    // ============================================================================
    console.log('[CALCOM] ========== Validating Start Date ==========');
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(startDate)) {
      console.log(`[CALCOM] ✗ Invalid date format: ${startDate}`);
      logger.error(`[CALCOM] Invalid date format: ${startDate}`);
      throw new Error(`Invalid date format: ${startDate}. Expected YYYY-MM-DD`);
    }
    console.log(`[CALCOM] ✓ Valid date format: ${startDate}`);

    // ============================================================================
    // STEP 2: Calculate end date if not provided (7 days from start date)
    // ============================================================================
    console.log('[CALCOM] ========== Calculating End Date ==========');
    let finalEndDate = endDate;
    if (!endDate) {
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(startDateObj);
      endDateObj.setDate(endDateObj.getDate() + 7);
      finalEndDate = endDateObj.toISOString().split('T')[0];
      console.log(`[CALCOM] End date not provided, calculated as 7 days from start`);
    }
    console.log(`[CALCOM] Start date: ${startDate}`);
    console.log(`[CALCOM] End date: ${finalEndDate}`);

    // ============================================================================
    // STEP 3: Build query parameters
    // ============================================================================
    console.log('[CALCOM] ========== Building Query Parameters ==========');
    const queryParams = new URLSearchParams();
    queryParams.append('eventTypeId', eventTypeId);
    queryParams.append('start', startDate);
    queryParams.append('end', finalEndDate);
    queryParams.append('timeZone', 'Asia/Kolkata');

    console.log('[CALCOM] Query parameters:');
    console.log(`[CALCOM]   - eventTypeId: ${eventTypeId}`);
    console.log(`[CALCOM]   - startDate: ${startDate}`);
    console.log(`[CALCOM]   - endDate: ${finalEndDate}`);
    console.log('[CALCOM]   - timeZone: Asia/Kolkata');

    // ============================================================================
    // STEP 4: Build request URL and headers
    // ============================================================================
    console.log('[CALCOM] ========== Building Request ==========');
    const url = `${CAL_COM_BASE_URL}/slots?${queryParams.toString()}`;
    console.log(`[CALCOM] URL: ${url}`);

    const headers = {
      'Authorization': CAL_COM_API_KEY,
      'Content-Type': 'application/json',
      'cal-api-version': '2024-09-04',
    };
    console.log('[CALCOM] Headers:');
    console.log('[CALCOM]   - Authorization: Bearer [REDACTED]');
    console.log('[CALCOM]   - Content-Type: application/json');
    console.log('[CALCOM]   - cal-api-version: 2024-09-04');

    // ============================================================================
    // STEP 5: Make API request
    // ============================================================================
    console.log('[CALCOM] ========== Making API Request ==========');
    console.log('[CALCOM] Sending GET request to Cal.com API...');

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    console.log(`[CALCOM] Response status: ${response.status}`);
    console.log(`[CALCOM] Response status text: ${response.statusText}`);

    // ============================================================================
    // STEP 6: Handle response errors
    // ============================================================================
    console.log('[CALCOM] ========== Handling Response ==========');

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`[CALCOM] ✗ API error response:`);
      console.log(`[CALCOM]   - Status: ${response.status}`);
      console.log(`[CALCOM]   - Status text: ${response.statusText}`);
      console.log(`[CALCOM]   - Body: ${errorText}`);
      logger.error(`[CALCOM] Cal.com API error ${response.status}: ${errorText}`);
      throw new Error(`Cal.com API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    console.log('[CALCOM] ✓ Response OK (status 200)');

    // ============================================================================
    // STEP 7: Parse response JSON
    // ============================================================================
    console.log('[CALCOM] ========== Parsing Response JSON ==========');
    let data;
    try {
      data = await response.json();
      console.log('[CALCOM] ✓ Response parsed successfully');
      console.log('[CALCOM] Response structure:');
      console.log(`[CALCOM]   - Keys: ${Object.keys(data).join(', ')}`);
    } catch (parseError) {
      console.log(`[CALCOM] ✗ Failed to parse response JSON: ${parseError.message}`);
      logger.error(`[CALCOM] Failed to parse response JSON: ${parseError.message}`);
      throw new Error(`Failed to parse Cal.com response: ${parseError.message}`);
    }

    // ============================================================================
    // STEP 8: Extract slots from response
    // ============================================================================
    console.log('[CALCOM] ========== Extracting Slots ==========');
    console.log('[CALCOM] Looking for slots in response.data...');

    if (!data.data) {
      console.log('[CALCOM] ✗ response.data is missing');
      logger.error('[CALCOM] response.data is missing from Cal.com API response');
      throw new Error('Invalid Cal.com response: missing data property');
    }

    console.log('[CALCOM] ✓ response.data exists');
    console.log(`[CALCOM] response.data type: ${typeof data.data}`);
    console.log(`[CALCOM] response.data keys: ${Object.keys(data.data).join(', ')}`);

    // ============================================================================
    // STEP 9: Flatten slots using Object.values().flat()
    // ============================================================================
    console.log('[CALCOM] ========== Flattening Slots ==========');
    console.log('[CALCOM] Flattening slots using Object.values().flat()...');

    let slots;
    try {
      const slotValues = Object.values(data.data);
      console.log(`[CALCOM] Object.values() returned ${slotValues.length} items`);
      console.log('[CALCOM] Item types:');
      slotValues.forEach((item, index) => {
        console.log(`[CALCOM]   - Item ${index}: ${Array.isArray(item) ? 'Array' : typeof item}`);
        if (Array.isArray(item)) {
          console.log(`[CALCOM]     - Length: ${item.length}`);
        }
      });

      slots = slotValues.flat();
      console.log(`[CALCOM] ✓ Flattened slots: ${slots.length} total slots`);
    } catch (flattenError) {
      console.log(`[CALCOM] ✗ Failed to flatten slots: ${flattenError.message}`);
      logger.error(`[CALCOM] Failed to flatten slots: ${flattenError.message}`);
      throw new Error(`Failed to flatten Cal.com slots: ${flattenError.message}`);
    }

    // ============================================================================
    // STEP 10: Validate slots array
    // ============================================================================
    console.log('[CALCOM] ========== Validating Slots Array ==========');

    if (!Array.isArray(slots)) {
      console.log(`[CALCOM] ✗ Slots is not an array: ${typeof slots}`);
      logger.error(`[CALCOM] Slots is not an array after flattening`);
      throw new Error('Slots is not an array after flattening');
    }

    console.log(`[CALCOM] ✓ Slots is a valid array with ${slots.length} items`);

    if (slots.length === 0) {
      console.log('[CALCOM] ⚠ No slots available for the requested date range');
      logger.warn(`[CALCOM] No slots available for ${startDate} to ${finalEndDate}`);
    } else {
      console.log('[CALCOM] Sample slot structure:');
      const sampleSlot = slots[0];
      console.log(`[CALCOM]   - Keys: ${Object.keys(sampleSlot).join(', ')}`);
      console.log(`[CALCOM]   - Sample: ${JSON.stringify(sampleSlot).substring(0, 100)}...`);
    }

    // ============================================================================
    // STEP 11: Return success
    // ============================================================================
    console.log('[CALCOM] ========== Success ==========');
    console.log(`[CALCOM] Successfully fetched ${slots.length} available slots`);
    console.log('[CALCOM] ========== getAvailabilitySlots Complete ==========');

    logger.info(`[CALCOM] Successfully fetched ${slots.length} available slots for ${startDate}`);

    return slots;
  },

  /**
   * Test Cal.com API key validity
   * @param {string} apiKey - Cal.com API key
   * @returns {Promise<{valid: boolean, error: string|null}>}
   */
  async testApiKey(apiKey) {
    if (!apiKey) {
      logger.error('testApiKey: API key is empty');
      return { valid: false, error: 'API key is required' };
    }

    logger.info('testApiKey: Testing Cal.com API key validity');

    try {
      const response = await fetch(`${CAL_COM_BASE_URL}/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      logger.info(`testApiKey: Response status ${response.status}`);

      if (response.status === 401) {
        logger.error('testApiKey: Invalid API key (401 Unauthorized)');
        return { valid: false, error: 'Invalid API key - authentication failed' };
      }

      if (response.status === 403) {
        logger.error('testApiKey: Forbidden (403) - API key may not have required permissions');
        return { valid: false, error: 'API key does not have required permissions' };
      }

      if (response.status === 429) {
        logger.warn('testApiKey: Rate limited (429)');
        return { valid: false, error: 'Rate limited - too many requests' };
      }

      if (!response.ok) {
        const errorText = await response.text();
        logger.error(`testApiKey: API error ${response.status}: ${errorText}`);
        return { valid: false, error: `API error: ${response.status} ${response.statusText}` };
      }

      const data = await response.json();
      logger.info(`testApiKey: API key is valid. User: ${data.user?.email || 'unknown'}`);
      return { valid: true, error: null };
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        logger.error(`testApiKey: Network error - endpoint unreachable: ${error.message}`);
        return { valid: false, error: 'Cal.com endpoint unreachable - network error' };
      }
      logger.error(`testApiKey: Unexpected error: ${error.message}`);
      return { valid: false, error: `Unexpected error: ${error.message}` };
    }
  },

  /**
   * Fetch availability slots from Cal.com with retry logic
   * @param {string} apiKey - Cal.com API key
   * @param {number} maxRetries - Maximum number of retries (default: 3)
   * @returns {Promise<{slots: Array|null, error: string|null}>}
   */
  async fetchCalcomAvailability(apiKey, maxRetries = 3) {
    if (!apiKey) {
      logger.error('fetchCalcomAvailability: API key is empty');
      return { slots: null, error: 'API key is required' };
    }

    logger.info('fetchCalcomAvailability: Starting to fetch availability from Cal.com');

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        logger.info(`fetchCalcomAvailability: Attempt ${attempt + 1}/${maxRetries}`);

        const response = await fetch(`${CAL_COM_BASE_URL}/availability`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        });

        logger.info(`fetchCalcomAvailability: Response status ${response.status}`);

        if (response.status === 401) {
          logger.error('fetchCalcomAvailability: Invalid API key (401 Unauthorized)');
          return { slots: null, error: 'Invalid API key - authentication failed' };
        }

        if (response.status === 403) {
          logger.error('fetchCalcomAvailability: Forbidden (403)');
          return { slots: null, error: 'API key does not have required permissions' };
        }

        if (response.status === 429) {
          logger.warn(`fetchCalcomAvailability: Rate limited (429) on attempt ${attempt + 1}`);
          if (attempt < maxRetries - 1) {
            const delay = getBackoffDelay(attempt);
            logger.info(`fetchCalcomAvailability: Retrying after ${delay}ms`);
            await sleep(delay);
            continue;
          }
          return { slots: null, error: 'Rate limited - too many requests' };
        }

        if (!response.ok) {
          const errorText = await response.text();
          logger.error(`fetchCalcomAvailability: API error ${response.status}: ${errorText}`);
          if (attempt < maxRetries - 1) {
            const delay = getBackoffDelay(attempt);
            logger.info(`fetchCalcomAvailability: Retrying after ${delay}ms`);
            await sleep(delay);
            continue;
          }
          return { slots: null, error: `API error: ${response.status} ${response.statusText}` };
        }

        const data = await response.json();

        if (!data || typeof data !== 'object') {
          logger.error('fetchCalcomAvailability: Malformed response - not a valid JSON object');
          return { slots: null, error: 'Malformed response from Cal.com API' };
        }

        const slots = data.slots || data.availability || [];

        if (!Array.isArray(slots)) {
          logger.error('fetchCalcomAvailability: Malformed response - slots is not an array');
          return { slots: null, error: 'Malformed response - invalid slots format' };
        }

        logger.info(`fetchCalcomAvailability: Successfully fetched ${slots.length} slots from Cal.com`);
        return { slots, error: null };
      } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
          logger.error(`fetchCalcomAvailability: Network error - endpoint unreachable: ${error.message}`);
          return { slots: null, error: 'Cal.com endpoint unreachable - network error' };
        }
        logger.error(`fetchCalcomAvailability: Error on attempt ${attempt + 1}: ${error.message}`);
        if (attempt < maxRetries - 1) {
          const delay = getBackoffDelay(attempt);
          logger.info(`fetchCalcomAvailability: Retrying after ${delay}ms`);
          await sleep(delay);
        } else {
          return { slots: null, error: `Unexpected error: ${error.message}` };
        }
      }
    }

    return { slots: null, error: 'Max retries exceeded' };
  },

  /**
   * Create a booking in Cal.com
   * @param {string} eventTypeId - Cal.com event type ID
   * @param {string} startTime - ISO 8601 start time
   * @param {string} endTime - ISO 8601 end time
   * @param {string} customerEmail - Customer email
   * @param {string} customerName - Customer name
   * @returns {Promise<{bookingId: string, zoomLink: string, meetingLink: string}>}
   */
  async createBooking(
      eventTypeId,
      startTime,
      customerEmail,
      customerName
  ) {

      const body = {
          start: startTime,
          eventTypeId,
          attendee: {
              name: customerName,
              timeZone: "Asia/Kolkata",
              language: "en",
              email: customerEmail,
          },
      };

      console.log("================================================");
      console.log("CAL REQUEST BODY:");
      console.log(JSON.stringify(body, null, 2));

      const response = await fetch(
          `${CAL_COM_BASE_URL}/bookings`,
          {
              method: "POST",
              headers: {
                  Authorization: CAL_COM_API_KEY,
                  "Content-Type": "application/json",
                  "cal-api-version": "2026-02-25",
              },
              body: JSON.stringify(body),
          }
      );

      const text = await response.text();

      console.log("CAL STATUS:", response.status);
      console.log("CAL RESPONSE:");
      console.log(text);
      console.log("================================================");

      if (!response.ok) {
          throw new Error(
              `Cal.com API error: ${response.status} ${text}`
          );
      }

      return JSON.parse(text);
  },

  /**
   * Sync availability with Cal.com
   * @param {string} eventTypeId - Cal.com event type ID
   * @param {Array} availability - Availability slots
   * @returns {Promise<{success: boolean}>}
   */
  async syncAvailability(eventTypeId, availability) {
    const response = await fetch(`${CAL_COM_BASE_URL}/event-types/${eventTypeId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CAL_COM_API_KEY}`,
      },
      body: JSON.stringify({
        availability,
      }),
    });

    if (!response.ok) {
      throw new Error(`Cal.com API error: ${response.status} ${response.statusText}`);
    }

    logger.info(`Availability synced for event type ${eventTypeId}`);

    return { success: true };
  },

  /**
   * Handle Cal.com webhook events
   * @param {Object} payload - Webhook payload
   * @returns {Promise<{processed: boolean}>}
   */
  async handleWebhooks(payload) {
    const { triggerEvent, data } = payload;

    logger.info(`Cal.com webhook received: ${triggerEvent}`);

    switch (triggerEvent) {
      case 'BOOKING_CREATED':
        logger.info(`Booking created: ${data.booking?.id}`);
        break;
      case 'BOOKING_RESCHEDULED':
        logger.info(`Booking rescheduled: ${data.booking?.id}`);
        break;
      case 'BOOKING_CANCELLED':
        logger.info(`Booking cancelled: ${data.booking?.id}`);
        break;
      default:
        logger.warn(`Unknown webhook event: ${triggerEvent}`);
    }

    return { processed: true };
  },

  /**
   * Get Zoom link from booking
   * @param {string} bookingId - Cal.com booking ID
   * @returns {Promise<{zoomLink: string}>}
   */
  async getZoomLink(bookingId) {
    const response = await fetch(`${CAL_COM_BASE_URL}/bookings/${bookingId}`, {
      headers: {
        'Authorization': `Bearer ${CAL_COM_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Cal.com API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return {
      zoomLink: data.booking?.videoCallData?.url,
    };
  },

  async rescheduleBooking(

      bookingUid,

      start,

      rescheduledBy,

      reason

  ) {

      const response =
          await fetch(

              `${CAL_COM_BASE_URL}/bookings/${bookingUid}/reschedule`,

              {

                  method: 'POST',

                  headers: {

                      Authorization:
                          CAL_COM_API_KEY,

                      'Content-Type':
                          'application/json',

                      'cal-api-version':
                          '2026-02-25',

                  },

                  body: JSON.stringify({

                      start,

                      rescheduledBy,

                      reschedulingReason: reason,

                  }),

              }

          );

      const text =
          await response.text();

      if (!response.ok) {

          throw new Error(

              `Cal.com error: ${text}`

          );

      }

      return JSON.parse(text);

  },

  async cancelBooking(
      bookingUid,
      cancellationReason
  ) {

      const response =
          await fetch(

              `${CAL_COM_BASE_URL}/bookings/${bookingUid}/cancel`,

              {

                  method: 'POST',

                  headers: {

                      Authorization:
                          CAL_COM_API_KEY,

                      'Content-Type':
                          'application/json',

                      'cal-api-version':
                          '2026-02-25',

                  },

                  body: JSON.stringify({

                      cancellationReason,

                  }),

              }

          );

      const text =
          await response.text();

      if (!response.ok) {

          throw new Error(

              `Cal.com error: ${text}`

          );

      }

      return JSON.parse(text);

  },
  
};

export default calcomService;
export { calcomService };