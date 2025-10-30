# Local Development Setup

This guide shows you how to test the static app locally before deploying to Azure.

---

## Quick Start for Local Testing

### Step 1: Create Local Configuration

1. **Copy the example file**:

   ```bash
   cp config.local.js.example config.local.js
   ```

2. **Edit `config.local.js`** with your API endpoints:
   ```javascript
   window.ENV = {
     API_ENDPOINT:
       "https://test-api-service-app.azurewebsites.net/api/notification",
     API_HEALTH_ENDPOINT:
       "https://test-api-service-app.azurewebsites.net/api/notification/health",
     DEBUG: "true",
   };
   ```

### Step 2: Add CORS for localhost

Add `http://localhost:8000` to your API app CORS:

**Azure Portal → App Service (test-api-service-app) → Configuration**

```
Name:  Cors__AllowedOrigins__1
Value: http://localhost:8000
```

### Step 3: Start Local Server

```bash
# Navigate to the folder
cd C:\Users\malin\OneDrive\Desktop\email-notification-static-app

# Start web server
python -m http.server 8000
```

### Step 4: Test

**Option A - Use local testing file**:

- Open: `http://localhost:8000/index.local.html`
- This file includes config.local.js automatically

**Option B - Modify index.html temporarily**:
Add this line BEFORE `<script src="config.js">`:

```html
<script src="config.local.js"></script>
<script src="config.js"></script>
```

---

## How It Works

### Production (Azure Static Web Apps)

```
Azure Static Web Apps injects environment variables
    ↓
window.ENV = {
    API_ENDPOINT: "...",
    API_HEALTH_ENDPOINT: "..."
}
    ↓
config.js reads from window.ENV
    ↓
App uses the configuration
```

### Local Development

```
You create config.local.js with your values
    ↓
Load config.local.js BEFORE config.js
    ↓
config.local.js sets window.ENV
    ↓
config.js reads from window.ENV
    ↓
App uses the configuration
```

---

## Files

- `config.js` - Main config (reads from window.ENV, NO HARDCODING)
- `config.local.js.example` - Template for local config
- `config.local.js` - Your local config (Git ignored, create this)
- `index.local.html` - HTML file for local testing (includes config.local.js)
- `index.html` - Production HTML (no local config)

---

## Important Notes

✅ **config.local.js is Git ignored** - Your local settings won't be committed

✅ **index.html doesn't include config.local.js** - Production uses Azure environment variables

✅ **index.local.html is for local testing only** - Use this during development

❌ **Never commit config.local.js** - It's in .gitignore

❌ **Never hardcode in config.js** - Use environment variables only

---

## Testing Checklist

- [ ] Created `config.local.js` from example
- [ ] Updated API endpoints in `config.local.js`
- [ ] Added localhost to API CORS settings
- [ ] Started local server
- [ ] Opened `http://localhost:8000/index.local.html`
- [ ] Clicked "Test Connection" - shows green success
- [ ] Sent test notification - works correctly

---

## Troubleshooting

### Error: "API_ENDPOINT not configured"

**Solution**: You forgot to create `config.local.js`

```bash
cp config.local.js.example config.local.js
# Edit config.local.js with your values
```

### Error: "CORS policy blocked"

**Solution**: Add localhost to API CORS

```
Cors__AllowedOrigins__1 = http://localhost:8000
```

### Test Connection fails

**Solutions**:

1. Check your API endpoints in `config.local.js` are correct
2. Verify API app is running
3. Check CORS includes localhost
4. Look at browser console for errors

---

## When to Use Which File

| Scenario           | File to Open                               |
| ------------------ | ------------------------------------------ |
| Local testing      | `index.local.html`                         |
| Production (Azure) | `index.html`                               |
| Deployment         | Deploy `index.html` (not index.local.html) |

---

## Deploy to Production

When ready to deploy:

1. **DO NOT** include `config.local.js` in deployment
2. Deploy `index.html` (not index.local.html)
3. Set environment variables in Azure Portal
4. Update CORS with your static app URL

See DEPLOYMENT-GUIDE.md for complete instructions.
