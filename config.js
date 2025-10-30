/**
 * Configuration file for Email Notification Static App
 *
 * This file loads configuration from environment variables set in Azure Static Web Apps.
 * Environment variables are replaced at runtime using string substitution.
 *
 * To configure in Azure Portal:
 * 1. Go to your Static Web App → Configuration → Application settings
 * 2. Add these settings:
 *    - API_ENDPOINT: https://your-api.azurewebsites.net/api/notification
 *    - API_HEALTH_ENDPOINT: https://your-api.azurewebsites.net/api/notification/health
 *    - DEBUG: false
 */

// Configuration object with environment variable substitution
// Azure Static Web Apps will replace __API_ENDPOINT__ at build/deploy time
const CONFIG = {
  // API endpoint for sending email notifications
  // This will be replaced by Azure Static Web Apps environment variable
  API_ENDPOINT: "__API_ENDPOINT__",

  // Health check endpoint for testing API connection
  // This will be replaced by Azure Static Web Apps environment variable
  API_HEALTH_ENDPOINT: "__API_HEALTH_ENDPOINT__",

  // Request timeout in milliseconds (30 seconds)
  TIMEOUT: 30000,

  // Enable debug logging
  // This will be replaced by Azure Static Web Apps environment variable
  DEBUG: "__DEBUG__" === "true",
};

// Check if environment variables were properly replaced
const isConfigured =
  CONFIG.API_ENDPOINT &&
  !CONFIG.API_ENDPOINT.includes("__") &&
  CONFIG.API_HEALTH_ENDPOINT &&
  !CONFIG.API_HEALTH_ENDPOINT.includes("__");

if (!isConfigured) {
  console.error(`
========================================
⚠️  ENVIRONMENT VARIABLES NOT SET
========================================
Configuration placeholders were not replaced!

Please set these environment variables in Azure Static Web Apps:

1. Go to Azure Portal
2. Navigate to: Static Web Apps → Configuration → Application settings
3. Add the following settings:

   Name: API_ENDPOINT
   Value: https://your-api-app.azurewebsites.net/api/notification

   Name: API_HEALTH_ENDPOINT
   Value: https://your-api-app.azurewebsites.net/api/notification/health

   Name: DEBUG
   Value: false

4. Save and wait for redeployment

Current values:
- API_ENDPOINT: ${CONFIG.API_ENDPOINT}
- API_HEALTH_ENDPOINT: ${CONFIG.API_HEALTH_ENDPOINT}
========================================
  `);
} else {
  console.log(
    "✅ Configuration loaded successfully from environment variables"
  );
}

// Log configuration in debug mode
if (CONFIG.DEBUG) {
  console.log("Email Notification App Configuration:", CONFIG);
}

// Make config available globally
window.APP_CONFIG = CONFIG;
