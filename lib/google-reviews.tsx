export async function getGoogleReviews() {
  const apiKey = process.env.GOOGLE_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  
  if (!apiKey || !placeId) {
    console.warn("Google API Key or Place ID is missing");
    return [];
  }

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${apiKey}`;

  try {
    // Revalidate every hour (3600 seconds) to save API usage
    const res = await fetch(url, { next: { revalidate: 3600 } }); 
    
    if (!res.ok) {
      throw new Error(`Failed to fetch reviews: ${res.statusText}`);
    }

    const data = await res.json();
    return data.result.reviews || [];
  } catch (error) {
    console.error("Google Review Fetch Error:", error);
    return [];
  }
}