# Deployment Guide - Email Notification Static App

This guide shows you how to deploy this static web app to Azure Static Web Apps.

---

## Prerequisites

- ✅ Azure account
- ✅ Your API app deployed (test-api-service-app)
- ✅ Git repository (optional, for automatic deployment)

---

## Step 1: Update Configuration

### Option A: For Production (Using Environment Variables)

The app is pre-configured to use environment variables. You'll set these in Azure Portal after deployment.

### Option B: For Quick Testing (Hardcode in config.js)

Edit `config.js`:

```javascript
const CONFIG = {
  API_ENDPOINT:
    "https://test-api-service-app.azurewebsites.net/api/notification",
  API_HEALTH_ENDPOINT:
    "https://test-api-service-app.azurewebsites.net/api/notification/health",
  TIMEOUT: 30000,
  DEBUG: false,
};
```

---

## Step 2: Deploy to Azure Static Web Apps

### Method 1: Using Azure Portal (Recommended for Beginners)

1. **Go to Azure Portal**: https://portal.azure.com

2. **Create Static Web App**:

   - Click "Create a resource"
   - Search for "Static Web App"
   - Click "Create"

3. **Configure Basic Settings**:

   - **Subscription**: Choose your subscription
   - **Resource Group**: Create new or select existing (e.g., `rg-email-notification`)
   - **Name**: `email-notification-app` (or your preferred name)
   - **Plan Type**: Free (for testing) or Standard (for production)
   - **Region**: Choose closest to your users
   - **Source**: Choose deployment source

4. **Configure Deployment**:

   **Option A - GitHub Repository**:

   - **Source**: GitHub
   - **Organization**: Your GitHub username
   - **Repository**: Your repository
   - **Branch**: main
   - **Build Presets**: Custom
   - **App location**: `/`
   - **Output location**: `/`

   **Option B - Manual Upload** (if no GitHub):

   - Choose "Other" as source
   - You'll upload files manually later

5. **Review and Create**:
   - Click "Review + Create"
   - Click "Create"
   - Wait for deployment to complete

---

### Method 2: Using Azure CLI

```bash
# Login to Azure
az login

# Create resource group
az group create \
  --name rg-email-notification \
  --location eastus

# Create static web app
az staticwebapp create \
  --name email-notification-app \
  --resource-group rg-email-notification \
  --location eastus \
  --sku Free

# Get the URL
az staticwebapp show \
  --name email-notification-app \
  --resource-group rg-email-notification \
  --query "defaultHostname" -o tsv
```

---

## Step 3: Upload Files (if using manual deployment)

### Using Azure CLI

```bash
# Navigate to the app folder
cd C:\Users\malin\OneDrive\Desktop\email-notification-static-app

# Deploy to Static Web App
az staticwebapp upload \
  --name email-notification-app \
  --resource-group rg-email-notification \
  --source .
```

### Using Azure Portal

1. Go to your Static Web App
2. Click "Browse" to see current site
3. For updates, use GitHub Actions or CLI

---

## Step 4: Configure Environment Variables

1. **Go to your Static Web App in Azure Portal**

2. **Navigate to Configuration**:

   - Click "Configuration" in left menu
   - Click "Application settings"

3. **Add Settings**:

   Click "+ Add" for each setting:

   | Name                  | Value                                                                    |
   | --------------------- | ------------------------------------------------------------------------ |
   | `API_ENDPOINT`        | `https://test-api-service-app.azurewebsites.net/api/notification`        |
   | `API_HEALTH_ENDPOINT` | `https://test-api-service-app.azurewebsites.net/api/notification/health` |
   | `DEBUG`               | `false`                                                                  |

4. **Save Changes**:
   - Click "Save" at the top
   - Wait for app to restart

---

## Step 5: Configure CORS on API App

⚠️ **CRITICAL STEP**: Your API app must allow requests from your static app.

1. **Get your Static Web App URL**:

   - In Azure Portal, go to your Static Web App
   - Copy the URL (e.g., `https://your-app-name.azurestaticapps.net`)

2. **Update API App Configuration**:
   - Go to your API App Service (test-api-service-app)
   - Click "Configuration" → "Application settings"
   - Find or add: `Cors__AllowedOrigins__0`
   - Set value to your static app URL
   - Click "Save"

**Example**:

```
Name:  Cors__AllowedOrigins__0
Value: https://email-notification-app.azurestaticapps.net
```

If you have multiple allowed origins:

```
Cors__AllowedOrigins__0 = https://email-notification-app.azurestaticapps.net
Cors__AllowedOrigins__1 = http://localhost:8000
```

---

## Step 6: Test Deployment

1. **Open your Static Web App URL**:

   - In Azure Portal, click "Browse" or use the URL

2. **Test API Connection**:

   - Click "Test Connection" button
   - Should show green success message

3. **Test Notification**:
   - Fill in the form with test data
   - Click "Send Notification"
   - Should show success message

---

## Step 7: Custom Domain (Optional)

1. **In Azure Portal**:

   - Go to your Static Web App
   - Click "Custom domains"
   - Click "+ Add"
   - Follow the wizard to add your domain

2. **Update CORS**:
   - After adding custom domain
   - Update API app CORS to include custom domain

---

## Troubleshooting Deployment

### Issue: "Test Connection" shows error

**Solution**:

1. Check environment variables are set correctly in Static Web App
2. Verify API app is running
3. Check CORS configuration on API app
4. Look at browser console for detailed errors

### Issue: CORS error in browser console

**Error**: "Access to fetch at '...' has been blocked by CORS policy"

**Solution**:

1. Go to API App Service → Configuration
2. Add static app URL to `Cors__AllowedOrigins__0`
3. Save and restart API app

### Issue: Environment variables not working

**Solution**:

1. Verify variables are added in Static Web App Configuration
2. Variable names must match exactly (case-sensitive)
3. Restart Static Web App after adding variables

---

## Update Deployment

### If using GitHub:

- Just push to your repository
- GitHub Actions will auto-deploy

### If using manual upload:

```bash
az staticwebapp upload \
  --name email-notification-app \
  --resource-group rg-email-notification \
  --source .
```

---

## Configuration Summary

After deployment, you should have:

### Static Web App Configuration

```
API_ENDPOINT = https://test-api-service-app.azurewebsites.net/api/notification
API_HEALTH_ENDPOINT = https://test-api-service-app.azurewebsites.net/api/notification/health
DEBUG = false
```

### API App Configuration

```
Cors__AllowedOrigins__0 = https://your-static-app.azurestaticapps.net
EmailExportApp__Url = https://your-email-export-app.azurewebsites.net
ServiceBus__Namespace = your-namespace.servicebus.windows.net
ServiceBus__UserDataQueue = userdata-queue
```

---

## Next Steps

- ✅ Static app deployed and accessible
- ✅ Environment variables configured
- ✅ CORS configured on API app
- ✅ Connection test passes
- ✅ Can send notifications

Now you can:

1. Share the static app URL with users
2. Create your email export app
3. Test end-to-end email flow
4. Monitor in Application Insights
