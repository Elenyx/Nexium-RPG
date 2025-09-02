# Nexium RPG Web App

This folder contains the web application for Nexium RPG, designed for Railway deployment.

## Structure

```
web/
├── server.js          # Main Express server with Discord OAuth
├── public/            # Static files served by Express
│   ├── index.html     # Landing page with Discord login
│   ├── dashboard.html # User dashboard (authenticated)
│   ├── collection.html # Character collection viewer
│   ├── 404.html       # 404 error page
│   └── css/           # Stylesheets
│       ├── dashboard.css
│       └── collection.css
```

## Features

- **Discord OAuth Integration**: Secure authentication via Discord
- **User Dashboard**: View profile stats and recent activity
- **Character Collection**: Browse and manage collected characters
- **Modern UI**: Responsive design with smooth animations
- **API Endpoints**: RESTful API for user data and characters

## Deployment

This web app is configured for Railway deployment with:
- PostgreSQL database integration
- Environment variable configuration
- Static file serving
- Health check endpoint

## Development

```bash
npm run web-dev  # Start development server with auto-reload
npm run web      # Start production server
```

## Environment Variables

Required environment variables for Railway:
- `DISCORD_CLIENT_ID`
- `DISCORD_CLIENT_SECRET`
- `DISCORD_CALLBACK_URL`
- `SESSION_SECRET`
- `DATABASE_URL`
- `FRONTEND_URL`
