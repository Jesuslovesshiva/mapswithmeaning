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

const DynamicMap = ({ countries, details }) => {
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const fetchCoordinates = async () => {
      const localCache = {};

      const coords = await Promise.all(
        countries.map(async (country) => {
          if (localCache[country]) {
            return {
              ...localCache[country],
              country,
              detail: details[country],
            };
          }

          try {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                country
              )}&key=AIzaSyBZ3peBslyDJvye5KZF5ACHHmjgHlROryI`
            );
            const data = await response.json();
            if (data && data.results.length > 0) {
              const { lat, lng } = data.results[0].geometry.location; // Extract lat and lng from geometry.location
              const location = {
                lat: parseFloat(lat),
                lon: parseFloat(lng),
                country, // Add country name
                detail: details[country], // Add associated detail
              };
              localCache[country] = location; // Cache the coordinates
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

    if (countries.length > 0 && Object.keys(details).length > 0) {
      fetchCoordinates();
    }
  }, [countries, details]); // Depend on both countries and details

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
          {markers.map(({ lat, lon, country, detail }, idx) => (
            <Marker key={idx} position={[lat, lon]}>
              <Popup>
                <strong>{country}</strong>
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
