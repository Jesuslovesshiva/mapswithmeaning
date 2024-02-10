import React, { useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Dynamically import the DynamicMap component, disabling SSR
const DynamicMap = dynamic(() => import("/src/pages/DynamicMap"), {
  ssr: false,
});

const HomePage = () => {
  const [year, setYear] = useState("");
  const [content, setContent] = useState("");
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false); // Define the loading state here

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedYear = year.trim();

    // Validate that the year is a 4-digit number
    if (/^\d{4}$/.test(trimmedYear)) {
      // Fetch the Wikipedia content for the entered year
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&titles=${trimmedYear}&origin=*`
      );
      const data = await response.json();
      const pageId = Object.keys(data.query.pages)[0];
      const pageContent = data.query.pages[pageId].extract;
      setContent(pageContent);

      setLoading(true);
      try {
        const verifyResponse = await fetch("/admin/test", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: pageContent,
            geonames_data: locations,
          }),
        });
        const verifyData = await verifyResponse.json();
        console.log(verifyData); // Check the structure of verifyData
        setLocations(verifyData.verified_locations);
      } catch (error) {
        console.error("Failed to verify locations:", error);
      }
      setLoading(false);
    } else {
      alert("Please enter a valid 4-digit year.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="Enter a year (e.g., 1519)"
          maxLength={4}
          pattern="\d{4}"
          title="Four digit year, e.g. 1519"
          required
        />
        <button type="submit">Search</button>
      </form>
      <div dangerouslySetInnerHTML={{ __html: content }} />
      <DynamicMap />

      <div>
        <div>
          <h1>Verified Locations</h1>
          <ul>
            {locations &&
              locations.map((location, index) => (
                <li key={index}>{location}</li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
