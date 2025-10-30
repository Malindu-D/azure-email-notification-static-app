/**
 * Configuration file for Email Notification Static App
 *
 * ⚠️ DO NOT HARDCODE API ENDPOINTS HERE!
 *
 * Set these values in Azure Static Web Apps:
 * 1. Go to Azure Portal → Your Static Web App → Configuration
 * 2. Add Application Settings:
 *    - API_ENDPOINT: https://your-api-app.azurewebsites.net/api/notification
 *    - API_HEALTH_ENDPOINT: https://your-api-app.azurewebsites.net/api/notification/health
 *    - DEBUG: false (optional)
 *
 * For local testing, create config.local.js from config.local.js.example
 */

const CONFIG = {
  // API endpoint for sending email notifications
  // Set this in Azure Portal as environment variable
  API_ENDPOINT:
    window.ENV?.API_ENDPOINT ||
    (() => {
      console.error(
        "❌ API_ENDPOINT not configured! Set it in Azure Static Web Apps → Configuration"
      );
      return null;
    })(),

  // Health check endpoint for testing API connection
  // Set this in Azure Portal as environment variable
  API_HEALTH_ENDPOINT:
    window.ENV?.API_HEALTH_ENDPOINT ||
    (() => {
      console.error(
        "❌ API_HEALTH_ENDPOINT not configured! Set it in Azure Static Web Apps → Configuration"
      );
      return null;
    })(),

  // Request timeout in milliseconds (30 seconds)
  TIMEOUT: window.ENV?.TIMEOUT ? parseInt(window.ENV.TIMEOUT) : 30000,

  // Enable debug logging
  DEBUG: window.ENV?.DEBUG === "true" || false,
};

// Validate configuration
if (!CONFIG.API_ENDPOINT || !CONFIG.API_HEALTH_ENDPOINT) {
  console.error(`
========================================
⚠️  CONFIGURATION ERROR
========================================
API endpoints are not configured!

Please set these environment variables:

FOR AZURE STATIC WEB APPS (Production):
1. Go to Azure Portal
2. Navigate to your Static Web App
3. Go to Configuration → Application settings
4. Add the following settings:

   Name: API_ENDPOINT
   Value: https://your-api-app.azurewebsites.net/api/notification

   Name: API_HEALTH_ENDPOINT
   Value: https://your-api-app.azurewebsites.net/api/notification/health

FOR LOCAL TESTING:
1. Copy config.local.js.example to config.local.js
2. Update the values in config.local.js
3. Open index.local.html instead of index.html

See LOCAL-TESTING.md for more details.
========================================
  `);
}

// Log configuration in debug mode
if (CONFIG.DEBUG) {
  console.log("Email Notification App Configuration:", {
    ...CONFIG,
    isConfigured: !!(CONFIG.API_ENDPOINT && CONFIG.API_HEALTH_ENDPOINT),
  });
}

// Make config available globally
window.APP_CONFIG = CONFIG;
