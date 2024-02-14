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
const DynamicMap = ({ countries, cities, details }) => {
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const fetchCoordinates = async () => {
      const places = [...countries, ...cities];
      const localCache = {};

      const coords = await Promise.all(
        places.map(async (place) => {
          if (localCache[place]) {
            return localCache[place];
          }

          try {
            const response = await fetch(
              `https://mapswithmeaning.lm.r.appspot.com/geocode?address=${encodeURIComponent(
                place
              )}`
            );
            const data = await response.json();
            if (data && data.results.length > 0) {
              const { lat, lng } = data.results[0].geometry.location; // Extract lat and lng from geometry.location
              const location = {
                lat: parseFloat(lat),
                lon: parseFloat(lng),
                place, // Add place name
                detail: details[place], // Add associated detail
              };
              localCache[place] = location; // Cache the coordinates
              return location;
            }
          } catch (error) {
            console.error("Geocoding error:", error);
          }
          return null;
        })
      );

      setMarkers(coords.filter(Boolean)); // Update state with valid coordinates
    };

    if (
      countries.length > 0 &&
      cities.length > 0 &&
      Object.keys(details).length > 0
    ) {
      fetchCoordinates();
    }
  }, [countries, cities, details]); // Depend on both countries, cities, and details

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
                <strong style={{ fontSize: "1.1rem" }}>{place}</strong>
                <br />
                <span
                  dangerouslySetInnerHTML={{
                    __html: detail
                      ?.join(" ")
                      // Remove dash and space after it for simple cases
                      .replace(/ – /g, " ")

                      .replace(
                        /(\. )((January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(–\d{1,2})?)/g,
                        `$1<br />$2`
                      )
                      // Format date ranges to include the entire range in bold and add a line break after it
                      .replace(
                        /((January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2})–(\d{1,2})/g,
                        `<strong>$1–$3</strong><br />`
                      )
                      // Check if the string starts with a date, make it bold, and add a line break after it for single dates
                      .replace(
                        /^((January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2})/g,
                        `<strong>$1</strong><br />`
                      )
                      // Also, find single dates after a period and apply the same formatting
                      .replace(
                        /(\. )((January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2})/g,
                        `$1<br /><strong>$2</strong><br />`
                      ),
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
