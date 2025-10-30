# Quick Configuration Reference

This document shows exactly what settings you need based on your deployed API app.

---

## Your API App Details

Based on your application:

- **API App Name**: `test-api-service-app`
- **API App URL**: `https://test-api-service-app.azurewebsites.net`

⚠️ **IMPORTANT**: API endpoints are NOT hardcoded. You MUST set them as environment variables in Azure Static Web Apps.

---

## Static Web App Configuration

### Environment Variables to Set in Azure Portal

After deploying your static web app, add these in:
**Azure Portal → Static Web Apps → Configuration → Application settings**

```
Name:  API_ENDPOINT
Value: https://test-api-service-app.azurewebsites.net/api/notification

Name:  API_HEALTH_ENDPOINT
Value: https://test-api-service-app.azurewebsites.net/api/notification/health

Name:  DEBUG
Value: false
```

---

## API App CORS Configuration

### What You Need to Update

After you deploy the static web app, you'll get a URL like:
`https://email-notification-app.azurestaticapps.net`

Then update your API app:

**Azure Portal → App Service (test-api-service-app) → Configuration → Application settings**

Add or update:

```
Name:  Cors__AllowedOrigins__0
Value: https://email-notification-app.azurestaticapps.net
```

If testing locally, you can add:

```
Name:  Cors__AllowedOrigins__1
Value: http://localhost:8000
```

---

## Testing Endpoints

### Health Check

```
GET https://test-api-service-app.azurewebsites.net/api/notification/health
```

Should return:

```json
{
  "status": "Healthy",
  "timestamp": "2025-10-30T...",
  "service": "NotificationApi",
  "connectionType": "Direct HTTP to Email Export App"
}
```

### Send Notification

```
POST https://test-api-service-app.azurewebsites.net/api/notification
Content-Type: application/json

{
  "recipientEmail": "test@example.com",
  "templateId": "welcome",
  "dataId": "123"
}
```

---

## Complete Checklist

- [ ] Deploy static web app to Azure
- [ ] Note the static app URL (e.g., `https://xxx.azurestaticapps.net`)
- [ ] Add environment variables to static app (API_ENDPOINT, API_HEALTH_ENDPOINT)
- [ ] Update CORS on API app with static app URL
- [ ] Test locally first (use `python -m http.server 8000`)
- [ ] Open static app and click "Test Connection"
- [ ] If green success, try sending a test notification
- [ ] Check API app logs if issues occur

---

## Local Testing (Before Deployment)

1. **Update config.js** (already done):

   ```javascript
   API_ENDPOINT: "https://test-api-service-app.azurewebsites.net/api/notification";
   API_HEALTH_ENDPOINT: "https://test-api-service-app.azurewebsites.net/api/notification/health";
   ```

2. **Add localhost to API CORS**:

   ```
   Cors__AllowedOrigins__1 = http://localhost:8000
   ```

3. **Start local server**:

   ```bash
   cd C:\Users\malin\OneDrive\Desktop\email-notification-static-app
   python -m http.server 8000
   ```

4. **Open browser**: `http://localhost:8000`

5. **Test connection** using the button

---

## File Structure Reference

Your new static app folder contains:

```
email-notification-static-app/
├── index.html              ← Main page
├── styles.css              ← Styling
├── config.js               ← API endpoints (already configured)
├── app.js                  ← Application logic
├── README.md               ← Full documentation
├── DEPLOYMENT-GUIDE.md     ← Step-by-step deployment
├── QUICK-CONFIG.md         ← This file
├── staticwebapp.config.json ← Azure Static Web Apps config
├── .env.example            ← Environment variables template
└── .gitignore              ← Git ignore file
```

---

## What the Test Connection Button Does

When you click "Test Connection", it:

1. Calls: `GET https://test-api-service-app.azurewebsites.net/api/notification/health`
2. Shows green success if API responds with 200 OK
3. Shows red error if:
   - API is down
   - CORS is not configured
   - Network issue
4. Displays API status, service name, and timestamp

This verifies the connection BEFORE you try to send notifications.

---

## Support

- **Can't connect?** → Check CORS settings on API app
- **Test passes but send fails?** → Check API app has `EmailExportApp__Url` configured
- **Need to debug?** → Set `DEBUG = true` in environment variables, check browser console

---

## Ready to Deploy?

Follow **DEPLOYMENT-GUIDE.md** for complete step-by-step instructions!
