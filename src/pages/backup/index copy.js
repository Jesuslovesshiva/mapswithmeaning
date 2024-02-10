import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Dynamically import the DynamicMap component, disabling SSR
const DynamicMap = dynamic(() => import("/src/pages/DynamicMap"), {
  ssr: false,
});

const HomePage = () => {
  const [year, setYear] = useState("");
  const [content, setContent] = useState("");
  const [locations, setLocations] = useState({ countries: [], cities: [] });

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

      // The API returns a pages object with pageid as a key, grab the first one
      const pageId = Object.keys(data.query.pages)[0];
      const pageContent = data.query.pages[pageId].extract;

      setContent(pageContent);
    } else {
      // Handle error, show message or indication that the input is not a valid year
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
        {/* Render your UI here, using the locations data */}
        <h1>Locations</h1>
        <div>
          <h2>Countries</h2>
          {(locations.countries || []).map((country, index) => (
            <div key={index}>{country.name}</div>
          ))}
          {/* Similarly for cities, if included */}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
