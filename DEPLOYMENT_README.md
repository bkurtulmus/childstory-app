# ChildStory - Deployment Files

This directory contains configuration files for deploying ChildStory to production.

## 📁 Deployment Files

### Backend (Render)
- `ChildStoryApp/ChildStoryApp/render.yaml` - Render service configuration
- `ChildStoryApp/ChildStoryApp/src/main/resources/application-prod.properties` - Production settings

### Frontend (Netlify)
- `child_story_mobile/netlify.toml` - Netlify build configuration
- `child_story_mobile/.env.production` - Production environment variables

### Build Scripts
- `build-for-production.bat` - Windows script to build Flutter web for production

## 🚀 Quick Start

1. **Push to GitHub** (see DEPLOYMENT_GUIDE.md)
2. **Deploy Backend to Render** (see DEPLOYMENT_GUIDE.md Step 2)
3. **Update API URL** in `build-for-production.bat` with your Render URL
4. **Run** `build-for-production.bat`
5. **Deploy to Netlify** by dragging `child_story_mobile/build/web` to netlify.com/drop

## 📖 Full Guide

See `DEPLOYMENT_GUIDE.md` for complete step-by-step instructions.

## 🔗 Important URLs

After deployment, you'll have:
- **Backend**: `https://childstory-backend.onrender.com` (or your custom name)
- **Frontend**: `https://your-site.netlify.app`

## ⚙️ Configuration

### Update Backend URL
Edit `build-for-production.bat` line 5:
```batch
set API_URL=https://your-actual-backend.onrender.com
```

### CORS Configuration
The backend is configured to allow requests from:
- `https://*.netlify.app` (all Netlify subdomains)
- Your custom domain (add to `application-prod.properties`)

## 🆘 Need Help?

Check `DEPLOYMENT_GUIDE.md` for troubleshooting tips!
