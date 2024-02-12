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
              `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                place
              )}&key=AIzaSyBZ3peBslyDJvye5KZF5ACHHmjgHlROryI`
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
                <strong>{place}</strong>
                <br />
                {detail?.join(" ")}{" "}
                {/* Assuming detail is an array of sentences */}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
};

export default DynamicMap;
