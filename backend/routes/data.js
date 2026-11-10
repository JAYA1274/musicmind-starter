const express = require('express');
const axios = require('axios');
const mockProfile = require('../mock/profile');
const { extractFeatures } = require('../analysis/features');
const { scoreOcean } = require('../analysis/ocean');

const router = express.Router();

function requireAuth(req, res, next) {
  const token = req.cookies ? req.cookies['access_token'] : null;
  if (!token) return res.status(401).json({ error: 'Not logged in. Go to /auth/login first.' });
  req.accessToken = token;
  next();
}

async function spotifyGet(path, token, params = {}) {
  const { data } = await axios.get(`https://api.spotify.com/v1${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });
  return data;
}

// GET /api/top?type=artists|tracks&range=short_term|medium_term|long_term
router.get('/top', requireAuth, async (req, res) => {
  const type = req.query.type === 'tracks' ? 'tracks' : 'artists';
  const range = ['short_term', 'medium_term', 'long_term'].includes(req.query.range)
    ? req.query.range
    : 'medium_term';

  try {
    const data = await spotifyGet(`/me/top/${type}`, req.accessToken, {
      time_range: range,
      limit: 50,
    });
    res.json(data);
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
    res.status(500).json({ error: 'Failed to fetch top items' });
  }
});

// GET /api/recently-played
router.get('/recently-played', requireAuth, async (req, res) => {
  try {
    const data = await spotifyGet('/me/player/recently-played', req.accessToken, { limit: 50 });
    res.json(data);
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
    res.status(500).json({ error: 'Failed to fetch recently played' });
  }
});

// GET /api/genres?ids=artistId1,artistId2,...
// Batches artist lookups (Spotify allows up to 50 IDs per call) to pull genre tags
router.get('/genres', requireAuth, async (req, res) => {
  const ids = (req.query.ids || '').split(',').filter(Boolean).slice(0, 50);
  if (ids.length === 0) return res.json({ artists: [] });

  try {
    const data = await spotifyGet('/artists', req.accessToken, { ids: ids.join(',') });
    const genreMap = data.artists.map((a) => ({ id: a.id, name: a.name, genres: a.genres }));
    res.json({ artists: genreMap });
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
    res.status(500).json({ error: 'Failed to fetch genres' });
  }
});

// GET /api/full-profile — convenience endpoint that pulls everything needed
// for the feature-extraction layer in one call: top items across 3 ranges,
// recently played, and genre enrichment.
router.get('/full-profile', requireAuth, async (req, res) => {
  try {
    const ranges = ['short_term', 'medium_term', 'long_term'];

    const [shortArtists, mediumArtists, longArtists, topTracks, recent] = await Promise.all([
      spotifyGet('/me/top/artists', req.accessToken, { time_range: 'short_term', limit: 50 }),
      spotifyGet('/me/top/artists', req.accessToken, { time_range: 'medium_term', limit: 50 }),
      spotifyGet('/me/top/artists', req.accessToken, { time_range: 'long_term', limit: 50 }),
      spotifyGet('/me/top/tracks', req.accessToken, { time_range: 'medium_term', limit: 50 }),
      spotifyGet('/me/player/recently-played', req.accessToken, { limit: 50 }),
    ]);

    // Genres already come attached to each artist object from /me/top/artists —
    // no extra call needed unless you're enriching artist IDs found only in
    // /recently-played or /top/tracks (those only include track-level artist refs).
    res.json({
      topArtistsByRange: {
        short_term: shortArtists.items,
        medium_term: mediumArtists.items,
        long_term: longArtists.items,
      },
      topTracks: topTracks.items,
      recentlyPlayed: recent.items,
    });
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
    res.status(500).json({ error: 'Failed to build full profile' });
  }
});
router.get('/mock-profile', (req, res) => {
  res.json(mockProfile);
});
router.get('/features', (req, res) => {
  try {
    const features = extractFeatures(mockProfile);

    res.json(features);
  } catch (err) {
    console.error('Feature extraction failed:', err.message);

    res.status(500).json({
      error: 'Failed to extract features'
    });
  }
});
router.get('/analysis', (req, res) => {
  try {
    const features = extractFeatures(mockProfile);
    const ocean = scoreOcean(features);

    res.json({
      features,
      ocean
    });
  } catch (err) {
    console.error('Analysis failed:', err.message);

    res.status(500).json({
      error: 'Failed to analyze profile'
    });
  }
});
console.log("DATA ROUTES LOADED - ANALYSIS ROUTE READY");

module.exports = router;
