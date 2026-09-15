// =====================================================
// PARSE USER SEARCH QUERY WITHOUT AI
// =====================================================

function parseRecommendationQuery(userQuery) {
  const query = userQuery.toLowerCase().trim();

  let location = null;
  let maxPrice = null;
  let minRating = null;

  // Extract location
  const locationMatch = query.match(
    /^(.+?)\s+(?:me|mein|in|at)\s+/
  );

  if (locationMatch) {
    location = locationMatch[1].trim();

    location = location
      .replace(/\bhome\b/gi, "")
      .replace(/\bhomes\b/gi, "")
      .trim();

    if (location) {
      location =
        location.charAt(0).toUpperCase() +
        location.slice(1);
    }
  }

  // Extract maximum price
  // Examples:
  // 5000 ke andar
  // 5000 ke under
  // under 5000
  // below 5000
  // upto 5000
  const priceMatch =
    query.match(
      /(\d[\d,]*)\s*(?:ke\s+andar|ke\s+under|ke\s+neeche|tak)/
    ) ||
    query.match(
      /(?:under|below|within|upto|up to|max|maximum)\s*(?:₹|rs\.?|inr)?\s*(\d[\d,]*)/
    );

  if (priceMatch) {
    const priceValue =
      priceMatch[1] || priceMatch[2];

    maxPrice = Number(
      priceValue.replace(/,/g, "")
    );
  }

  // Extract minimum rating
  const ratingMatch = query.match(
    /(\d+(?:\.\d+)?)\s*\+?\s*(?:rating|ratings?|star|stars)/
  );

  if (ratingMatch) {
    minRating = Number(ratingMatch[1]);
  }

  return {
    location,
    maxPrice,
    minRating,
  };
}

module.exports = {
  parseRecommendationQuery,
};