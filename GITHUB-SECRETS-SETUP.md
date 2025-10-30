# GitHub Secrets Configuration Guide

This app uses GitHub Secrets to inject environment variables during deployment. Follow these steps to configure:

---

## Step 1: Add GitHub Secrets

1. **Go to your GitHub repository**
2. Click on **"Settings"** tab
3. In the left sidebar, click **"Secrets and variables"** → **"Actions"**
4. Click **"New repository secret"** for each of the following:

### Required Secrets:

#### 1. API_ENDPOINT

- **Name**: `API_ENDPOINT`
- **Value**: `https://YOUR-API-NAME.azurewebsites.net/api/notification`
- Replace `YOUR-API-NAME` with your actual Azure App Service name
- Example: `https://my-notification-api.azurewebsites.net/api/notification`

#### 2. API_HEALTH_ENDPOINT

- **Name**: `API_HEALTH_ENDPOINT`
- **Value**: `https://YOUR-API-NAME.azurewebsites.net/api/notification/health`
- Replace `YOUR-API-NAME` with your actual Azure App Service name
- Example: `https://my-notification-api.azurewebsites.net/api/notification/health`

#### 3. DEBUG (Optional)

- **Name**: `DEBUG`
- **Value**: `false` (or `true` for debugging)

---

## Step 2: Verify Secrets Are Added

After adding all secrets, you should see:

- ✅ API_ENDPOINT
- ✅ API_HEALTH_ENDPOINT
- ✅ DEBUG
- ✅ AZURE_STATIC_WEB_APPS_API_TOKEN_GENTLE_SKY_054246600 (already exists)

---

## Step 3: Trigger Deployment

After adding secrets, push any change to trigger redeployment:

```bash
git add .
git commit -m "Configure environment variables"
git push
```

Or manually trigger the workflow:

1. Go to **Actions** tab
2. Select **"Azure Static Web Apps CI/CD"**
3. Click **"Run workflow"** → **"Run workflow"**

---

## Step 4: Verify Deployment

1. Go to **Actions** tab in GitHub
2. Wait for the workflow to complete (green checkmark)
3. Open your Static Web App URL
4. Open browser console (F12)
5. Look for: `✅ Configuration loaded successfully from environment variables`
6. Test connection should now work!

---

## How It Works

1. GitHub Actions reads secrets during build
2. Replaces placeholders in `config.js`:
   - `__API_ENDPOINT__` → Your actual API endpoint
   - `__API_HEALTH_ENDPOINT__` → Your actual health endpoint
   - `__DEBUG__` → `true` or `false`
3. Deploys the updated files to Azure Static Web Apps
4. Your app loads with the correct configuration

---

## Troubleshooting

### Secrets Not Working?

**Check:**

1. Secret names are EXACTLY: `API_ENDPOINT`, `API_HEALTH_ENDPOINT`, `DEBUG`
2. Secret values don't have extra spaces or quotes
3. GitHub Actions workflow completed successfully
4. Check the workflow logs for the "Replace environment variables" step

### Still Seeing Placeholders?

**In browser console, if you see:**

```
API_ENDPOINT: __API_ENDPOINT__
```

**Then:**

1. Verify secrets are added correctly in GitHub
2. Re-run the GitHub Actions workflow
3. Check workflow logs for errors

### CORS Errors After Configuration?

**After fixing the configuration, don't forget to:**

1. Get your Static Web App URL
2. Add it to API App CORS settings:
   - Go to: API App Service → Configuration → Application settings
   - Add: `Cors__AllowedOrigins__0 = https://your-static-app-url.azurestaticapps.net`
   - Save and restart

---

## Quick Checklist

- [ ] Added `API_ENDPOINT` to GitHub Secrets
- [ ] Added `API_HEALTH_ENDPOINT` to GitHub Secrets
- [ ] Added `DEBUG` to GitHub Secrets (optional)
- [ ] Pushed changes or re-run workflow
- [ ] GitHub Actions completed successfully
- [ ] Browser console shows: "Configuration loaded successfully"
- [ ] Test Connection works
- [ ] Added Static Web App URL to API CORS settings

---

## Example Configuration

If your API is at: `https://notification-api-prod.azurewebsites.net`

Then your GitHub Secrets should be:

```
API_ENDPOINT = https://notification-api-prod.azurewebsites.net/api/notification
API_HEALTH_ENDPOINT = https://notification-api-prod.azurewebsites.net/api/notification/health
DEBUG = false
```

**That's it! Your app will now use environment variables properly!** 🎉
