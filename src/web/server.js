const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize DB
const db = require('./db');
db.init();

// OAuth routes
const oauth = require('./auth');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Primary website: serve our httpdocs folder
const fs = require('fs');
const docsDir = path.join(__dirname, '..', '..', 'docs');
app.use(express.static(__dirname));

// Expose `docs/` as a backup under /backup (keeps GitHub Pages content available but not the site root)
if (fs.existsSync(docsDir)) {
  app.use('/backup', express.static(docsDir));
  console.log('Serving docs/ as backup at /backup');
}

// API routes
app.get('/leaderboards', (req, res) => {
  res.json({ message: 'Leaderboards will be displayed here!' });
});

app.get('/rewards', (req, res) => {
  res.json({ message: 'Rewards system coming soon!' });
});

// OAuth endpoints
app.get('/auth/discord', oauth.redirectToDiscord);
app.get('/auth/discord/callback', oauth.discordCallback);
app.get('/auth/refresh', oauth.refreshHandler);
app.post('/auth/logout', (req, res) => {
  const userId = req.cookies && req.cookies.nexium_user;
  if (userId) {
    res.clearCookie('nexium_user');
  }
  res.json({ ok: true });
});

// Returns current user info if token is stored
app.get('/me', async (req, res) => {
  const userId = req.query.user_id || req.cookies && req.cookies.nexium_user;
  if (!userId) return res.status(400).json({ error: 'user_id query param required' });
  try {
    const record = await db.getTokenByUserId(userId);
    if (!record) return res.status(404).json({ error: 'no token found' });

    // fetch user profile from Discord
    const axios = require('axios');
    const resp = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${record.access_token}` },
    });
    res.json({ discord: resp.data, token: { scope: record.scope } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'failed to fetch profile' });
  }
});

// Fallback: serve index.html for SPA routes
app.use((req, res) => {
  const publicIndex = path.join(__dirname, 'index.html');
  if (fs.existsSync(publicIndex)) return res.sendFile(publicIndex);
  res.status(404).send('Not found');
});

// Start the server
const server = app.listen(PORT, '0.0.0.0', () => {
  const address = server.address();
  console.log(`Server is running and listening at http://${address.address}:${address.port}`);
});

server.on('error', (err) => {
  console.error('Server startup error:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use.`);
  }
});
