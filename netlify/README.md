# Nexium RPG - Netlify Setup

This directory contains the Netlify configuration and serverless functions for the Nexium RPG website.

## Structure

- `/functions` - Contains serverless functions
  - `api.js` - Main API function that handles Discord OAuth2 and other API endpoints
  - `package.json` - Function-specific dependencies

## Dependencies

The functions require several dependencies, including:
- `serverless-http`
- `express`
- `cookie-parser`
- `dotenv`
- `axios`

## Solving the "Cannot find module 'serverless-http'" Error

If you encounter this error during deployment, use one of these solutions:

### Solution 1: Using the Netlify Functions Plugin (Recommended)

Add the following to your `netlify.toml` file:

```toml
[[plugins]]
  package = "@netlify/plugin-functions-install-core"
```

This plugin automatically installs dependencies listed in your function's package.json.

### Solution 2: Installing Dependencies in the Build Command

Update your build command in `netlify.toml`:

```toml
command = "npm install && cd netlify/functions && npm install"
```

### Solution 3: Moving Dependencies to Root package.json

Ensure all function dependencies are also included in the root `package.json`:

```json
"dependencies": {
  "serverless-http": "^3.2.0",
  "express": "^5.1.0",
  "cookie-parser": "^1.4.7",
  "dotenv": "^16.4.5",
  "axios": "^1.7.7"
}
```

## Local Development

To test functions locally:

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Install dependencies
npm install
cd netlify/functions && npm install
cd ../..

# Run Netlify dev server
netlify dev
```

This starts a local server at http://localhost:8888 that emulates the Netlify environment.
