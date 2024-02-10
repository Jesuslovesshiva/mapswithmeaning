// pages/api/locations.js
export default async function handler(req, res) {
  const username = "danielll"; // Securely store and access your username
  const countryDataUrl = `http://api.geonames.org/countryInfoJSON?username=${username}`;
  const cityDataUrl = `http://api.geonames.org/citiesJSON?north=90&south=-90&east=180&west=-180&username=${username}`;
  const mentionedCountries = await extractLocationsFromContent(
    content,
    data.countries
  );
  try {
    // Fetch country data
    const countryResponse = await fetch(countryDataUrl);
    const cityResponse = await fetch(cityDataUrl);

    const countries = await countryResponse.json();

    // Optionally, fetch city data similarly

    // Process and send data back to client
    res.status(200).json({ countries, cities });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch location data" });
  }
}
