// Inside DynamicMap component
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

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
              `http://localhost:5000/geocode?location=${encodeURIComponent(
                country
              )}`
            );
            const data = await response.json();
            if (data && data.length > 0) {
              const location = {
                lat: parseFloat(data[0].lat),
                lon: parseFloat(data[0].lon),
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
            {detail?.join(" ")} {/* Assuming detail is an array of sentences */}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default DynamicMap;
