import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import Footer from "./footer";

const DynamicMap = dynamic(() => import("/src/pages/DynamicMap"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const HomePage = () => {
  useEffect(() => {
    const L = require("leaflet");
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "/marker-icon-2x.png",
      iconUrl: "/marker-icon.png",
      shadowUrl: "/marker-shadow.png",
    });
  }, []);
  const [year, setYear] = useState("");
  const [content, setContent] = useState("");
  const [locations, setLocations] = useState([]);
  const [countryLocations, setCountryLocations] = useState([]); // Add this line
  const [loading, setLoading] = useState(false); // Define the loading state here
  const [details, setDetails] = useState({}); //!

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    // Send only the year to your Flask backend
    try {
      const verifyResponse = await fetch("http://localhost:5000/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year: year.trim() }), // send the year
      });

      if (!verifyResponse.ok) {
        throw new Error(`HTTP error! status: ${verifyResponse.status}`);
      }

      const verifyData = await verifyResponse.json();
      console.log(verifyData);
      setLocations(verifyData.cities); // Assuming 'cities' is the key in the response
      setCountryLocations(verifyData.countries);
      setDetails(verifyData.details); //!
    } catch (error) {
      console.error("Failed to verify locations:", error);
    }

    setLoading(false);
  };

  // // This is a simple in-memory cache.
  // const geocodeCache = {};

  // const geocodeLocation = async (location) => {
  //   if (geocodeCache[location]) {
  //     return geocodeCache[location];
  //   }

  //   const response = await fetch(
  //     `/geocode?location=${encodeURIComponent(location)}`
  //   );
  //   const data = await response.json();
  //   if (data[0]) {
  //     const coords = {
  //       lat: parseFloat(data[0].lat),
  //       lon: parseFloat(data[0].lon),
  //     };
  //     geocodeCache[location] = coords; // Save to cache
  //     return coords;
  //   }
  //   // memory cache end

  //   return null;
  // };

  return (
    <div>
      <div className="flex flex-col items-center  min-h-screen bg-gray-700">
        <div className="w-64 h-62 flex justify-center items-center">
          <img
            src="/png/logo-no-background.png"
            alt="Logo"
            className="object-contain max-w-full max-h-full overflow-hidden m-10"
          />
        </div>
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="relative text-gray-600">
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Enter a year (e.g., 1519)"
              maxLength="4"
              pattern="\d{4}"
              title="Four digit year, e.g. 1519"
              required
              className="h-10 pl-5 pr-10 w-full rounded-full text-sm focus:outline-none border border-gray-100 bg-grey-300 mb-10"
            />
            <button type="submit" className="absolute right-1 top-1 mt-2 mr-3">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 56.966 56.966">
                <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
              </svg>
            </button>
          </div>
        </form>
        {loading && <p className="text-white">Loading...</p>}
        <div
          dangerouslySetInnerHTML={{ __html: content }}
          className="text-white"
        />
        {/* <DynamicMap locations={locations} /> activate, when using cities */}
        <DynamicMap countries={countryLocations} details={details} />
        {/* /* <h1>Verified Locations</h1>
      <ul>
        {locations.map((location, index) => (
          <li key={index}>{location}</li>
        ))}
      </ul> */}
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
