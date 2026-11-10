function unique(values) {
  return [...new Set(values)];
}

function calculateArtistDiversity(profile) {
  const artists = profile.topArtistsByRange.medium_term || [];

  return unique(artists.map((artist) => artist.id)).length;
}

function calculateGenreDiversity(profile) {
  const artists = profile.topArtistsByRange.medium_term || [];

  const genres = artists.flatMap((artist) => artist.genres || []);

  return unique(genres).length;
}

function calculateRepetitionRate(profile) {
  const recent = profile.recentlyPlayed || [];

  if (recent.length === 0) return 0;

  const trackCounts = {};

  for (const item of recent) {
    const trackId = item.track?.id;

    if (!trackId) continue;

    trackCounts[trackId] = (trackCounts[trackId] || 0) + 1;
  }

  const repeatedPlays = Object.values(trackCounts)
    .filter((count) => count > 1)
    .reduce((sum, count) => sum + count, 0);

  return repeatedPlays / recent.length;
}

function calculateCrossGenreExploration(profile) {
  const ranges = profile.topArtistsByRange || {};

  const allGenres = [];

  for (const range of Object.values(ranges)) {
    for (const artist of range) {
      allGenres.push(...(artist.genres || []));
    }
  }

  const uniqueGenres = unique(allGenres);

  return uniqueGenres.length;
}

function calculateArtistConsistency(profile) {
  const ranges = profile.topArtistsByRange || {};

  const shortTerm = new Set(
    (ranges.short_term || []).map((artist) => artist.id)
  );

  const mediumTerm = new Set(
    (ranges.medium_term || []).map((artist) => artist.id)
  );

  const longTerm = new Set(
    (ranges.long_term || []).map((artist) => artist.id)
  );

  const mediumLongOverlap = [...mediumTerm].filter((id) =>
    longTerm.has(id)
  ).length;

  const shortMediumOverlap = [...shortTerm].filter((id) =>
    mediumTerm.has(id)
  ).length;

  return {
    shortMediumOverlap,
    mediumLongOverlap
  };
}

function extractFeatures(profile) {
  return {
    artistDiversity: calculateArtistDiversity(profile),
    genreDiversity: calculateGenreDiversity(profile),
    repetitionRate: calculateRepetitionRate(profile),
    crossGenreExploration: calculateCrossGenreExploration(profile),
    artistConsistency: calculateArtistConsistency(profile)
  };
}

module.exports = {
  extractFeatures
};