# Deployment Guide - Email Notification Static App

Complete guide to deploy this static web app to Azure Static Web Apps.

---

## Prerequisites

- ✅ Azure account with active subscription
- ✅ Your API app deployed and running
- ✅ GitHub account (for automatic deployment)
- ✅ This repository pushed to GitHub

---

## Step 1: Configure API Endpoints

Before deploying, update `config.js` with your actual API URL:

1. Open `config.js`
2. Replace `YOUR-API-NAME` with your actual Azure App Service name

**Example:**

```javascript
// If your API is at: https://my-notification-api.azurewebsites.net
API_ENDPOINT: "https://my-notification-api.azurewebsites.net/api/notification",
API_HEALTH_ENDPOINT: "https://my-notification-api.azurewebsites.net/api/notification/health",
```

3. Commit and push changes:

```bash
git add config.js
git commit -m "Configure API endpoints"
git push
```

---

## Step 2: Deploy to Azure Static Web Apps

### Method 1: Azure Portal (Recommended)

1. **Go to Azure Portal**: https://portal.azure.com

2. **Create Static Web App**:

   - Click **"Create a resource"**
   - Search for **"Static Web App"**
   - Click **"Create"**

3. **Configure Basic Settings**:

   - **Subscription**: Choose your subscription
   - **Resource Group**: Create new or use existing (e.g., `rg-email-notification`)
   - **Name**: `email-notification-app` (or your preferred name)
   - **Plan Type**: **Free** (for testing) or **Standard** (for production)
   - **Region**: Choose region closest to your users
   - **Deployment source**: **GitHub**

4. **Configure GitHub**:

   - **Organization**: Your GitHub username
   - **Repository**: Select your repository
   - **Branch**: `main` (or your default branch)

5. **Build Configuration**:

   - **Build Presets**: `Custom`
   - **App location**: `/`
   - **Api location**: (leave empty)
   - **Output location**: `/`

6. **Review and Create**:

   - Click **"Review + Create"**
   - Click **"Create"**
   - Wait 2-3 minutes for deployment

7. **Get Your Static Web App URL**:
   - After deployment completes, click **"Go to resource"**
   - Copy the URL (e.g., `https://nice-sky-abc123.azurestaticapps.net`)

---

### Method 2: Azure CLI

```bash
# Login to Azure
az login

# Create resource group (if needed)
az group create --name rg-email-notification --location eastus

# Create static web app
az staticwebapp create \
  --name email-notification-app \
  --resource-group rg-email-notification \
  --location eastus \
  --branch main \
  --source . \
  --app-location "/" \
  --output-location "/" \
  --sku Free

# Get the URL
az staticwebapp show \
  --name email-notification-app \
  --resource-group rg-email-notification \
  --query "defaultHostname" -o tsv
```

---

## Step 3: Configure CORS on API App

⚠️ **CRITICAL STEP**: Your API app must allow requests from your static app.

1. **Copy your Static Web App URL** from Step 2

   - Example: `https://nice-sky-abc123.azurestaticapps.net`

2. **Go to your API App Service** in Azure Portal

3. **Navigate to Configuration**:

   - Click **"Configuration"** in the left menu
   - Click **"Application settings"** tab

4. **Add/Update CORS Setting**:

   - Click **"+ New application setting"** (or edit existing)
   - **Name**: `Cors__AllowedOrigins__0`
   - **Value**: Your Static Web App URL (paste from step 1)
   - Example: `https://nice-sky-abc123.azurestaticapps.net`

5. **Save and Restart**:
   - Click **"Save"** at the top
   - Click **"Continue"** when prompted
   - The API app will restart automatically

**Multiple Origins (Optional)**:
If you need to allow multiple origins:

```
Cors__AllowedOrigins__0 = https://nice-sky-abc123.azurestaticapps.net
Cors__AllowedOrigins__1 = https://your-custom-domain.com
```

---

## Step 4: Test Your Deployment

1. **Open Your Static Web App**:

   - Navigate to your Static Web App URL
   - You should see the Email Notification Service page

2. **Test API Connection**:

   - Click the **"Test Connection"** button
   - ✅ **Success**: Green message with API status
   - ❌ **Failure**: See Troubleshooting section below

3. **Send Test Notification**:
   - Fill in the form:
     - **Recipient Email**: Your email address
     - **Template ID**: `test` (optional)
     - **Data ID**: `123` (optional)
   - Click **"Send Notification"**
   - ✅ **Success**: Green message with confirmation
   - ❌ **Failure**: Check error message and troubleshoot

---

## Step 5: Monitor GitHub Actions

Every time you push code to GitHub, it automatically redeploys:

