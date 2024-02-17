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
  Brescia: "Roman Empire",
  Panguipulli: "Americans",
  Sultanbeyli: "Byzantine Empire",
  Colchester: "Britain",
  Jeonju: "Korea",
  Huehuetenango: "Central America",
  Buraydah: "Arabian Empire",
};

const patternsToExclude = [
  /Events\s*By\s*place/g,
  /Cities\s*and\s*towns/g,
  /By\s*topic/g,
  /Bulgan/g,
  /Buraydah/g,
  /Levant/g,
  /Panguipulli/g,
  /Sultanbeyli/g,
  /Colchester/g,
  /Jeonju/g,
  /Huehuetenango/g,
  /Brescia/g,
  /China\n/g,
  /\n(January|February|March|April|May|June|July|August|September|October|November|December)(\s+\d{1,2})? – /g,
  /Asia\n/g,
  /\nSpring/g,
  /\nAutumn/g,
  /\nWinter/g,
  /\nSummer/g,
  /Europe\n/g,
  /\nEurope/g,
  /Japan\n/g,
  /\nReligion/g,
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
              `https://mapswithmeaning.lm.r.appspot.com/geocode?address=${encodeURIComponent(
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
                <strong
                  style={{ fontSize: "1.1rem" }}
                  data-empire={cityToEmpire[place] || place}
                >
                  {" "}
                  {cityToEmpire[place] || place}{" "}
                  {/* Use the empire name if available, otherwise use the city name */}
                </strong>
                <br />
                <span
                  dangerouslySetInnerHTML={{
                    __html: (() => {
                      // Join detail array into a string and clean specific phrases
                      let detailsString = detail?.join(" ") || "";

                      detailsString = detailsString.replace(
                        /(\b(\w+)\s+)\2/gi,
                        "$2"
                      );
                      // First, remove all patterns to exclude from the detailsString.
                      patternsToExclude.forEach((pattern) => {
                        detailsString = detailsString.replace(pattern, "");
                      });

                      // After removing all patterns, then check if adjustments related to the Roman Empire should be applied.
                      if (cityToEmpire[place] === "Roman Empire") {
                        // Replace specific phrases with correct ones related to the Roman Empire.
                        // These replacements are now outside of the patternsToExclude loop to avoid repeated applications.
                        detailsString = detailsString.replace(
                          /In the , /g,
                          "In the Roman Empire, "
                        );
                        detailsString = detailsString.replace(
                          /reach the ./g,
                          "reach the Roman Empire."
                        );
                      }

                      // Additional replacements for formatting
                      (detailsString = detailsString
                        .replace(/ – /g, " ")
                        .replace(
                          /(^|\s)((January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2})(–)(\d{1,2})/g,
                          `<br /><strong>$2–$5</strong><br />`
                        )
                        .replace(
                          /(^|\.\s+)((January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:-\d{1,2})?\.?)/g,
                          (match, p1, p2) =>
                            `${
                              p1.trim().length > 0 ? p1 + "<br />" : ""
                            }<strong>${p2.trim()}</strong><br />`
                        )),
                        (detailsString = detailsString.replace(
                          /^<br\s*\/?>/i,
                          ""
                        ));

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
