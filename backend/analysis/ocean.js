function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function scoreOcean(features) {
  const {
    artistDiversity,
    genreDiversity,
    repetitionRate,
    crossGenreExploration,
    artistConsistency
  } = features;

  /*
   * IMPORTANT:
   * These are prototype, research-inspired heuristics.
   * They are NOT scientifically validated personality predictions.
   */

  // Openness:
  // More variety/exploration is treated as a possible signal.
  const openness = clamp(
    40 +
      artistDiversity * 3 +
      genreDiversity * 2 +
      crossGenreExploration * 1.5
  );

  // Conscientiousness:
  // Consistency is used as a weak behavioral signal.
  const consistencyScore =
    ((artistConsistency.shortMediumOverlap +
      artistConsistency.mediumLongOverlap) /
      10) *
    100;

  const conscientiousness = clamp(
    35 + consistencyScore * 0.35 - repetitionRate * 10
  );

  // Extraversion:
  // This prototype treats broader exploration as a weak possible signal.
  const extraversion = clamp(
    40 +
      artistDiversity * 2 +
      crossGenreExploration * 1.2
  );

  // Agreeableness:
  // We currently do NOT have enough evidence to make a strong
  // music-based inference, so keep this intentionally conservative.
  const agreeableness = 50;

  // Neuroticism:
  // We currently do NOT have reliable evidence for this trait.
  // Avoid pretending that music preferences reveal emotional health.
  const neuroticism = 50;

  return {
    openness: Math.round(openness),
    conscientiousness: Math.round(conscientiousness),
    extraversion: Math.round(extraversion),
    agreeableness: Math.round(agreeableness),
    neuroticism: Math.round(neuroticism)
  };
}

module.exports = {
  scoreOcean
};