1. **View Workflow**:

   - Go to your GitHub repository
   - Click **"Actions"** tab
   - See the latest workflow run

2. **Check Deployment Status**:

   - ✅ Green checkmark = Successful deployment
   - ❌ Red X = Failed deployment (click for details)

3. **Workflow File Location**:
   - `.github/workflows/azure-static-web-apps-*.yml`
   - Automatically created by Azure

---

## Troubleshooting

### Issue 1: "Configuration Required" Error

**Symptom**: Error message about `YOUR-API-NAME` in browser console

**Solution**:

1. Edit `config.js` with your actual API name
2. Commit and push changes
3. Wait for GitHub Actions to redeploy

### Issue 2: "Connection Failed" or CORS Error

**Symptom**: Test Connection button shows error or browser console shows CORS error

**Solutions**:

1. ✅ Verify API app is running (Azure Portal → App Service → Overview)
2. ✅ Check CORS setting in API app includes your Static Web App URL
3. ✅ Ensure no typos in the Static Web App URL in CORS settings
4. ✅ API app was restarted after updating CORS
5. ✅ Try accessing health endpoint directly: `https://your-api.azurewebsites.net/api/notification/health`

### Issue 3: GitHub Actions Deployment Fails

**Symptom**: Red X in GitHub Actions

**Solutions**:

1. Check the workflow logs for error details
2. Ensure `staticwebapp.config.json` is valid JSON
3. Verify build settings (app location: `/`, output location: `/`)

### Issue 4: App Works But Notifications Fail

**Symptom**: Test Connection succeeds, but Send Notification fails

**Solutions**:

1. Check your API app logs in Azure Portal
2. Verify API has proper configuration for downstream services
3. Ensure notification endpoint returns expected response format

---

## Updating Your App

### Make Changes

```bash
# Edit files
code config.js

# Commit changes
git add .
git commit -m "Update configuration"

# Push to trigger automatic deployment
git push
```

### Monitor Deployment

1. Go to GitHub → Actions tab
2. Watch the deployment workflow
3. Wait for green checkmark (usually 1-2 minutes)
4. Refresh your Static Web App URL

---

## Configuration Checklist

After deployment, verify:

### ✅ Static Web App

- [ ] Deployed to Azure Static Web Apps
- [ ] GitHub Actions workflow is set up
- [ ] Can access the Static Web App URL
- [ ] `config.js` has correct API endpoints (not `YOUR-API-NAME`)

### ✅ API App

- [ ] API app is running
- [ ] CORS includes Static Web App URL
- [ ] Can access health endpoint in browser
- [ ] API has required downstream configuration

### ✅ Testing

- [ ] "Test Connection" shows green success
- [ ] Can send test notifications
- [ ] No errors in browser console (F12)

---

## Custom Domain (Optional)

1. **In Azure Portal**:

   - Go to your Static Web App
   - Click **"Custom domains"**
   - Click **"+ Add"**
   - Follow wizard to configure DNS

2. **Update CORS**:
   - Add custom domain to API CORS settings
   - Example: `Cors__AllowedOrigins__1 = https://notifications.yourdomain.com`

---

## Production Recommendations

### Security

- [ ] Use HTTPS only (automatic with Azure Static Web Apps)
- [ ] Restrict CORS to specific domains (no wildcards)
- [ ] Set `DEBUG: false` in `config.js`

### Monitoring

- [ ] Enable Application Insights on API app
- [ ] Monitor GitHub Actions for deployment failures
- [ ] Set up Azure Monitor alerts for API app

### Performance

- [ ] Use Standard tier for production workloads
- [ ] Configure custom domain for branding
- [ ] Enable CDN for global users (built-in with Static Web Apps)

---

## Next Steps

1. ✅ **Test thoroughly** with real notification scenarios
2. ✅ **Monitor logs** in both Static Web App and API app
3. ✅ **Document** your specific API configuration
4. ✅ **Set up monitoring** and alerts
5. ✅ **Share** the Static Web App URL with your team

---

## Need Help?

**Static Web App Issues**: Check Azure Portal → Static Web App → Logs

**API Issues**: Check Azure Portal → App Service → Log stream

**CORS Issues**: Verify CORS settings match exactly (case-sensitive)

**Deployment Issues**: Check GitHub Actions logs for details

---

## Summary

Your complete setup should look like this:

```
GitHub Repository
    ↓ (automatic deployment via GitHub Actions)
Azure Static Web Apps (https://nice-sky-abc123.azurestaticapps.net)
    ↓ (HTTP requests with CORS)
API App Service (https://your-api.azurewebsites.net)
    ↓ (forwards to)
Email Export App
    ↓ (sends)
Email to Recipient
```

**Congratulations! Your email notification app is deployed! 🎉**

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
