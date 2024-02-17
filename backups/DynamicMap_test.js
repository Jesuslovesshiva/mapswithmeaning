import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});
// Reverse mapping from city back to empire
const cityToEmpire = {
  Bulgan: "Mongol Empire",
  Viterbo: "Roman Empire",
  Panguipulli: "Americans",
  Sultanbeyli: "Byzantine Empire",
};

const patternsToExclude = [
  /Events\s*By\s*place/g,
  /By\s*topic/g,
  /Bulgan/g,
  /Levant/g,
  /Panguipulli/g,
  /Sultanbeyli/g,
  /Viterbo/g,
];

const DynamicMap = ({ countries, cities, details }) => {
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const fetchCoordinates = async () => {
      console.log(countries, cities, details); // Check if these are updated correctly
      const places = [...countries, ...cities]; // Ensure this data is correctly received
      const localCache = {};

      const coords = await Promise.all(
        places.map(async (place) => {
          if (localCache[place]) {
            return { ...localCache[place], place }; // Use cached data if available
          }

          try {
            const response = await fetch(
              `http://127.0.0.1:5000/geocode?address=${encodeURIComponent(
                place
              )}`
            );
            const data = await response.json();
            if (data && data.results && data.results.length > 0) {
              // Ensure this line matches the structure of your API response
              const { lat, lng } = data.results[0].geometry.location;
              const location = {
                lat: parseFloat(lat),
                lon: parseFloat(lng),
                place, // The original (historical or modern) name for display
                detail: details[place], // Corresponding details
              };
              localCache[place] = location;
              return location;
            } else {
              console.error(`No geocode result for ${place}`);
            }
          } catch (error) {
            console.error("Geocoding error for " + place + ":", error);
          }
          return null;
        })
      );

      setMarkers(coords.filter(Boolean)); // Update markers only if there are valid coordinates
    };

    if (
      countries.length > 0 ||
      cities.length > 0 ||
      Object.keys(details).length > 0
    ) {
      fetchCoordinates();
    }
  }, [countries, cities, details]); // React hooks dependency array

  return (
    <div style={{ height: "500px", width: "100%" }}>
      {typeof window !== "undefined" && (
        <MapContainer
          center={[20, 0]}
          zoom={2}
          scrollWheelZoom={false}
          style={{ height: "500px", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {markers.map(({ lat, lon, place, detail }, idx) => (
            <Marker key={idx} position={[lat, lon]}>
              <Popup>
                <strong style={{ fontSize: "1.1rem" }}>
                  {cityToEmpire[place] || place}{" "}
                  {/* Use the empire name if available, otherwise use the city name */}
                </strong>
                <br />
                <span
                  dangerouslySetInnerHTML={{
                    __html: (() => {
                      // Join detail array into a string and clean specific phrases
                      let detailsString = detail?.join(" ") || "";
                      patternsToExclude.forEach((pattern) => {
                        detailsString = detailsString.replace(pattern, "");
                      });

                      // Additional replacements for formatting
                      detailsString = detailsString
                        .replace(/ – /g, " ")
                        .replace(
                          /((January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2})–(\d{1,2})/g,
                          `<strong>$1–$3</strong><br />`
                        )
                        .replace(
                          /(^|\.\s+)((January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:-\d{1,2})?\.?)/g,
                          (match, p1, p2) =>
                            `${
                              p1.trim().length > 0 ? p1 + "<br />" : ""
                            }<strong>${p2.trim()}</strong><br />`
                        );
                      detailsString = detailsString.replace(/^<br\s*\/?>/i, "");

                      return detailsString;
                    })(),
                  }}
                />
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
};

export default DynamicMap;
