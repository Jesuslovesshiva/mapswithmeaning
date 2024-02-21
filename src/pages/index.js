// `https://mapswithmeaning.lm.r.appspot.com/yearimage?year=${year}`
// "https://mapswithmeaning.lm.r.appspot.com/",

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Footer from "./footer";
import Image from "next/image";

const DynamicMap = dynamic(() => import("/src/pages/DynamicMap"), {
  ssr: false,
});

async function fetchYearImage(year) {
  const response = await fetch(
    `https://mapswithmeaning.lm.r.appspot.com/yearimage?year=${year}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data;
}

const HomePage = () => {
  const [year, setYear] = useState("");
  const [content, setContent] = useState("");
  const [locations, setLocations] = useState([]);
  const [countryLocations, setCountryLocations] = useState([]);
  // const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({});
  const [showYear, setShowYear] = useState("");
  // const [showLoadingBar, setShowLoadingBar] = useState(false);
  const [cities, setCities] = useState([]);
  const [isFilled, setIsFilled] = useState(false);
  const [simulateHoverEffect, setSimulateHoverEffect] = useState(false); // New state for simulating hover effect
  const [formInitiallySubmitted, setFormInitiallySubmitted] = useState(false);
  const [yearImage, setYearImage] = useState("/defimg.jpg");

  const fetchAndSetLocations = async (chosenYear) => {
    // setLoading(true);
    // setShowLoadingBar(true);
    try {
      const response = await fetch(
        "https://mapswithmeaning.lm.r.appspot.com",

        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ year: chosenYear.trim() }),
        }
      );
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

    // setLoading(false);
    // setShowLoadingBar(false); // Hide loading bar when API call ends
  };

  // Function to handle dice click
  const handleDiceClick = async () => {
    // Make this function async
    setFormInitiallySubmitted(true); // Set the opacity controlling state to true

    const randomYear = Math.floor(Math.random() * (2024 - 1 + 1)) + 1; // Generate a random year between 1 and 2024
    await fetchAndSetLocations(randomYear.toString()); // Fetch and set locations for the random year
    const imageData = await fetchYearImage(randomYear.toString()); // Fetch the image data for the random year
    if (imageData && imageData.image_url !== "No image available") {
      setYearImage(imageData.image_url); // Update the state with the new image URL
    } else {
      setYearImage("/defimg.jpg"); // Reset the image URL if none is available
    }
    setShowYear(randomYear.toString()); // Update the displayed year

    setSimulateHoverEffect(true); // Trigger the simulated hover effect
    setTimeout(() => {
      setSimulateHoverEffect(false); // Remove the simulated hover effect after a delay
    }, 1000); // Adjust the duration according to your needs
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormInitiallySubmitted(true); // Set the opacity controlling state to true
    setIsFilled(false); // Reset the filled state
    setSimulateHoverEffect(true); // Trigger the simulated hover effect

    setTimeout(() => {
      setSimulateHoverEffect(false); // Remove the simulated hover effect after a delay
    }, 1000); // Adjust the duration according to your needs

    if (year.trim().length > 0) {
      await fetchAndSetLocations(year); // Fetch and set location data for the year
      const imageData = await fetchYearImage(year); // Fetch the image data for the year
      if (imageData && imageData.image_url !== "No image available") {
        setYearImage(imageData.image_url); // Update the state with the new image URL
      } else {
        setYearImage("/defimg.jpg"); // Reset the image URL if none is available
      }
      setShowYear(year); // Update the displayed year
      setYear(""); // Clear the input field after submission
    }
  };

  // useEffect(() => {
  //   setIsFilled(year.trim().length > 0);
  // }, [year]); // This useEffect will update isFilled whenever 'year' changes
  const handleChange = (e) => {
    const inputValue = e.target.value;
    setYear(inputValue); // This keeps the original logic intact
    setIsFilled(inputValue.length > 0); // Additionally sets isFilled based on whether the input has content
  };

  return (
    <div>
      <div className="forfooter flex flex-col mb-8 bg-custom-bg">
        <div className="flex flex-col items-center">
          <div className="flex justify-center items-center">
            <div className="tiimageContainer">
              <div className="flex justify-center items-center ">
                <div className="flex item-center yearImageContainer hover09 ">
                  <figure className="figureYear">
                    <img
                      src={yearImage}
                      alt={`Image for the year ${showYear}`}
                      style={{ width: "500px", height: "120px" }} // Adjust as needed
                      className="twikiimg"
                    />
                  </figure>
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center mainlogo mx-20 my-10 min-w-[400px] max-w-[600px]">
              <Image
                src="/png/logo-no-background.png"
                alt="Logo"
                sizes="41vw"
                className="mainlogo"
                style={{
                  width: "41%",
                  height: "auto",
                }}
                width={150}
                height={150}
              />
            </div>
          </div>
        </div>

        <div className="row3 w-full flex justify-between items-center px-8 pb-8">
          <div
            className={`text-gray-500 text-3xl font-bold pl-6 on-small-screen flex  ${
              formInitiallySubmitted ? "opacity-visible" : "opacity-hidden"
            }`}
          >
            <div
              className={`SMN_effect-64 ${
                simulateHoverEffect ? "simulated-hover-64" : ""
              }`}
            >
              <a className="custom-underline">Year {showYear}</a>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="max-w-md menu align-center">
            <div className="input relative text-gray-600 menu align-center">
              <input
                type="number"
                value={year}
                onChange={handleChange}
                placeholder="Enter a year (e.g., 1519)"
                style={{ fontFamily: "arial" }}
                maxLength="4"
                min="1"
                max="2024"
                title=""
                required
                className={`inputClass h-10 pl-5 pr-10 w-full rounded-lg text-sm focus:outline-none border
                text-center  border-gray-100 bg-grey-300 button-3 ${
                  isFilled ? "button-3" : "button-3"
                }`} // Apply conditional class for hover effects
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
          <div className="">
            <button
              onSubmit={handleSubmit}
              onClick={handleDiceClick}
              className="p-2 pr-10 on-small-screen hover15"
            >
              {" "}
              <figure>
                <Image
                  src="/dice.png"
                  alt="Roll Dice"
                  width={40}
                  height={40}
                  style={{ objectFit: "contain" }}
                />
              </figure>
            </button>
          </div>
        </div>

        {/* {showLoadingBar && <span className="_it4vx _72fik"></span>} */}

        <div
          dangerouslySetInnerHTML={{ __html: content }}
          className="text-white"
        />

        <div
          className="mapWithImageContainer"
          style={{ position: "relative", width: "100%", height: "500px" }}
        >
          {" "}
          {/* Adjust height as needed */}
          <DynamicMap
            countries={countryLocations}
            cities={cities}
            details={details}
          />
          <div className="iiimageContainer">
            <div className="flex justify-center items-center ">
              <div className="flex item-center yearImageContainer hover09 ">
                <figure className="figureYear">
                  <img
                    src={yearImage}
                    alt={`Image for the year ${showYear}`}
                    style={{ width: "400px", height: "500px" }} // Adjust as needed
                    className="wikiimg"
                  />
                </figure>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* {yearImage && (
        <div className="flex flex-col items-center">
          <div className="flex justify-center items-center">
            <div className="flex m-2 item-center yearImageContainer hover09">
              <figure>
                <img
                  src={yearImage}
                  alt={`Image for the year ${showYear}`}
                  style={{ width: "400px", height: "200px" }} // Adjust as needed
                />
              </figure>
            </div>
          </div>{" "}
        </div>
      )} */}
      <div className="fiimageContainer">
        <div className="flex justify-center items-center ">
          <div className="flex item-center yearImageContainer hover09 ">
            <figure className="figureYear">
              <img
                src={yearImage}
                alt={`Image for the year ${showYear}`}
                style={{ width: "500px", height: "400px" }} // Adjust as needed
                className="fwikiimg"
              />
            </figure>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
