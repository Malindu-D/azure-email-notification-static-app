# Quick Setup Guide

Follow these 4 simple steps to deploy your Email Notification Static App.

---

## Step 1: Update Configuration (Required)

Open `config.js` and replace `YOUR-API-NAME` with your actual API app name.

**Find this line:**
```javascript
API_ENDPOINT: "https://YOUR-API-NAME.azurewebsites.net/api/notification",
```

**Replace with your API name:**
```javascript
API_ENDPOINT: "https://my-notification-api.azurewebsites.net/api/notification",
```

Do the same for `API_HEALTH_ENDPOINT`.

---

## Step 2: Commit Changes

```bash
git add config.js
git commit -m "Configure API endpoints"
git push
```

---

## Step 3: Deploy to Azure

### Using Azure Portal:
1. Go to [portal.azure.com](https://portal.azure.com)
2. Create a new **Static Web App**
3. Connect to your **GitHub repository**
4. Set build config:
   - App location: `/`
   - Output location: `/`
5. Click **Create**
6. Copy your Static Web App URL

### Using Azure CLI:
```bash
az staticwebapp create \
  --name email-notification-app \
  --resource-group YOUR-RESOURCE-GROUP \
  --location eastus \
  --branch main \
  --source . \
  --app-location "/" \
  --output-location "/"
```

---

## Step 4: Configure CORS

1. Copy your Static Web App URL (from step 3)
2. Go to your **API App Service** in Azure Portal
3. Navigate to **Configuration** → **Application settings**
4. Add setting:
   - **Name**: `Cors__AllowedOrigins__0`
   - **Value**: Your Static Web App URL
5. **Save** and wait for restart

---

## Test It!

1. Open your Static Web App URL
2. Click **"Test Connection"**
   - ✅ Green = Success!
   - ❌ Red = Check CORS settings
3. Send a test notification

---

## Troubleshooting

- **"Configuration Required"**: Update `config.js` with your API name
- **CORS Error**: Add Static Web App URL to API CORS settings
- **Connection Failed**: Verify API is running and URL is correct

---

## Done! 🎉

Every time you push to GitHub, your app will automatically redeploy.

For detailed instructions, see **DEPLOYMENT-GUIDE.md**
