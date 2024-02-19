import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import parse from "html-react-parser";

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
  Karbala: "Abbasid Caliphate",
  Amstetten: "Europe",
  Aksaray: "Byzantium",
  Yasuj: "Persia",
};

const patternsToExclude = [
  /\n(January|February|March|April|May|June|July|August|September|October|November|December)(\s+\d{1,2})? – /g,
  /Events\s*By\s*place/g,
  /Cities\s*and\s*towns/g,
  /By\s*topic/g,
  /China\n/g,
  /Asia\n/g,
  // /\nSpring/g,
  // /Spring/g,
  // /\nAutumn/g,
  // /\nWinter/g,
  // /\nSummer/g,
  /Europe\n/g,
  /\nEurope/g,
  /Japan\n/g,
  /\nReligion/g,
];

const formatText = (text) => {
  // Pattern Exclusion
  patternsToExclude.forEach((pattern) => {
    text = text.replace(pattern, "");
  });

  // Hyphen Handling
  text = text.replace(/ – /g, " ");

  // Date Range Formatting for same month ranges
  text = text.replace(
    /(\b(January|February|March|April|May|June|July|August|September|October|November|December|Spring|Summer|Winter|Autumn)\s+(\d{1,2})–(\d{1,2})\b)/g,
    "<br /><strong>$1</strong><br />"
  );

  // Date Formatting for single dates or different month date ranges after a period or at the start
  text = text.replace(
    /(^|\.\s+)((January|February|March|April|May|June|July|August|September|October|November|December|Spring|Summer|Winter|Autumn)\s+(\d{1,2}(–\d{1,2})?))/g,
    "$1<br /><strong>$2</strong><br />"
  );

  // Initial Break Removal
  text = text.replace(/^<br \/>/, "");

  return text;
};

const splitTextAtSentenceBoundary = (text, maxWords) => {
  const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || []; // Split text into sentences
  let wordCount = 0;
  let lastIndex = 0;
  for (let i = 0; i < sentences.length; i++) {
    const sentenceWordCount = sentences[i].split(" ").length;
    if (wordCount + sentenceWordCount > maxWords) break; // Stop if adding another sentence exceeds limit
    wordCount += sentenceWordCount;
    lastIndex = i;
  }

  const initialText = sentences
    .slice(0, lastIndex + 1)
    .join(" ")
    .trim();
  const remainingText = sentences
    .slice(lastIndex + 1)
    .join(" ")
    .trim();
  return { initialText, remainingText };
};

const DynamicMap = ({ countries, cities, details }) => {
  const [markers, setMarkers] = useState([]);
  const [expandedDetails, setExpandedDetails] = useState({}); // State to track which details are expanded
  const detailRef = useRef(null); // Reference to the element
  // This effect sets up the click listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (detailRef.current && !detailRef.current.contains(event.target)) {
        // Set a timeout before closing the popup
        setTimeout(() => {
          setExpandedDetails({}); // Adjust this line to match how you're toggling details
        }, 250);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // Include all dependencies here

  useEffect(() => {
    const fetchCoordinates = async () => {
      const places = [...countries, ...cities];
      const localCache = {};

      const coords = await Promise.all(
        places.map(async (place) => {
          if (localCache[place]) {
            return { ...localCache[place], place };
          }

          try {
            const response = await fetch(
              `http://localhost:5000/geocode?address=${encodeURIComponent(
                place
              )}`
            );
            const data = await response.json();
            if (data && data.results && data.results.length > 0) {
              const { lat, lng } = data.results[0].geometry.location;
              const location = {
                lat: parseFloat(lat),
                lon: parseFloat(lng),
                place,
                detail: details[place],
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

      setMarkers(coords.filter(Boolean));
    };

    if (
      countries.length > 0 ||
      cities.length > 0 ||
      Object.keys(details).length > 0
    ) {
      fetchCoordinates();
    }
  }, [countries, cities, details]);

  // Define toggleDetail function here
  const toggleDetail = (idx) => {
    setExpandedDetails((prevDetails) => ({
      ...prevDetails,
      [idx]: !prevDetails[idx],
    }));
  };
  return (
    <div style={{ height: "500px", width: "100%" }}>
      {typeof window !== "undefined" && (
        <MapContainer
          center={[20, 0]}
          zoom={3}
          scrollWheelZoom={true}
          style={{ height: "500px", width: "100%" }}
          className="Map"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {markers.map(({ lat, lon, place, detail }, idx) => {
            const { initialText, remainingText } = splitTextAtSentenceBoundary(
              Array.isArray(detail) ? detail.join(" ") : detail, // Modify this based on the structure of your detail data
              60 // Max words before 'View More'
            );
            return (
              <Marker key={idx} position={[lat, lon]}>
                <Popup>
                  <strong
                    style={{ fontSize: "1.1rem" }}
                    data-empire={cityToEmpire[place] || place}
                  >
                    {cityToEmpire[place] || place}
                  </strong>
                  <br />
                  <div>
                    {parse(formatText(initialText))}
                    {remainingText && (
                      <>
                        <span
                          style={{
                            display: expandedDetails[idx] ? "inline" : "none",
                          }}
                        >
                          {parse(formatText(remainingText))}
                        </span>
                        <br />

                        <div
                          className=" transform transition-transform  text-custom-peach cursor-pointer mt-2 menu align-center expanded text-center SMN_effect-32"
                          // onMouseEnter={(e) =>
                          //   (e.target.style.filter = "brightness(100%)")
                          // }
                          // onMouseLeave={(e) =>
                          //   (e.target.style.filter = "brightness(80%)")
                          // }
                        >
                          {/* Iterate over your items or just have one, for example */}
                          <div ref={detailRef}>
                            {" "}
                            {/* Attach the ref to your popup or expandable element */}
                            <strong onClick={() => toggleDetail(idx)}>
                              <a data-hover="View more">
                                {expandedDetails[idx]
                                  ? "View Less"
                                  : "View More"}
                              </a>

                              <span
                                className="transform transition-transform ml-2"
                                style={{
                                  display: "inline-block",
                                  transform: "scaleX(1.8) scaleY(1)",
                                }}
                              >
                                &#709;
                              </span>
                            </strong>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      )}
    </div>
  );
};

export default DynamicMap;
