// `https://mapswithmeaning.lm.r.appspot.com/yearimage?year=${year}`
// "https://mapswithmeaning.lm.r.appspot.com/",

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Footer from "./footer";
import Image from "next/image";
import MultiRangeSlider from "./multiRangeSlider";

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
  const [details, setDetails] = useState({});
  const [showYear, setShowYear] = useState("");
  const [cities, setCities] = useState([]);
  const [isFilled, setIsFilled] = useState(false);
  const [simulateHoverEffect, setSimulateHoverEffect] = useState(false);
  const [formInitiallySubmitted, setFormInitiallySubmitted] = useState(false);
  const [yearImage, setYearImage] = useState("/defimg.jpg");
  const [gameStarted, setGameStarted] = useState(false);
  const [countdown, setCountdown] = useState(1);
  const [userYear, setUserYear] = useState("");
  const [intervalId, setIntervalId] = useState(null);
  const [sliderVisibility, setSliderVisibility] = useState(false);
  const [difference, setDifference] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);
  const [closePopupsTrigger, setClosePopupsTrigger] = useState(0);

  const validUserYear = parseInt(userYear) || 0; // Defaults to 0 if NaN
  const validShowYear = parseInt(showYear) || 0; // Defaults to 0 if NaN

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

  const startGame = async () => {
    // Mark this function as 'async'
    setGameStarted(true);
    setSliderVisibility(false); // Ensure the slider is hidden when a new game starts
    setCountdown(1); // Reset or start the countdown
    const newYear = Math.floor(Math.random() * (2024 - 1 + 1)) + 1;
    setShowYear(newYear.toString()); // Optionally select a new year when game starts

    await fetchAndSetLocations(newYear.toString()); // Correct use of 'await' within an 'async' function

    // Fetch and set the year image asynchronously
    try {
      const imageData = await fetchYearImage(newYear.toString());
      if (imageData && imageData.image_url !== "No image available") {
        setYearImage(imageData.image_url);
      } else {
        setYearImage("/defimg.jpg"); // Default image if none is available or on error
      }
    } catch (error) {
      console.error("Failed to fetch year image:", error);
      setYearImage("/defimg.jpg"); // Default image on catch
    }

    setSimulateHoverEffect(true); // Trigger the simulated hover effect
    setTimeout(() => {
      setSimulateHoverEffect(false); // Remove the simulated hover effect after a delay
    }, 1000); // Adjust the duration according to your needs

    // Start the countdown
    const interval = setInterval(() => {
      setCountdown((prevCount) => prevCount + 1);
    }, 1000);

    setIntervalId(interval); // Store the interval ID for later use
  };

  // Update your game logic as needed. Here's an example of handling a game loss:
  const handleGameLoss = () => {
    setGameStarted(false); // Mark the game as not started
    setGameEnded(true);

    setClosePopupsTrigger((currentCount) => currentCount + 1);

    setSliderVisibility(true); // Make the slider visible
    setShowYear(showYear); // Update the displayed year
    setFormInitiallySubmitted(true); // Set the opacity controlling state to true

    // Normal year submission logic when the game is not active
    // setFormInitiallySubmitted(true); // Set the opacity controlling state to true
    setSimulateHoverEffect(true); // Trigger the simulated hover effect

    setTimeout(() => {
      setSimulateHoverEffect(false); // Remove the simulated hover effect after a delay
    }, 1000); // Adjust the duration according to your needs

    // Calculate the absolute difference between the two years
    // Calculate the difference
    // Assuming validShowYear and validUserYear have been set correctly

    const difference = Math.abs(validShowYear - validUserYear); // This calculates the absolute difference

    // Then you can alert the user
    // alert(`You were off by ${difference} years.`);

    setYear(""); // Clear the input field after submission
    // console.log(
    //   `You were off by ${difference} years. this is the validshowyear ${validShowYear} and this is the validUserYear ${validUserYear} `
    // );
  };
  // Provide feedback for wrong guess    setYear(""); // Optionally clear the input field after wrong guess
  // Keep the game running, so don't change gameStarted or countdown

  // useEffect(() => {
  //   // Return a cleanup function from useEffect
  //   return () => {
  //     clearInterval(interval); // Clear the interval to prevent memory leaks
  //   };
  // }, []); // Empty dependency array means this runs once on mount and once on unmount

  // Function to handle dice click
  const handleDiceClick = async () => {
    setGameStarted(false);
    setSliderVisibility(false); // Ensure the slider is hidden when a new game starts
    // Make this function async
    setFormInitiallySubmitted(true); // Set the opacity controlling state to true
    setClosePopupsTrigger((currentCount) => currentCount + 1);

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

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    // Check if the game has started

    const inputYear = parseInt(year);
    const gameYear = parseInt(showYear); // Ensure this is also a valid number

    if (gameStarted) {
      if (inputYear === gameYear) {
        // Check the guess
        clearInterval(intervalId); // Use the intervalId from state
        setGameStarted(false); // End the game
        alert("That is Correct! The game has ended."); // Provide feedback
        setYear(""); // Clear the input field after successful guess
        // Optionally reset other game states here
      } else {
        setUserYear(inputYear.toString()); // Update the userYear state with the validated input
        handleGameLoss(); // Call the game loss function
      }
    } else {
      setSliderVisibility(false); // Ensure the slider is hidden when a new game starts
      // Normal year submission logic when the game is not active
      setFormInitiallySubmitted(true); // Set the opacity controlling state to true
      setIsFilled(false); // Reset the filled state
      setSimulateHoverEffect(true); // Trigger the simulated hover effect
      setClosePopupsTrigger((currentCount) => currentCount + 1);

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
        const newUserYear = parseInt(event.target.value); // Or however you obtain the new year value
        setUserYear(newUserYear); // Update the state
        setYear(""); // Clear the input field after submission
      }
    }
  };

  useEffect(() => {
    setIsFilled(year.trim().length > 0);
  }, [year]); // This useEffect will update isFilled whenever 'year' changes

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]); // Dependency array ensures this runs when intervalId changes

  const handleChange = (e) => {
    const inputValue = e.target.value;
    setYear(inputValue); // This keeps the original logic intact
    setIsFilled(inputValue.length > 0); // Additionally sets isFilled based on whether the input has content
  };

  return (
    <div>
      <div className="forfooter flex flex-col mb-8 bg-custom-bg ">
        <div className="flex flex-col items-center ">
          <div className="flex justify-center items-center ">
            <div className="tiimageContainer">
              <div className="flex justify-center items-center ">
                <div className="flex   item-center yearImageContainer hover09 topimg">
                  <figure className="figureYear ">
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
        <div className="on-small-screen">
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
                <a className={`custom-underline ${gameStarted ? "hide" : ""}`}>
                  Year {showYear}
                </a>
              </div>
            </div>
            <div className="countdown text-gray-500 text-3xl font-bold pl-6 on-small-screen flex mx-5 ml-auto">
              <div>
                <a className="countdown custom-underline ml-auto">1</a>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="max-w-md menu align-center"
            >
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
                  className={`inputClass h-10 pl-5 pr-10 w-full rounded-lg text-sm focus:outline-none border-2px
                text-center  border-gray-100 bg-grey-300 button-3 ${
                  isFilled ? "button-3" : "button-3"
                }`} // Apply conditional class for  effects
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
            <div className={`playbuttondiv ${gameStarted ? "hidden" : ""}`}>
              <button
                onClick={startGame}
                className=" rounded-lg text-xl on-small-screen play-button hover15 text-custom-peach border-2"
              >
                <figure>PLAY</figure>
              </button>
            </div>
            <div
              className={`countdown ml-auto mr-3 ${gameStarted ? "show" : ""}`}
            >
              {countdown}
            </div>
            <div className="dice">
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
            closePopupsTrigger={closePopupsTrigger}
            countries={countryLocations}
            cities={cities}
            details={details}
          />
          <div
            className={`slider-imageContainer slidercontainer ${
              sliderVisibility ? "" : "hide"
            }`}
          >
            <div className="flex justify-center items-center">
              <div className="flex item-center  ">
                <figure className="figureYear">
                  <MultiRangeSlider
                    min={validUserYear}
                    max={validShowYear}
                    onChange={() => {}} // No-op function since we don't want changes
                    disabled={true} // This should make the slider read-only; adjust based on your actual slider component
                  />
                </figure>
              </div>
            </div>
          </div>
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
        <div className="divider text-color-bg">
          <p className="text-gray-300">go to a random Year</p>
        </div>
        <div className="footer-content flex flex-col items-center justify-center text-center mx-4">
          <div className="dice2">
            <button
              onSubmit={handleSubmit}
              onClick={handleDiceClick}
              className=" on-small-screen hover15"
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
      </div>

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
