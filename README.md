# Email Notification Static Web App

A static web application for sending email notifications through your API service.

## Features

- ✅ **API Connection Test** - Test the connection to your API before sending notifications
- ✅ **Email Notification Form** - Simple form to send email notifications
- ✅ **Environment Variable Support** - Configure API endpoints via environment variables
- ✅ **Responsive Design** - Works on desktop and mobile devices
- ✅ **Real-time Feedback** - Loading states and detailed success/error messages

---

## Files Structure

```
email-notification-static-app/
├── index.html          # Main HTML page
├── styles.css          # Styling
├── config.js           # Configuration (API endpoints)
├── app.js              # Application logic
├── README.md           # This file
├── staticwebapp.config.json  # Azure Static Web Apps configuration
└── .env.example        # Environment variables template
```

---

## Configuration

### Option 1: Update config.js directly (for local testing)

Edit `config.js` and update the API endpoints:

```javascript
const CONFIG = {
  API_ENDPOINT: "https://your-api-app.azurewebsites.net/api/notification",
  API_HEALTH_ENDPOINT:
    "https://your-api-app.azurewebsites.net/api/notification/health",
};
```

### Option 2: Use Environment Variables (for Azure Static Web Apps)

1. Deploy to Azure Static Web Apps
2. Go to Azure Portal → Your Static Web App → Configuration
3. Add Application Settings:

| Name                  | Value                                                                    |
| --------------------- | ------------------------------------------------------------------------ |
| `API_ENDPOINT`        | `https://test-api-service-app.azurewebsites.net/api/notification`        |
| `API_HEALTH_ENDPOINT` | `https://test-api-service-app.azurewebsites.net/api/notification/health` |

These will be injected as `window.ENV` at runtime.

---

## Local Development

1. **Update configuration**:

   - Edit `config.js` with your API endpoint

2. **Serve the files**:

   ```bash
   # Using Python
   python -m http.server 8000

   # Using Node.js
   npx serve .

   # Using VS Code Live Server extension
   # Right-click index.html → Open with Live Server
   ```

3. **Open in browser**:

   - Navigate to `http://localhost:8000`

4. **Test the connection**:
   - Click "Test Connection" button to verify API is accessible

---

## Deploy to Azure Static Web Apps

### Method 1: Using Azure Portal

1. **Create Static Web App**:

   - Go to Azure Portal
   - Create a new Static Web App
   - Choose GitHub repository or upload files

2. **Configure Environment Variables**:

   - Go to Configuration → Application Settings
   - Add `API_ENDPOINT` and `API_HEALTH_ENDPOINT`

3. **Configure CORS on API App**:
   - Go to your API App Service
   - Configuration → Application Settings
   - Update `Cors__AllowedOrigins__0` with your static app URL
   - Example: `https://your-static-app.azurestaticapps.net`

### Method 2: Using Azure CLI

```bash
# Create resource group
az group create --name rg-email-notification --location eastus

# Create static web app
az staticwebapp create \
  --name email-notification-app \
  --resource-group rg-email-notification \
  --source . \
  --location eastus \
  --branch main \
  --app-location "/" \
  --output-location "/"

# Add environment variables
az staticwebapp appsettings set \
  --name email-notification-app \
  --resource-group rg-email-notification \
  --setting-names API_ENDPOINT="https://test-api-service-app.azurewebsites.net/api/notification" \
                  API_HEALTH_ENDPOINT="https://test-api-service-app.azurewebsites.net/api/notification/health"
```

---

## Using the Application

### 1. Test API Connection

Before sending notifications, test the connection:

- Click the **"Test Connection"** button
- If successful, you'll see a green success message with API details
- If it fails, check the troubleshooting tips in the error message

### 2. Send Email Notification

Fill in the form:

- **Recipient Email** (required): Email address to send notification to
- **Template ID** (optional): Template identifier for your email export app
- **Data ID** (optional): Database record ID for email export app

Click **"Send Notification"** to submit.

---

## API Integration

This app connects to your API service with these endpoints:

### Health Check Endpoint

```
GET https://your-api-app.azurewebsites.net/api/notification/health
```

Expected response:

```json
{
  "status": "Healthy",
  "service": "NotificationApi",
  "connectionType": "Direct HTTP to Email Export App",
  "timestamp": "2025-10-30T10:00:00Z"
}
```

### Notification Endpoint

```
POST https://your-api-app.azurewebsites.net/api/notification
Content-Type: application/json

{
  "recipientEmail": "user@example.com",
  "templateId": "welcome-email",
  "dataId": "order-12345"
}
```

Expected response:

```json
{
  "success": true,
  "message": "Email notification sent to email export app successfully",
  "correlationId": "guid-here",
  "receivedAt": "2025-10-30T10:00:00Z",
  "status": "Forwarded",
  "recipient": "user@example.com",
  "templateId": "welcome-email",
  "dataId": "order-12345"
}
```

---

## CORS Configuration

⚠️ **Important**: Your API app must allow requests from your static web app domain.

### Update API App CORS Settings

**In Azure Portal**:

1. Go to your API App Service
2. Configuration → Application Settings
3. Add/Update:
   ```
   Cors__AllowedOrigins__0 = https://your-static-app.azurestaticapps.net
   ```

**In appsettings.json**:

```json
{
  "Cors": {
    "AllowedOrigins": [
      "https://your-static-app.azurestaticapps.net",
      "http://localhost:8000"
    ]
  }
}
```

---

## Troubleshooting

### Connection Test Fails

**Error**: "Cannot reach API - Check if the API is running and CORS is configured"

**Solutions**:

1. Verify `API_HEALTH_ENDPOINT` in `config.js` is correct
2. Check if API app is running in Azure Portal
3. Verify CORS is configured (see CORS Configuration above)
4. Check browser console for detailed error messages

### Send Notification Fails

**Error**: "Failed to fetch"

**Solutions**:

1. Test connection first using "Test Connection" button
2. Verify `API_ENDPOINT` in `config.js` is correct
3. Check CORS configuration
4. Verify your API app has `EmailExportApp__Url` configured

---

## Environment Variables Reference

| Variable              | Description                     | Example                                                                  |
| --------------------- | ------------------------------- | ------------------------------------------------------------------------ |
| `API_ENDPOINT`        | Email notification API endpoint | `https://test-api-service-app.azurewebsites.net/api/notification`        |
| `API_HEALTH_ENDPOINT` | Health check endpoint           | `https://test-api-service-app.azurewebsites.net/api/notification/health` |
| `DEBUG`               | Enable debug logging            | `true` or `false`                                                        |

---

## Testing Checklist

- [ ] Update `config.js` with correct API endpoints
- [ ] Test locally using `http.server` or similar
- [ ] Click "Test Connection" - should show green success
- [ ] Fill form and send test notification
- [ ] Deploy to Azure Static Web Apps
- [ ] Add environment variables in Azure Portal
- [ ] Update CORS settings on API app
- [ ] Test from deployed static app
- [ ] Verify email is received (if email export app is configured)

---

## Support

For issues with:

- **This static app**: Check browser console for errors
- **API connectivity**: Use "Test Connection" button
- **Email delivery**: Check your email export app logs
- **CORS errors**: Update API app CORS configuration

---

## License

This is part of the Email Notification API Service project.
