/**
 * Configuration file for Email Notification Static App
 *
 * IMPORTANT: Update the API endpoints below with your actual API URL
 *
 * Replace 'YOUR-API-NAME' with your actual Azure App Service name
 * Example: If your API is at https://my-notification-api.azurewebsites.net
 * then replace both instances of 'YOUR-API-NAME' with 'my-notification-api'
 */

const CONFIG = {
  // API endpoint for sending email notifications
  // TODO: Replace YOUR-API-NAME with your actual API app name
  API_ENDPOINT: "https://YOUR-API-NAME.azurewebsites.net/api/notification",

  // Health check endpoint for testing API connection
  // TODO: Replace YOUR-API-NAME with your actual API app name
  API_HEALTH_ENDPOINT:
    "https://YOUR-API-NAME.azurewebsites.net/api/notification/health",

  // Request timeout in milliseconds (30 seconds)
  TIMEOUT: 30000,

  // Enable debug logging (set to false in production)
  DEBUG: false,
};

// Validate configuration
if (CONFIG.API_ENDPOINT.includes("YOUR-API-NAME")) {
  console.error(`
========================================
⚠️  CONFIGURATION REQUIRED
========================================
Please update config.js with your API endpoint!

1. Open: config.js
2. Replace 'YOUR-API-NAME' with your actual Azure App Service name
3. Save and redeploy

Example: https://my-notification-api.azurewebsites.net
========================================
  `);
}

// Log configuration in debug mode
if (CONFIG.DEBUG) {
  console.log("Email Notification App Configuration:", CONFIG);
}

// Make config available globally
window.APP_CONFIG = CONFIG;
