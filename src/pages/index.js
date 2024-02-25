// `https://mapswithmeaning.lm.r.appspot.com/yearimage?year=${year}`
// "https://mapswithmeaning.lm.r.appspot.com/",

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Footer from "./footer";
import Image from "next/image";
import MultiRangeSlider from "./multiRangeSlider";
import EndGameModal from "../components/EndGameModal";

// Dynamically import the Leaflet map without SSR
const DynamicMap = dynamic(
  () => import("../components/DynamicMap"), // Adjust the path as needed
  { ssr: false }
);

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
  // const [countdown, setCountdown] = useState(1);
  const [userYear, setUserYear] = useState("");
  // const [intervalId1, setIntervalId1] = useState(null);
  const [sliderVisibility, setSliderVisibility] = useState(false);
  const [difference, setDifference] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);
  const [closePopupsTrigger, setClosePopupsTrigger] = useState(0);
  const yearInputRef = useRef(null);
  const [points, setPoints] = useState(0);

  const validUserYear = parseInt(userYear) || 0; // Defaults to 0 if NaN
  const validShowYear = parseInt(showYear) || 0; // Defaults to 0 if NaN

  const maxPoints = 5000; // Maximum points for a correct guess

  const calculatePoints = (difference) => {
    const pointsDeductedPerYear = 5; // Deduct 5 points for each year of difference, adjust as needed
    const points = Math.max(maxPoints - difference * pointsDeductedPerYear, 0);
    console.log(
      `this is the points after  calculatePoints ${points}, because you got ${maxPoints} - ${difference} *  ${pointsDeductedPerYear} `
    );
    return points;
  };

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
    console.log("Starting game...");
    // Mark this function as 'async'
    setGameStarted(true);
    setGameEnded(false); // Ensure the game is marked as active
    setUserYear("");
    setSliderVisibility(false); // Ensure the slider is hidden when a new game starts
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

    // setCountdown(1); // Reset or start the countdown

    // const interval1 = setInterval(() => {
    //   setCountdown((prevCount) => prevCount + 1);
    // }, 1000);

    // setIntervalId1(interval1); // Store the interval ID for later use
  };

  // useEffect(() => {
  //   return () => {
  //     if (intervalId1) {
  //       clearInterval(intervalId1);
  //     }
  //   };
  // }, [intervalId1]); // Dependency array ensures this runs when intervalId changes

  const handleGameWin = () => {
    console.log("Game won");
    // clearInterval(intervalId1);
    setGameStarted(false); // Mark the game as not started
    setGameEnded(true); // Indicate that the game has ended
    setPoints(maxPoints); // Award full points for a correct guess
    setUserYear(showYear); // Set userYear to the correct year for display

    // Add any additional logic you want to execute when the game is won, such as updating a leaderboard, etc.
  };

  // Update your game logic as needed. Here's an example of handling a game loss:
  const handleGameLoss = (guessedYear) => {
    console.log("Game lost");
    setGameStarted(false); // Mark the game as not started
    setGameEnded(true);

    const difference = Math.abs(parseInt(showYear, 10) - guessedYear);
    console.log(`Calculated difference: ${difference}`); // Add this line
    const pointsEarned = calculatePoints(difference); // Calculate the points based on the difference
    console.log(
      `You were off by ${difference} years. This is the valid show year: ${validShowYear} and this is the user's year: ${guessedYear}`
    );
    setDifference(difference);
    console.log(`You got that many points ${pointsEarned} `);

    setPoints(pointsEarned); // Update the points state

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

    setYear("");
  };

  const startNextRound = () => {
    setGameStarted(true); // Start the new game
    setGameEnded(false); // No longer show the game ended state
    setUserYear(""); // Clear the user's year guess
    setYear(""); // Clear the input field for year
    setSliderVisibility(false); // If you're using a slider, hide it for the new round
    setSimulateHoverEffect(false); // If you use hover effects, reset this
    // Reset countdown if you're using one, and restart it
    // clearInterval(intervalId1); // Clear existing interval
    // const newIntervalId1 = setInterval(() => {
    //   setCountdown((prevCount) => prevCount + 1);
    // }, 1000); // Adjust interval as needed
    // setIntervalId1(newIntervalId1); // Set new interval ID
    // Generate a new year for the game, fetch new locations and image
    const newYear = Math.floor(Math.random() * (2024 - 1 + 1)) + 1; // Adjust range as needed
    setShowYear(newYear.toString());
    fetchAndSetLocations(newYear.toString());
    fetchYearImage(newYear.toString()).then((imageData) => {
      setYearImage(imageData.image_url || "/defimg.jpg"); // Set new year image or default
    });
  };

  // Provide feedback for wrong guess    setYear(""); // Optionally clear the input field after wrong guess
  // Keep the game running, so don't change gameStarted or countdown

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

    // Parse the year from the input
    const inputYear = parseInt(year, 10); // Ensure parsing is done in base 10
    // Check if the input year is a valid number
    if (isNaN(inputYear)) {
      alert("Please enter a valid year.");
      return; // Exit the function if the year is not valid
    }

    // Blur the year input field to hide the keyboard on mobile devices
    if (yearInputRef.current) yearInputRef.current.blur();

    // If the game has started, compare the input year with the actual year
    if (gameStarted) {
      setUserYear(inputYear); // Update the userYear state with the validated input first
      if (inputYear === parseInt(showYear, 10)) {
        // Check if the guess is correct
        handleGameWin(); // Call the game win function
      } else {
        setUserYear(inputYear); // Update the userYear state with the validated input
        handleGameLoss(inputYear); // Call the game loss function if the guess is wrong
        console.log(inputYear);
      }
    } else {
      // Game logic when the game is not active
      setSliderVisibility(false); // Hide the slider when the game is not active
      setFormInitiallySubmitted(true); // Indicate that the form has been initially submitted
      setIsFilled(false); // Reset the filled state
      setSimulateHoverEffect(true); // Trigger the simulated hover effect
      setClosePopupsTrigger((prevCount) => prevCount + 1); // Increment the trigger to close popups

      // Delay to remove the simulated hover effect
      setTimeout(() => {
        setSimulateHoverEffect(false);
      }, 1000);

      // If the year input field contains a valid year, proceed to fetch and set location data
      if (year.trim().length > 0) {
        await fetchAndSetLocations(year); // Fetch and set location data for the year
        const imageData = await fetchYearImage(year); // Fetch the image data for the year
        setYearImage(imageData.image_url || "/defimg.jpg"); // Update the state with the new image URL or default
        setShowYear(year); // Update the displayed year
        setYear(""); // Clear the input field after submission
      }
    }
  };

  useEffect(() => {
    setIsFilled(year.trim().length > 0);
  }, [year]); // This useEffect will update isFilled whenever 'year' changes

  const handleChange = (e) => {
    const inputValue = e.target.value;
    setYear(inputValue); // This keeps the original logic intact
    setIsFilled(inputValue.length > 0); // Additionally sets isFilled based on whether the input has content
  };

  useEffect(() => {
    console.log(`Updated difference in HomePage: ${difference}`);
  }, [difference]);

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
            <div className="countdown text-gray-500 text-3xl font-bold pl-6 on-small-screen flex mx-5 ml-auto">
              <div>
                <a className="countdown custom-underline ml-auto"></a>
              </div>
            </div>
            <div className="text-gray-500 text-3xl font-bold  flex on-small-screen">
              <div
                className={` mr-5 pl-6 ${
                  formInitiallySubmitted ? "opacity-visible" : "opacity-hidden"
                }`}
              >
                <div
                  className={`SMN_effect-64 ${
                    simulateHoverEffect ? "simulated-hover-64" : ""
                  }`}
                >
                  <a
                    className={`custom-underline ${gameStarted ? "hide" : ""}`}
                  >
                    Year {showYear}
                  </a>
                </div>
              </div>
              {/* <div
                className={` text-md mr-2 pl-1 on-small-screen 2${
                  formInitiallySubmitted
                    ? "opacity-hidden2"
                    : "opacity-visible2"
                }`}
              >
                <div
                  className={`SMN_effect-64 ${
                    simulateHoverEffect ? "simulated-hover-64" : ""
                  }`}
                >
                  <a
                    className={`custom-underline ${gameStarted ? "hide" : ""}`}
                  >
                    Maps with meaning
                  </a>
                </div>
              </div> */}
            </div>
            <form
              onSubmit={handleSubmit}
              className="max-w-md menu align-center"
            >
              <div className="input relative text-gray-600 menu align-center">
                <input
                  ref={yearInputRef}
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
                  className={`inputClass h-10 pl-5 pr-5 w-full rounded-lg text-sm focus:outline-none border-2px
                text-center border-2 border-gray-400 button-3 ${
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
                className=" rounded-lg text-xl on-small-screen play-button hover15 text-custom-peach border-2 border-gray-400"
              >
                <figure>PLAY</figure>
              </button>
            </div>
            <div
              className={`countdown ml-auto mr-3 ${gameStarted ? "show" : ""}`}
            >
              {/* {countdown} */}
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
          {gameEnded && (
            <div
              className="endGameModalContainer"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 999,
              }}
            >
              <EndGameModal
                key={`endGameModal-${Date.now()}`} // This forces React to remount the component
                onClose={() => setGameEnded(false)}
                gameEnded={gameEnded}
                difference={difference}
                points={points}
                startNextRound={startNextRound} // Ensure you have this function defined or adapt as needed
              />
            </div>
          )}
          {typeof window !== "undefined" && (
            <DynamicMap
              closePopupsTrigger={closePopupsTrigger}
              countries={countryLocations}
              cities={cities}
              details={details}
            />
          )}

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
          <div className="divider text-color-bg">
            <p className="text-gray-300">go to a random Year</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
