// `https://mapswithmeaning.lm.r.appspot.com/geocode?address=${encodeURIComponent(

import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import parse from "html-react-parser";
import { useMap } from "react-leaflet";
import L from "leaflet";

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
  Taif: "Arabian Empire (Islamic Caliphate)",
};

const patternsToExclude = [
  // /\n(January|February|March|April|May|June|July|August|September|October|November|December)(\s+\d{1,2})? – /g,
  /Events\s*By\s*place/g,
  /Cities\s*and\s*towns/g,
  /By\s*topic/g,
  /China\n/g,
  /Asia\n/g,
  /Sultanbeyli\s/g,
  /Europe\n/g,
  /\nEurope/g,
  /Japan\n/g,
  /\nReligion/g,
];

const formatTextBeforeExtend = (text) => {
  return text.replace(/U\.S\./g, "USA");
};

const formatText = (text) => {
  // Pattern Exclusion
  patternsToExclude.forEach((pattern) => {
    text = text.replace(pattern, "");
  });
  // Formatting for month-to-month ranges without specific days
  text = text.replace(
    /(\b(January|February|March|April|May|June|July|August|September|October|November|December)–(January|February|March|April|May|June|July|August|September|October|November|December)\b)/g,
    "<br /><strong>$1</strong><br />"
  );

  // Date Range Formatting for different month ranges with specific days and "&"
  text = text.replace(
    /(\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d+(\d*)\s*(?:&)\s*\d+(\d*)\b)/g,
    "<br /><strong>$1</strong><br />"
  );

  // Date Range Formatting for different month ranges with specific days and "&"
  text = text.replace(
    /(\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d+(\d*)\s*&\s*(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d+(\d*)\b)/g,
    "<br /><strong>$1</strong><br />"
  );

  text = text.replace(
    /(\bJanuary|\bFebruary|\bMarch|\bApril|\bMay|\bJune|\bJuly|\bAugust|\bSeptember|\bOctober|\bNovember|\bDecember)\s+(\d{1,2})\s+–\s+(\bJanuary|\bFebruary|\bMarch|\bApril|\bMay|\bJune|\bJuly|\bAugust|\bSeptember|\bOctober|\bNovember|\bDecember)\s+(\d{1,2})/g,
    "$1 $2–$3 $4"
  );

  text = text.replace(/.:\u200a([^' ']+)/g, ". ");

  // Remove patterns like ":\u200a177\u200a" and any text following until the end of the line
  text = text.replace(/:\u200a([^' ']+)/g, ".");

  text = text.replace(/(\.\s)/g, ". ");
  // text = text.replace(/(\.\s)/g, "");

  text = text.replace(/ – /g, " ");

  // Using regular expression to match date formats like "April/May" and format them as <strong> and <br> elements
  text = text.replace(
    /(^|\.\s+)((January|February|March|April|May|June|July|August|September|October|November|December)(\/[a-zA-Z]+)?(?!\s+\d{1,2}(–\d{1,2})?))/g,
    "$1<br /><strong>$2</strong><br />"
  );

  // Date Range Formatting for same month ranges (keeping only months here)
  text = text.replace(
    /(\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})–(\d{1,2})\b)/g,
    "<br /><strong>$1</strong><br />"
  );

  // Date Range Formatting for different month ranges with specific days
  text = text.replace(
    /(\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})–(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})\b)/g,
    "<br /><strong>$1</strong><br />"
  );

  text = text.replace(
    /(^|\. )\b(Spring|Summer|Winter|Autumn)\b/g,
    "$1<br /><strong>$2</strong><br />"
  );
  // Date Formatting for single dates or different month date ranges after a period or at the start
  // Keeping only months in this pattern as well
  text = text.replace(
    /(^|\.\s+)((January|February|March|April|May|June|July|August|September|October|November|December)(\s+\d{1,2}(–\d{1,2})?)?)/g,
    "$1<br /><strong>$2</strong><br />"
  );

  // Initial Break Removal
  text = text.replace(/^<br \/>/, "");

  return text;
};

function splitTextAtSentenceBoundary(text, maxWords) {
  // Split text into potential sentences.
  const potentialSentences = text.split(/([.!?]+)\s/).filter(Boolean); // Include punctuation in split results
  let wordCount = 0;
  let initialTextParts = [];
  let remainingTextParts = [];
  let isAccumulating = true;

  // Reconstruct sentences and determine split based on word count.
  for (let i = 0; i < potentialSentences.length; i += 2) {
    const sentence = potentialSentences[i] + (potentialSentences[i + 1] || ""); // Re-add punctuation.
    const sentenceWordCount = sentence.split(/\s+/).length;

    if (isAccumulating && wordCount + sentenceWordCount <= maxWords) {
      // Accumulate into initial text until maxWords is reached.
      initialTextParts.push(sentence);
      wordCount += sentenceWordCount;
    } else {
      // Once maxWords is exceeded, accumulate into remaining text.
      isAccumulating = false; // Ensure we only switch once.
      remainingTextParts.push(sentence);
    }
  }

  // Join the parts back into text.
  const initialText = initialTextParts.join(" ").trim();
  const remainingText = remainingTextParts.join(" ").trim();

  // Log for debugging.
  // console.log(`Splitting text for detail: ${text}`);
  // console.log(`Initial text: ${initialText}`);
  // console.log(`Remaining text: ${remainingText}`);

  return { initialText, remainingText };
}

