const querystring = require('querystring');
const axios = require('axios');
const db = require('./db');

const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const REDIRECT_URI = process.env.DISCORD_REDIRECT_URI; // e.g. https://nexium-rpg.win/auth/discord/callback

exports.redirectToDiscord = (req, res) => {
  const params = querystring.stringify({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'identify email guilds',
    prompt: 'consent',
  });
  res.redirect(`https://discord.com/api/oauth2/authorize?${params}`);
};

// Refresh tokens for a user using refresh_token stored in DB
async function refreshTokenForUser(user_id) {
  const record = await db.getTokenByUserId(user_id);
  if (!record || !record.refresh_token) throw new Error('no refresh token');

  const data = new URLSearchParams();
  data.append('client_id', CLIENT_ID);
  data.append('client_secret', CLIENT_SECRET);
  data.append('grant_type', 'refresh_token');
  data.append('refresh_token', record.refresh_token);

  const tokenResp = await axios.post('https://discord.com/api/oauth2/token', data.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  const { access_token, refresh_token, expires_in, scope, token_type } = tokenResp.data;

  await db.upsertToken({ user_id, access_token, refresh_token, scope, expires_in });
  return { access_token, refresh_token, expires_in, scope, token_type };
}

exports.refreshTokenForUser = refreshTokenForUser;

exports.discordCallback = async (req, res) => {
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

    const { access_token, refresh_token, expires_in, scope, token_type } = tokenResp.data;

    // fetch user
    const userResp = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `${token_type} ${access_token}` },
    });

    const user = userResp.data;

    // store token in DB
    await db.upsertToken({ user_id: user.id, access_token, refresh_token, scope, expires_in });

    // set httpOnly cookie with user id
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('nexium_user', user.id, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: typeof expires_in === 'number' ? expires_in * 1000 : 24 * 60 * 60 * 1000,
    });

  // redirect to frontend (cookie will be used by frontend)
  // Use an absolute URL for the final redirect
  const baseUrl = process.env.BASE_URL || '';
  res.redirect(`${baseUrl}/login-success.html`);
  } catch (err) {
    console.error('OAuth callback error', err.response ? err.response.data : err.message);
    res.status(500).send('OAuth error');
  }
};

// Optional express handler to refresh tokens for current cookie user
exports.refreshHandler = async (req, res) => {
  const userId = req.cookies && req.cookies.nexium_user ? req.cookies.nexium_user : req.query.user_id;
  if (!userId) return res.status(400).json({ error: 'no user id' });
  try {
    const token = await refreshTokenForUser(userId);
    res.json({ ok: true, token });
  } catch (err) {
    console.error('refreshHandler error', err.message);
    res.status(500).json({ error: 'refresh failed' });
  }
};
