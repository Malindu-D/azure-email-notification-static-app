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
  API_ENDPOINT:
    "https://test-api-service-app-bhfwatgyakeghtdr.southeastasia-01.azurewebsites.net/api/notification",

  // Health check endpoint for testing API connection
  API_HEALTH_ENDPOINT:
    "https://test-api-service-app-bhfwatgyakeghtdr.southeastasia-01.azurewebsites.net/api/notification/health",

  // Request timeout in milliseconds (30 seconds)
  TIMEOUT: 30000,

  // Enable debug logging
  DEBUG: true,
};

// Log configuration
console.log("✅ Configuration loaded successfully");
console.log("API Endpoint:", CONFIG.API_ENDPOINT);

// Make config available globally
window.APP_CONFIG = CONFIG;
