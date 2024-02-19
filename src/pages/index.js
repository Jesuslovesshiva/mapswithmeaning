import React, { useState } from "react";
import dynamic from "next/dynamic";
import Footer from "./footer";
import Image from "next/image";

const DynamicMap = dynamic(() => import("/src/pages/DynamicMap"), {
  ssr: false,
});

const HomePage = () => {
  const [year, setYear] = useState("");
  const [content, setContent] = useState("");
  const [locations, setLocations] = useState([]);
  const [countryLocations, setCountryLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({});
  const [showYear, setShowYear] = useState("");
  const [showLoadingBar, setShowLoadingBar] = useState(false);
  const [cities, setCities] = useState([]); // Added state for cities

  const fetchAndSetLocations = async (chosenYear) => {
    setLoading(true);
    setShowLoadingBar(true);
    try {
      const response = await fetch("https://mapswithmeaning.lm.r.appspot.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year: chosenYear.trim() }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setLocations(data.cities);
      setCities(data.cities);
      setCountryLocations(data.countries);
      setDetails(data.details);
      setShowYear(chosenYear);
      setYear(""); // This line clears the input field
    } catch (error) {
      // console.error("Failed to verify locations:", error);
    }

    setLoading(false);
    setShowLoadingBar(false); // Hide loading bar when API call ends
  };

  // Function to handle dice click
  const handleDiceClick = () => {
    const randomYear = Math.floor(Math.random() * (2024 - 1 + 1)) + 1; // Generate a random year between 1 and 2024
    fetchAndSetLocations(randomYear.toString()); // Fetch and set locations for the random year
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    fetchAndSetLocations(year); // Use the existing year state
  };

  return (
    <div>
      <div className="flex flex-col mb-12 bg-custom-teal">
        <div className="flex flex-col items-center">
          <div className="w-64 h-62 flex justify-center items-center">
            <Image
              src="/png/logo-no-background.png"
              alt="Logo"
              width={240}
              height={248}
              style={{ objectFit: "cover" }}
              className="m-10"
              priority={false}
            />
          </div>
        </div>

        <div className="w-full flex justify-between items-center px-8 pb-8">
          {/* Display showYear directly */}
          <div className="text-gray-500 text-3xl font-bold pl-10 on-small-screen flex items-center">
            <div className="inline hide-on-small-screen mr-2">Year </div>{" "}
            {showYear}
          </div>

          <form onSubmit={handleSubmit} className="max-w-md">
            <div className="input relative text-gray-600">
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="Enter a year (e.g., 1519)"
                style={{ fontFamily: "arial" }}
                maxLength="4"
                min="1"
                max="2024"
                title=""
                required
                className="h-10 pl-5 pr-10 w-full rounded-full text-sm focus:outline-none border border-gray-100 bg-grey-300"
                onInput={(e) => (e.target.value = e.target.value.slice(0, 4))} // Restricts input to 4 digits
              />
              <button
                type="submit"
                className="absolute right-1 top-1 mt-2 mr-3"
              >
                <svg
                  className="h-4 w-4 fill-current"
                  viewBox="0 0 56.966 56.966"
                >
                  <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
                </svg>
              </button>
            </div>
          </form>
          <button
            onClick={handleDiceClick}
            className="p-2 pr-10 on-small-screen"
          >
            <Image
              src="/dice.png"
              alt="Roll Dice"
              width={40}
              height={40}
              style={{ objectFit: "contain" }}
            />
          </button>
        </div>

        {showLoadingBar && <span className="_it4vx _72fik"></span>}

        <div
          dangerouslySetInnerHTML={{ __html: content }}
          className="text-white"
        />
        <DynamicMap
          countries={countryLocations}
          cities={cities}
          details={details}
        />
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
