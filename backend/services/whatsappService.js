// WhatsApp Service using Africa's Talking
const africastalking = require('africastalking');

// Company WhatsApp number that receives messages
const COMPANY_WHATSAPP_NUMBER = process.env.COMPANY_WHATSAPP_NUMBER || '+254799789956';

// Lazy initialization of Africa's Talking (only when credentials are available)
let whatsapp = null;

function initializeWhatsApp() {
  if (whatsapp) return whatsapp; // Already initialized
  
  const username = process.env.AFRICASTALKING_USERNAME || 'sandbox';
  const apiKey = process.env.AFRICASTALKING_API_KEY || '';
  
  if (!apiKey) {
    console.warn('[WHATSAPP SERVICE] Africa\'s Talking API key not configured - WhatsApp functionality disabled');
    return null;
  }
  
  try {
    whatsapp = africastalking({
      username: username,
      apiKey: apiKey
    }).WhatsApp;
    console.log('[WHATSAPP SERVICE] Africa\'s Talking initialized successfully');
    return whatsapp;
  } catch (error) {
    console.error('[WHATSAPP SERVICE] Failed to initialize Africa\'s Talking:', error);
    return null;
  }
}

/**
 * Send WhatsApp message FROM user TO company WhatsApp number
 * @param {string} fromPhone - Sender phone number (user's phone)
 * @param {string} message - Message content
 * @returns {Promise<Object>} - API response
 */
async function sendWhatsAppMessage(fromPhone, message) {
  try {
    const whatsappService = initializeWhatsApp();
    if (!whatsappService) {
      return {
        success: false,
        error: 'WhatsApp service not configured - Africa\'s Talking API key missing'
      };
    }
    
    // Ensure sender phone number is in correct format (starts with +)
    const formattedFromPhone = fromPhone.startsWith('+') ? fromPhone : `+${fromPhone}`;
    
    console.log(`[WHATSAPP SERVICE] Sending WhatsApp FROM ${formattedFromPhone} TO ${COMPANY_WHATSAPP_NUMBER}: ${message}`);
    
    const options = {
      to: COMPANY_WHATSAPP_NUMBER, // Send TO company WhatsApp number
      message: message,
      from: formattedFromPhone // FROM user's phone
    };
    
    const response = await whatsappService.send(options);
    console.log('[WHATSAPP SERVICE] WhatsApp message sent successfully:', response);
    
    return {
      success: true,
      data: response
    };
  } catch (error) {
    console.error('[WHATSAPP SERVICE] Error sending WhatsApp message:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Send WhatsApp message to multiple recipients (admin function)
 * @param {Array<string>} phoneNumbers - Array of recipient phone numbers
 * @param {string} message - Message content
 * @returns {Promise<Object>} - API response
 */
async function sendBulkWhatsApp(phoneNumbers, message) {
  try {
    const whatsappService = initializeWhatsApp();
    if (!whatsappService) {
      return {
        success: false,
        error: 'WhatsApp service not configured - Africa\'s Talking API key missing'
      };
    }
    
    // Format all phone numbers
    const formattedPhones = phoneNumbers.map(phone => 
      phone.startsWith('+') ? phone : `+${phone}`
    );
    
    console.log(`[WHATSAPP SERVICE] Sending bulk WhatsApp to ${formattedPhones.length} recipients`);
    
    const options = {
      to: formattedPhones,
      message: message,
      from: COMPANY_WHATSAPP_NUMBER // FROM company number
    };
    
    const response = await whatsappService.send(options);
    console.log('[WHATSAPP SERVICE] Bulk WhatsApp sent successfully:', response);
    
    return {
      success: true,
      data: response
    };
  } catch (error) {
    console.error('[WHATSAPP SERVICE] Error sending bulk WhatsApp:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  sendWhatsAppMessage,
  sendBulkWhatsApp,
  COMPANY_WHATSAPP_NUMBER
};
