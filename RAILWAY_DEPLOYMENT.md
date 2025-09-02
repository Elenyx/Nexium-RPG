# 🚂 Railway Deployment Guide

## Prerequisites
- Railway account ([railway.app](https://railway.app))
- PostgreSQL database on Railway
- Discord OAuth application configured

## Step 1: Prepare Your Discord OAuth

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your bot application
3. Go to "OAuth2" → "General"
4. Add this redirect URI: `https://nexium-production.up.railway.app/auth/discord/callback`
5. Copy the Client ID and Client Secret

## Step 2: Set Up Railway Project

1. **Create Railway Project:**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli

   # Login to Railway
   railway login

   # Create new project
   railway init nexium-web
   ```

2. **Connect to GitHub:**
   - Go to your Railway project dashboard
   - Connect your GitHub repository
   - Enable automatic deployments

## Step 3: Configure Environment Variables

In your Railway project settings, add these environment variables:

```env
# Discord Configuration
DISCORD_TOKEN=your_discord_bot_token
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
DISCORD_CALLBACK_URL=https://nexium-production.up.railway.app/auth/discord/callback

# Database (Railway will provide this)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Web Server
NODE_ENV=production
WEB_PORT=${{PORT}}
SESSION_SECRET=your_generated_session_secret
FRONTEND_URL=https://nexium-production.up.railway.app

# Optional
REDIS_URL=${{Redis.REDIS_URL}}  # If you add Redis service
```

## Step 4: Set Up PostgreSQL Database

1. **Add PostgreSQL to Railway:**
   - In Railway dashboard, add PostgreSQL service
   - Railway will automatically provide `DATABASE_URL`

2. **Run Database Migrations:**
   ```bash
   # Connect to Railway
   railway connect

   # Run migrations
   npm run migrate

   # Seed characters
   npm run seed-characters
   ```

## Step 5: Deploy

1. **Trigger Deployment:**
   - Push changes to GitHub main branch
   - Railway will automatically deploy

2. **Monitor Deployment:**
   ```bash
   # Check deployment status
   railway status

   # View logs
   railway logs
   ```

## Step 6: Configure Custom Domain (Optional)

1. **Add Custom Domain:**
   - Go to Railway project settings
   - Add your custom domain
   - Update DNS records as instructed

2. **Update Environment Variables:**
   ```env
   FRONTEND_URL=https://your-custom-domain.com
   DISCORD_CALLBACK_URL=https://your-custom-domain.com/auth/discord/callback
   ```

## Step 7: Test the Deployment

1. **Visit your Railway URL:** `https://nexium-production.up.railway.app`
2. **Test Discord OAuth:** Click "Login with Discord"
3. **Test API endpoints:**
   - Health check: `https://nexium-production.up.railway.app/health`
   - Characters API: `https://nexium-production.up.railway.app/api/characters`

## Troubleshooting

### Common Issues:

1. **Port Issues:**
   - Railway uses `PORT` environment variable
   - Make sure your server listens on `process.env.PORT`

2. **Database Connection:**
   - Use Railway's provided `DATABASE_URL`
   - Ensure PostgreSQL service is running

3. **OAuth Redirect:**
   - Ensure Discord OAuth callback URL matches Railway domain
   - Update Discord application settings if domain changes

4. **Static Files:**
   - Files in `docs/` folder are served statically
   - Make sure CSS/JS paths are correct

### Useful Commands:

```bash
# Check Railway project status
railway status

# View deployment logs
railway logs

# Connect to database
railway connect

# Restart deployment
railway restart
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DISCORD_TOKEN` | Your Discord bot token | `Bot your_token_here` |
| `DISCORD_CLIENT_ID` | Discord OAuth client ID | `123456789012345678` |
| `DISCORD_CLIENT_SECRET` | Discord OAuth client secret | `your_client_secret` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:port/db` |
| `SESSION_SECRET` | Express session secret | `32-character-random-string` |
| `FRONTEND_URL` | Your Railway domain | `https://your-app.railway.app` |
| `NODE_ENV` | Environment | `production` |

## Security Notes

- Never commit `.env` files to GitHub
- Use Railway's environment variable system
- Keep your `SESSION_SECRET` secure and random
- Regularly rotate Discord tokens if needed

## Support

If you encounter issues:
1. Check Railway deployment logs
2. Verify environment variables are set correctly
3. Ensure database is accessible
4. Test Discord OAuth configuration

Your web app should be live at: **https://nexium-production.up.railway.app** 🚀