function MapEffect({ closePopupsTrigger }) {
  const map = useMap();

  useEffect(() => {
    const closePopups = () => {
      map.closePopup();
    };

    // Add event listener for 'dragstart' to close popups
    map.on("dragstart", closePopups);

    // This part remains unchanged, it closes popups based on your existing closePopupsTrigger
    map.eachLayer((layer) => {
      if (layer instanceof L.Popup) {
        map.closePopup(layer);
      }
    });

    // Cleanup function to remove the event listener when the component is unmounted or dependencies change
    return () => {
      map.off("dragstart", closePopups);
    };
  }, [closePopupsTrigger, map]); // Add map to the dependency array if it's not already there

  return null; // no rendering, just for closing popups
}

const DynamicMap = ({ countries, cities, details, closePopupsTrigger }) => {
  const [markers, setMarkers] = useState([]);
  const [expandedDetails, setExpandedDetails] = useState({}); // State to track which details are expanded
  const detailRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [showLoadingBar, setShowLoadingBar] = useState(false);

  const empireToCity = {};
  Object.entries(cityToEmpire).forEach(([city, empire]) => {
    empireToCity[empire] = city;
  });

  // Translate the city names back in the detail text
  const translateCityNamesBack = (detail) => {
    Object.keys(empireToCity).forEach((empire) => {
      const city = empireToCity[empire];
      const regex = new RegExp(city, "gi");
      detail = detail.replace(regex, empire);
    });
    return detail;
  };

  // useEffect(() => {
  //   const zoomControlDiv = document.querySelector(
  //     ".leaflet-control-zoom.leaflet-bar.leaflet-control"
  //   );
  //   if (zoomControlDiv) {
  //     zoomControlDiv.style.display = "none";
  //   }
  // }, []); // This will run once when the component mounts

  useEffect(() => {
    const fetchCoordinates = async () => {
      setLoading(true); // Start the loading process
      const places = [...countries, ...cities];
      const localCache = {};

      const coords = await Promise.all(
        places.map(async (place) => {
          if (localCache[place]) {
            return { ...localCache[place], place };
          }

          try {
            const response = await fetch(
              `https://mapswithmeaning.lm.r.appspot.com/geocode?address=${encodeURIComponent(
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
      setLoading(false); // End the loading process once all markers are set
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
    setExpandedDetails({
      // Reset all details to false (collapsed state)
      ...Object.keys(expandedDetails).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {}),
      // Set only the clicked detail to true (expanded state)
      [idx]: false,
    });
  };

  return (
    <div>
      {loading && <span className="_it4vx _72fik"></span>}
      <div style={{ height: "500px", width: "100%" }}>
        {typeof window !== "undefined" && (
          <MapContainer
            center={[20, 0]}
            zoom={3}
            minZoom={1} // Set the minimum zoom level as needed
            scrollWheelZoom={true}
            maxBounds={[
              [-100, -250], // Southwest coordinates
              [100, 250], // Northeast coordinates
            ]}
            maxBoundsViscosity={1.0}
            style={{ height: "500px", width: "100%" }}
            className="Map"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {markers.map(({ lat, lon, place, detail }, idx) => {
              // Pre-process the detail text before splitting and formatting
              detail = translateCityNamesBack(detail);

              // Pre-process and split the detail text...
              // Apply for
              const preProcessedDetail = formatTextBeforeExtend(
                Array.isArray(detail) ? detail.join(" ") : detail
              );

              // Now split the pre-processed detail text
              const { initialText, remainingText } =
                splitTextAtSentenceBoundary(
                  preProcessedDetail, // Use the pre-processed text here
                  60 // Max words before 'View More'
                );
              // Apply formatText separately if needed or check the formatting
              const formattedInitialText = parse(formatText(initialText));
              let formattedRemainingText = parse(formatText(remainingText));

              // Check if initialText formatting ends properly, if not, adjust formattedRemainingText
              if (
                formattedInitialText &&
                !initialText.endsWith("<br />") &&
                remainingText
              ) {
                formattedRemainingText = (
                  <>
                    <br />
                    {formattedRemainingText}
                  </>
                );
              }
              return (
                <Marker
                  key={idx}
                  position={[lat, lon]}
                  eventHandlers={{ click: () => toggleDetail(idx) }}
                >
                  <Popup>
                    <strong
                      style={{ fontSize: "1.1rem" }}
                      data-empire={cityToEmpire[place] || place}
                    >
                      {cityToEmpire[place] || place}
                    </strong>
                    <br />
                    <div>
                      {formattedInitialText}
                      {remainingText && (
                        <>
                          <span
                            style={{
                              display: expandedDetails[idx] ? "inline" : "none",
                            }}
                          >
                            {formattedRemainingText}
                          </span>
                          <br />

                          <div
                            className=" transform transition-transform  text-custom-teal cursor-pointer mt-2 menu align-center expanded text-center SMN_effect-32"
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
                              <strong
                                onClick={() =>
                                  setExpandedDetails({
                                    [idx]: !expandedDetails[idx],
                                  })
                                }
                              >
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
            <MapEffect closePopupsTrigger={closePopupsTrigger} />{" "}
          </MapContainer>
        )}
      </div>
    </div>
  );
};

export default DynamicMap;
