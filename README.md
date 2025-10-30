# Email Notification Static Web App

A static web application for sending email notifications through your API service.

## 🚀 Quick Start

### 1. Configure API Endpoints

Open `config.js` and replace `YOUR-API-NAME` with your actual Azure App Service name:

```javascript
API_ENDPOINT: "https://YOUR-API-NAME.azurewebsites.net/api/notification",
API_HEALTH_ENDPOINT: "https://YOUR-API-NAME.azurewebsites.net/api/notification/health",
```

**Example:** If your API is at `https://my-notification-api.azurewebsites.net`, replace `YOUR-API-NAME` with `my-notification-api`.

### 2. Deploy to Azure Static Web Apps

This app is configured for automatic deployment via GitHub Actions.

**Option A: Using Azure Portal**

1. Go to [Azure Portal](https://portal.azure.com)
2. Create a new "Static Web App"
3. Connect to your GitHub repository
4. Set build configuration:
   - **App location**: `/`
   - **Output location**: `/`
5. Azure will automatically set up GitHub Actions

**Option B: Using Azure CLI**

```bash
az staticwebapp create \
  --name email-notification-app \
  --resource-group YOUR-RESOURCE-GROUP \
  --source . \
  --location eastus \
  --branch main \
  --app-location "/" \
  --output-location "/"
```

### 3. Configure CORS on API App

⚠️ **CRITICAL**: Your API must allow requests from your static app URL.

1. Get your Static Web App URL (e.g., `https://nice-sky-123.azurestaticapps.net`)
2. Go to your API App Service in Azure Portal
3. Navigate to **Configuration → Application Settings**
4. Add or update:
   ```
   Name:  Cors__AllowedOrigins__0
   Value: https://your-static-app-url.azurestaticapps.net
   ```
5. Save and restart the API app

### 4. Test Your Deployment

1. Open your Static Web App URL
2. Click **"Test Connection"** button
3. If successful (green message), try sending a test notification
4. Fill in the form and click **"Send Notification"**

---

## ✨ Features

- ✅ Test API connection before sending notifications
- ✅ Simple email notification form
- ✅ Real-time feedback with loading states
- ✅ Detailed success/error messages
- ✅ Responsive design for desktop and mobile

---

## 📋 API Requirements

Your API must provide these endpoints:

### Health Check

```
GET /api/notification/health

Response:
{
  "status": "Healthy",
  "service": "NotificationApi",
  "timestamp": "2025-10-30T10:00:00Z"
}
```

### Send Notification

```
POST /api/notification
Content-Type: application/json

{
  "recipientEmail": "user@example.com",
  "templateId": "welcome-email",
  "dataId": "order-12345"
}

Response:
{
  "success": true,
  "message": "Email notification sent successfully",
  "recipient": "user@example.com",
  "status": "Forwarded"
}
```

---

## 🔧 Troubleshooting

### "Configuration Required" Error

- **Cause**: `YOUR-API-NAME` not replaced in `config.js`
- **Solution**: Edit `config.js` with your actual API name

### "Connection Failed" Error

- **Cause**: Cannot reach API or CORS not configured
- **Solutions**:
  1. Verify API is running in Azure Portal
  2. Check CORS settings (see step 3 above)
  3. Verify API endpoints in `config.js` are correct

### CORS Error in Browser Console

- **Error**: "Access to fetch... has been blocked by CORS policy"
- **Solution**: Add your Static Web App URL to API CORS settings

### 404 Not Found

- **Cause**: API endpoints incorrect
- **Solution**: Verify your API URL and endpoint paths

---

## 📁 Files Structure

```
email-notification-static-app/
├── index.html                  # Main HTML page
├── styles.css                  # Styling
├── config.js                   # API configuration (UPDATE THIS!)
├── app.js                      # Application logic
├── staticwebapp.config.json    # Azure Static Web Apps config
├── DEPLOYMENT-GUIDE.md         # Detailed deployment guide
└── README.md                   # This file
```

---

## 🔄 Updating the App

After making changes:

1. Commit and push to GitHub:

   ```bash
   git add .
   git commit -m "Update configuration"
   git push
   ```

2. GitHub Actions will automatically redeploy
3. Check the "Actions" tab in GitHub to monitor deployment

---

## 📚 Additional Documentation

- **DEPLOYMENT-GUIDE.md** - Detailed step-by-step deployment instructions
- See inline comments in `config.js` for configuration options

---

## ✅ Pre-Deployment Checklist

- [ ] Updated `config.js` with actual API name
- [ ] Committed changes to GitHub
- [ ] Created Azure Static Web App
- [ ] GitHub Actions workflow is running
- [ ] Noted the Static Web App URL
- [ ] Updated CORS on API app with Static Web App URL
- [ ] Tested connection using "Test Connection" button
- [ ] Successfully sent a test notification

---

## 🆘 Support

**Configuration Issues**: Check browser console (F12) for detailed error messages

**API Issues**: Verify your API app is running and accessible at the configured URL

**CORS Issues**: Ensure Static Web App URL is added to API CORS settings

**Deployment Issues**: Check GitHub Actions logs for build/deployment errors

---

## 📄 License

Part of the Email Notification API Service project.
