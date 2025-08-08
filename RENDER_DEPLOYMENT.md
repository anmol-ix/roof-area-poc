# 🚀 Deploy RoofScope to Render.com

## ✅ What I've Set Up For You

Your project is now **100% ready** for Render.com deployment! Here's what I've configured:

### 📁 New Files Created:
- ✅ `render.yaml` - Render deployment configuration
- ✅ `package.json` - Root build script for deployment  
- ✅ `DEPLOYMENT.md` - Detailed deployment guide
- ✅ `.gitignore` - Proper ignore rules

### 🔧 Modified Files:
- ✅ `server/index.js` - Added production static file serving
- ✅ `client/package.json` - Removed proxy, added homepage config

## 🎯 Quick Deploy (5 Minutes)

### Step 1: Get Mapbox Tokens
1. Go to [Mapbox Account](https://account.mapbox.com/access-tokens/)
2. Copy your **Public Token** (starts with `pk.`)
3. Copy your **Secret Token** (starts with `sk.`)

### Step 2: Push to GitHub
```bash
cd /Users/anmol/Documents/Mapbox/roof-area-poc
git add .
git commit -m "Add Render.com deployment configuration"
git push origin main
```

### Step 3: Deploy on Render
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repo
4. Render auto-detects `render.yaml`
5. Set environment variables:
   ```
   MAPBOX_SECRET_TOKEN=sk.your_secret_token_here
   MAPBOX_PUBLIC_TOKEN=pk.your_public_token_here
   ```
6. Click **"Apply"**

### Step 4: Wait & Test
- Build takes ~5-10 minutes
- Your app will be live at: `https://roofscope-XXXX.onrender.com`
- Test the health endpoint: `/health`

## 🏗️ How the Build Works

```bash
# Render automatically runs:
npm run build    # → Installs deps & builds React
npm start        # → Starts Express server

# Build process:
1. Install server dependencies
2. Install client dependencies  
3. Build React app to client/build/
4. Copy build files to server/public/
5. Start Express server (serves API + React app)
```

## 🌐 Production Architecture

```
Your Domain
     ↓
[Render.com Load Balancer]
     ↓
[Express Server on Port 10000]
     ├── /api/* → API Routes
     └── /* → React App (from /public)
```

## 🔍 Environment Variables

| Variable | Value | Where to Get |
|----------|--------|--------------|
| `MAPBOX_SECRET_TOKEN` | `sk.xyz...` | [Mapbox Account](https://account.mapbox.com/access-tokens/) |
| `MAPBOX_PUBLIC_TOKEN` | `pk.abc...` | [Mapbox Account](https://account.mapbox.com/access-tokens/) |

> **Note**: `NODE_ENV`, `PORT`, and `OVERPASS_API_URL` are auto-configured!

## 📱 Features After Deployment

✅ **Full-stack app** on single Render service  
✅ **Auto HTTPS** with SSL certificate  
✅ **Global CDN** for fast loading  
✅ **Auto-scaling** based on traffic  
✅ **Health monitoring** via `/health` endpoint  
✅ **Mobile responsive** design  

## 💰 Cost

- **Free Tier**: 750 hours/month (perfect for testing)
- **Paid Plan**: $7/month (no sleep, better performance)
- **Sleep Mode**: Free services sleep after 15min inactivity

## 🐛 Troubleshooting

**Build Failed?**
- Check Render build logs
- Verify Node.js version (18.x)
- Ensure GitHub repo is public

**Map Not Loading?**
- Verify Mapbox tokens in environment variables
- Check browser console for errors
- Test `/health` endpoint first

**API Errors?**
- Check Render service logs
- Verify environment variables are set
- Test individual API endpoints: `/api/geocode?address=test`

## 🎉 You're Ready!

Your RoofScope app is now deployment-ready! Just push to GitHub and deploy via Render's Blueprint feature.

**Next Steps:**
1. Test locally: `npm run build && npm start`
2. Push to GitHub
3. Deploy on Render
4. Share your app with the world! 🌍

---

Need help? Check the detailed `DEPLOYMENT.md` file or Render's documentation.
