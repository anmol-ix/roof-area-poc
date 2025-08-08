# RoofScope Deployment Guide for Render.com

## Prerequisites

1. **Mapbox Account**: Get your API tokens from [Mapbox](https://account.mapbox.com/access-tokens/)
   - You need both a **Secret Token** (starts with `sk.`) and **Public Token** (starts with `pk.`)
2. **Render.com Account**: Sign up at [render.com](https://render.com)
3. **GitHub Repository**: Your code should be in a GitHub repository

## Step-by-Step Deployment

### 1. Prepare Your Repository

Ensure these files are in your repository root:
- ✅ `render.yaml` (deployment configuration)
- ✅ `package.json` (root package.json for build process)
- ✅ `.env.example` (environment variable template)

### 2. Deploy to Render

1. **Connect GitHub**: 
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository

2. **Configure Environment Variables**:
   Render will automatically detect the `render.yaml` file. Set these environment variables:
   
   ```
   MAPBOX_SECRET_TOKEN=sk.your_actual_secret_token
   MAPBOX_PUBLIC_TOKEN=pk.your_actual_public_token
   ```

3. **Deploy**:
   - Click "Apply" to start deployment
   - Render will automatically run the build process
   - Initial deployment takes 5-10 minutes

### 3. Build Process

Render will automatically run:
```bash
npm run build  # Installs dependencies and builds React app
npm start      # Starts the Express server
```

The build process:
1. Installs server dependencies (`cd server && npm install`)
2. Installs client dependencies (`cd client && npm install`) 
3. Builds React app (`cd client && npm run build`)
4. Copies built files to `server/public/`
5. Starts Express server serving both API and React app

### 4. Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NODE_ENV` | ✅ | Runtime environment | `production` |
| `PORT` | ✅ | Server port (auto-set by Render) | `10000` |
| `MAPBOX_SECRET_TOKEN` | ✅ | Mapbox secret API key | `sk.xyz123...` |
| `MAPBOX_PUBLIC_TOKEN` | ✅ | Mapbox public API key | `pk.abc456...` |
| `OVERPASS_API_URL` | ❌ | OpenStreetMap API endpoint | `https://overpass-api.de/api/interpreter` |

### 5. Verification

After deployment:
1. **Health Check**: Visit `https://your-app.onrender.com/health`
2. **App**: Visit `https://your-app.onrender.com`
3. **Test Features**:
   - Enter a U.S. address
   - Click on a building
   - Verify roof area calculation

### 6. Troubleshooting

**Build Failures**:
- Check Render build logs for specific errors
- Verify all dependencies are in `package.json` files
- Ensure Node.js version compatibility (18.x)

**Runtime Errors**:
- Check environment variables are set correctly
- Verify Mapbox tokens have correct permissions
- Check Render service logs

**Map Not Loading**:
- Verify `MAPBOX_PUBLIC_TOKEN` is set
- Check browser console for errors
- Ensure token has required scopes

## Cost Information

- **Free Tier**: Render provides 750 hours/month free
- **Sleep Mode**: Free services sleep after 15 minutes of inactivity
- **Upgrade**: Consider paid plan ($7/month) for production use

## Production Optimizations

1. **Custom Domain**: Add your domain in Render dashboard
2. **SSL**: Automatically provided by Render
3. **Environment**: Consider upgrading to paid plan to avoid sleep mode
4. **Monitoring**: Set up logging and monitoring for production use

## Support

- [Render Documentation](https://render.com/docs)
- [Mapbox Documentation](https://docs.mapbox.com)
- Check GitHub repository issues for common problems
