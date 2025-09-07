// Netlify API function that handles all API routes
const express = require('express');
const serverless = require('serverless-http');
const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const querystring = require('querystring');
const axios = require('axios');

// Initialize Express app
const app = express();
dotenv.config();

// Get OAuth config from environment variables
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const REDIRECT_URI = process.env.DISCORD_REDIRECT_URI;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Normalize paths coming from Netlify dev / direct function invocation.
// Sometimes the incoming URL contains the full function prefix like
// '/.netlify/functions/api/...'. Strip that prefix so our Express routes
// (which expect paths like '/auth/discord') match correctly.
app.use((req, res, next) => {
  try {
    if (req.url && req.url.startsWith('/.netlify/functions/api')) {
      req.url = req.url.replace('/.netlify/functions/api', '') || '/';
    }
  } catch (e) {
    console.error('Path normalization error', e && e.message);
  }
  next();
});

// Simple in-memory token store (for demo purposes)
// In production, use a database like MongoDB, Postgres, or Fauna
const tokenStore = {};

// Discord OAuth2 routes
app.get('/auth/discord', (req, res) => {
  const params = querystring.stringify({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'identify email guilds',
    prompt: 'consent',
  });
  res.redirect(`https://discord.com/api/oauth2/authorize?${params}`);
});

app.get('/auth/discord/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send('No code');
  
  try {
    const data = new URLSearchParams();
    data.append('client_id', CLIENT_ID);
    data.append('client_secret', CLIENT_SECRET);
    data.append('grant_type', 'authorization_code');
    data.append('code', code);
    data.append('redirect_uri', REDIRECT_URI);

    const tokenResp = await axios.post('https://discord.com/api/oauth2/token', data.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const { access_token, refresh_token, expires_in, scope } = tokenResp.data;

    // fetch user
    const userResp = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const user = userResp.data;
    
    // Store token in memory (or database in production)
    tokenStore[user.id] = { 
      access_token, 
      refresh_token, 
      scope, 
      expires_at: Date.now() + (expires_in * 1000) 
    };

    // Build a small token payload and set it as an httpOnly cookie so serverless
    // invocations (and /me) can read tokens during local dev. In production you
    // should use a proper database and avoid storing long-lived secrets in cookies.
    const tokenPayload = {
      user_id: user.id,
      access_token,
      refresh_token,
      scope,
      expires_at: tokenStore[user.id].expires_at,
    };
  // Mark cookie as secure only in production. Netlify dev runs on http://localhost:8888
  const secureCookie = process.env.NODE_ENV === 'production' && !process.env.DISABLE_SECURE_COOKIE;
    res.cookie('nexium_token', JSON.stringify(tokenPayload), {
      httpOnly: true,
      secure: !!secureCookie,
      sameSite: 'lax',
      maxAge: typeof expires_in === 'number' ? expires_in * 1000 : 24 * 60 * 60 * 1000,
    });
+
    // Also set a simple user id cookie for legacy compatibility
    res.cookie('nexium_user', user.id, {
      httpOnly: true,
      secure: !!secureCookie,
      sameSite: 'lax',
      maxAge: typeof expires_in === 'number' ? expires_in * 1000 : 24 * 60 * 60 * 1000,
    });

  // Redirect to login success page
  // Use an absolute URL for the final redirect (BASE_URL can be set in Netlify env)
  const baseUrl = process.env.BASE_URL || '';
  res.redirect(`${baseUrl}/login-success.html`);
  } catch (err) {
    console.error('OAuth callback error', err.response ? err.response.data : err.message);
    res.status(500).send('OAuth error');
  }
});

