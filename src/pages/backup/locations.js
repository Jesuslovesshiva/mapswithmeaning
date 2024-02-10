// export default async function handler(req, res) {
//   const username = "danielll"; // Securely store and access your username
//   const countryDataUrl = `http://api.geonames.org/countryInfoJSON?username=${username}`;
//   const cityDataUrl = `http://api.geonames.org/citiesJSON?north=90&south=-90&east=180&west=-180&username=${username}`;

//   try {
//     // Fetch country data
//     const countryResponse = await fetch(countryDataUrl);
//     if (!countryResponse.ok) {
//       throw new Error("Failed to fetch country data");
//     }
//     const countries = await countryResponse.json();

//     // Optionally, fetch city data similarly
//     const cityResponse = await fetch(cityDataUrl);
//     if (!cityResponse.ok) {
//       throw new Error("Failed to fetch city data");
//     }
//     const cities = await cityResponse.json();

//     // Process and send data back to client
//     res.status(200).json({ countries, cities });
//   } catch (error) {
//     console.error("Error fetching location data:", error);
//     res.status(500).json({ error: "Failed to fetch location data" });
//   }
// }
