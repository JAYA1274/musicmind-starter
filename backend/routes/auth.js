const express = require('express');
const axios = require('axios');
const crypto = require('crypto');

const router = express.Router();

const SCOPES = ['user-top-read', 'user-read-recently-played'].join(' ');

function generateRandomString(length) {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
}

// Step 1: redirect user to Spotify's consent screen
router.get('/login', (req, res) => {
  const state = generateRandomString(16);
  res.cookie('spotify_auth_state', state, { httpOnly: true, maxAge: 5 * 60 * 1000 });

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope: SCOPES,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    state,
  });

  res.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
});

// Step 2: Spotify redirects back here with a code
router.get('/callback', async (req, res) => {
  const { code, state } = req.query;
  const storedState = req.cookies ? req.cookies['spotify_auth_state'] : null;

  if (!state || state !== storedState) {
    return res.status(400).send('State mismatch — possible CSRF attempt. Try logging in again.');
  }
  res.clearCookie('spotify_auth_state');

  try {
    const tokenResponse = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization:
            'Basic ' +
            Buffer.from(
              `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
            ).toString('base64'),
        },
      }
    );

    const { access_token, refresh_token, expires_in } = tokenResponse.data;

    // MVP: store tokens in httpOnly cookies. Fine for a demo/single-user flow;
    // swap for a proper session/DB store before this goes anywhere near production.
    res.cookie('access_token', access_token, { httpOnly: true, maxAge: expires_in * 1000 });
    res.cookie('refresh_token', refresh_token, { httpOnly: true });

    res.redirect('/dashboard.html');
  } catch (err) {
    console.error('Token exchange failed:', err.response ? err.response.data : err.message);
    res.status(500).send('Something went wrong during Spotify login. Check server logs.');
  }
});

// Refresh an expired access token
router.get('/refresh', async (req, res) => {
  const refreshToken = req.cookies ? req.cookies['refresh_token'] : null;
  if (!refreshToken) return res.status(401).json({ error: 'No refresh token found. Please log in again.' });

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization:
            'Basic ' +
            Buffer.from(
              `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
            ).toString('base64'),
        },
      }
    );

    const { access_token, expires_in } = response.data;
    res.cookie('access_token', access_token, { httpOnly: true, maxAge: expires_in * 1000 });
    res.json({ ok: true });
  } catch (err) {
    console.error('Token refresh failed:', err.response ? err.response.data : err.message);
    res.status(500).json({ error: 'Refresh failed' });
  }
});

module.exports = router;