app.get('/auth/refresh', async (req, res) => {
  // Support reading refresh token from cookie (helpful in serverless/dev)
  const tokenCookie = req.cookies?.nexium_token;

  let userId = req.cookies?.nexium_user || req.query.user_id;
  let refreshToken;

  if (tokenCookie) {
    try {
      const payload = JSON.parse(tokenCookie);
      userId = userId || payload.user_id;
      refreshToken = payload.refresh_token;
    } catch (e) {
      console.error('Failed to parse token cookie', e && e.message);
    }
  }

  if (!userId) return res.status(400).json({ error: 'no user id' });

  try {
    const token = tokenStore[userId];
    const refresh_token = refreshToken || token?.refresh_token;
    if (!refresh_token) return res.status(404).json({ error: 'no refresh token found' });

    const data = new URLSearchParams();
    data.append('client_id', CLIENT_ID);
    data.append('client_secret', CLIENT_SECRET);
    data.append('grant_type', 'refresh_token');
    data.append('refresh_token', refresh_token);

    const tokenResp = await axios.post('https://discord.com/api/oauth2/token', data.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const { access_token, refresh_token: new_refresh, expires_in, scope } = tokenResp.data;

    // Update token store and cookie
    tokenStore[userId] = {
      access_token,
      refresh_token: new_refresh,
      scope,
      expires_at: Date.now() + (expires_in * 1000),
    };

    const tokenPayload = {
      user_id: userId,
      access_token,
      refresh_token: new_refresh,
      scope,
      expires_at: tokenStore[userId].expires_at,
    };
    const secureCookie = process.env.NODE_ENV === 'production' && !process.env.DISABLE_SECURE_COOKIE;
    res.cookie('nexium_token', JSON.stringify(tokenPayload), {
      httpOnly: true,
      secure: !!secureCookie,
      sameSite: 'lax',
      maxAge: typeof expires_in === 'number' ? expires_in * 1000 : 24 * 60 * 60 * 1000,
    });

    res.json({ ok: true, token: { scope } });
  } catch (err) {
    console.error('refreshHandler error', err && (err.response?.data || err.message));
    res.status(500).json({ error: 'refresh failed' });
  }
});

app.post('/auth/logout', (req, res) => {
  const userId = req.cookies?.nexium_user;
  if (userId) {
    // Remove from token store
    delete tokenStore[userId];
    // Clear all cookies
    res.clearCookie('nexium_user');
    res.clearCookie('nexium_token');
  }
  res.json({ ok: true });
});

// User info endpoint
app.get('/me', async (req, res) => {
  // Attempt to read token from cookie first (supports serverless)
  const tokenCookie = req.cookies?.nexium_token;
  let userId = req.cookies?.nexium_user || req.query.user_id;
  let token;

  if (tokenCookie) {
    try {
      const payload = JSON.parse(tokenCookie);
      userId = userId || payload.user_id;
      token = {
        access_token: payload.access_token,
        refresh_token: payload.refresh_token,
        scope: payload.scope,
        expires_at: payload.expires_at,
      };
    } catch (e) {
      console.error('Failed to parse token cookie', e && e.message);
    }
  }

  if (!token && userId) {
    token = tokenStore[userId];
  }

  if (!userId) return res.status(400).json({ error: 'user_id required' });

  if (!token) return res.status(404).json({ error: 'no token found' });

  try {
    // Check and refresh if expired
    if (token.expires_at && token.expires_at < Date.now() && token.refresh_token) {
      await refreshToken(userId);
      token = tokenStore[userId] || token;
    }

    const resp = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${token.access_token}` },
    });
    res.json({ discord: resp.data, token: { scope: token.scope } });
  } catch (err) {
    console.error('Error fetching profile:', err && (err.response?.data || err.message));
    res.status(500).json({ error: 'failed to fetch profile' });
  }
});

// Helper function to refresh a token
async function refreshToken(userId) {
  const token = tokenStore[userId];
  if (!token || !token.refresh_token) {
    throw new Error('No refresh token available');
  }
  
  const data = new URLSearchParams();
  data.append('client_id', CLIENT_ID);
  data.append('client_secret', CLIENT_SECRET);
  data.append('grant_type', 'refresh_token');
  data.append('refresh_token', token.refresh_token);

  const tokenResp = await axios.post('https://discord.com/api/oauth2/token', data.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  const { access_token, refresh_token, expires_in, scope } = tokenResp.data;

  // Update token in store
  tokenStore[userId] = {
    access_token,
    refresh_token,
    scope,
    expires_at: Date.now() + (expires_in * 1000)
  };
  
  return tokenStore[userId];
}

// Example API endpoints
app.get('/leaderboards', (req, res) => {
  res.json({ message: 'Leaderboards will be displayed here!' });
});

app.get('/rewards', (req, res) => {
  res.json({ message: 'Rewards system coming soon!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error', message: err.message });
});

// Export the serverless function
module.exports.handler = serverless(app);
