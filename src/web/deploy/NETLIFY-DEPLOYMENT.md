````markdown
# Nexium RPG - Netlify Deployment Guide

This guide explains how to deploy the Nexium RPG Discord bot website to Netlify.

## Prerequisites

- A [Netlify](https://www.netlify.com/) account
- The [Netlify CLI](https://docs.netlify.com/cli/get-started/) (optional, for testing locally)
- Your Discord application credentials (Client ID and Secret)

## Deployment Steps

### 1. Update your Discord Developer Portal settings

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your Nexium RPG application
3. Go to the "OAuth2" section
4. Add the following redirect URIs:
   ```
   https://your-site-name.netlify.app/.netlify/functions/api/auth/discord/callback
   ```
   AND if using a custom domain:
   ```
   https://your-domain.com/.netlify/functions/api/auth/discord/callback
   ```
   For local development:
   ```
   http://localhost:8888/.netlify/functions/api/auth/discord/callback
   ```
   
   (Note: Replace placeholders with your actual site names)

### 2. Deploy to Netlify

#### Option A: Deploy via the Netlify UI

1. Log in to your Netlify account
2. Click "New site from Git"
3. Connect to your GitHub repository
4. Select the repository and branch
5. Configure the build settings:
   - Build command: `npm install && cd netlify/functions && npm install`
   - Publish directory: `src/web`
   - Functions directory: `netlify/functions`
6. Click "Deploy site"

#### Option B: Deploy via the Netlify CLI

1. Install the Netlify CLI: `npm install -g netlify-cli`
2. Log in: `netlify login`
3. Initialize your site: `netlify init`
4. Follow the prompts to create a new site or connect to an existing one
5. Deploy: `netlify deploy --prod`

### 3. Configure Environment Variables

After deploying, you need to set up your environment variables in the Netlify dashboard:

1. Go to your site settings in the Netlify dashboard
2. Navigate to "Build & deploy" > "Environment"
3. Add the following environment variables:
   - `DISCORD_CLIENT_ID`: Your Discord application client ID
   - `DISCORD_CLIENT_SECRET`: Your Discord application client secret
   - `DISCORD_REDIRECT_URI`: `https://your-netlify-site-name.netlify.app/.netlify/functions/api/auth/discord/callback`
   - `NODE_ENV`: `production`

### 4. Testing Locally (Optional)

To test your Netlify functions locally before deploying:

1. Install the Netlify CLI: `npm install -g netlify-cli` (if not already installed)
2. Start the local development server: `netlify dev`
3. Open your browser to the URL shown in the terminal (typically `http://localhost:8888`)

## Project Structure

- `/netlify.toml` - Netlify configuration file
- `/netlify/functions/api.js` - The serverless function that handles all API routes
- `/netlify/functions/package.json` - Function-specific dependencies
- `/package.json` - Main project dependencies (also includes function dependencies)
- `/src/web/` - Static website files

## Dependency Management

This project uses two approaches to manage function dependencies:

1. **Plugin Method**: The `@netlify/plugin-functions-install-core` plugin is configured in 
   `netlify.toml` to automatically install dependencies listed in the function's package.json.

2. **Build Command Method**: As a fallback, the build command installs dependencies 
   for both the main project and the functions:

   ```bash
   npm install && cd netlify/functions && npm install
   ```

These approaches ensure that all required dependencies, including `serverless-http`, 
are available to the Netlify Functions at runtime.

## Troubleshooting

### Function and OAuth Issues

1. Check the Netlify function logs in the Netlify dashboard
2. Verify that your environment variables are set correctly
3. Make sure your Discord OAuth2 redirect URI matches your Netlify site URL
4. Check that the Discord application has the correct permissions and redirect URIs

### SSL Certificate Issues

If you encounter SSL errors like "ERR_CERT_AUTHORITY_INVALID" or "Your connection is not private":

1. **Verify DNS Configuration**
   - Ensure your DNS records are correctly pointing to Netlify
   - For apex domain: Add `A` records pointing to Netlify's load balancer IPs
   - For subdomains: Use a `CNAME` record pointing to your `sitename.netlify.app` domain

2. **Check SSL Certificate Status**
   - Go to Netlify dashboard → Site settings → Domain management → HTTPS
   - Ensure "Netlify DNS" or "Custom certificate" is enabled
   - Certificate provisioning can take up to 24 hours
   - Click "Renew certificate" if provisioning seems stuck

3. **Manage HSTS Settings**
   - If you're still setting up the site, temporarily disable HSTS until SSL is working correctly
   - HSTS preload can cause browsers to refuse connections even after fixing SSL issues
   - To clear HSTS locally in Chrome, visit `chrome://net-internals/#hsts` and delete the domain

4. **Force HTTPS Redirects**
   - Ensure your `netlify.toml` includes HTTPS headers:
     ```toml
     [[headers]]
       for = "/*"
       [headers.values]
         Strict-Transport-Security = "max-age=63072000; includeSubDomains; preload"
     ```

For more help, visit the [Netlify support forums](https://answers.netlify.com/) or [Discord Developer Portal](https://discord.com/developers/docs/intro).

````
