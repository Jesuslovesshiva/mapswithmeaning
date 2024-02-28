import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Footer from "./footer";
import Image from "next/image";

import SplashScreen from "../components/SplashScreen";

const MultiRangeSlider = dynamic(() =>
  import("../components/multiRangeSlider")
);
const EndGameModal = dynamic(() => import("../components/EndGameModal"));
const DynamicMap = dynamic(() => import("../components/DynamicMap"), {
  ssr: false,
});
const MemoizedEndGameModal = React.memo(EndGameModal);
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
  const [imageLoaded, setImageLoaded] = useState(true);
  const [startPreloading, setStartPreloading] = useState(false);
  const [year, setYear] = useState("");
  const [content, setContent] = useState("");
  const [locations, setLocations] = useState([]);
  const [countryLocations, setCountryLocations] = useState([]);
  const [details, setDetails] = useState({});
  const [showYear, setShowYear] = useState("6");
  const [cities, setCities] = useState([]);
  const [isFilled, setIsFilled] = useState(false);
  const [simulateHoverEffect, setSimulateHoverEffect] = useState(false);
  const [formInitiallySubmitted, setFormInitiallySubmitted] = useState(false);
  const [yearImage, setYearImage] = useState("/defimg.webp");
  const [gameStarted, setGameStarted] = useState(false);
  const [userYear, setUserYear] = useState("");
  const [sliderVisibility, setSliderVisibility] = useState(false);
  const [difference, setDifference] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);
  const [closePopupsTrigger, setClosePopupsTrigger] = useState(0);
  const yearInputRef = useRef(null);
  const [points, setPoints] = useState(0);
  const validUserYear = parseInt(userYear) || 0;
  const validShowYear = parseInt(showYear) || 0;
  const maxPoints = 5000;
  const calculatePoints = (difference) => {
    const pointsDeductedPerYear = 5;
    const points = Math.max(maxPoints - difference * pointsDeductedPerYear, 0);

    return points;
  };
  const fetchAndSetLocations = async (chosenYear) => {
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
      setYear("");
    } catch (error) {}
  };
  const startGame = async () => {
    console.log("Starting game...");
    setGameStarted(true);
    setGameEnded(false);
    setUserYear("");
    setSliderVisibility(false);
    setStartPreloading(true);
    const newYear = Math.floor(Math.random() * (2024 - 1 + 1)) + 1;
    setShowYear(newYear.toString());
    await fetchAndSetLocations(newYear.toString());
    setClosePopupsTrigger((prevCount) => prevCount + 1);
    try {
      const imageData = await fetchYearImage(newYear.toString());
      if (imageData && imageData.image_url !== "No image available") {
        setYearImage(imageData.image_url);
      } else {
        setYearImage("/defimg.webp");
      }
    } catch (error) {
      console.error("Failed to fetch year image:", error);
      setYearImage("/defimg.webp");
    }
    setSimulateHoverEffect(true);
    setTimeout(() => {
      setSimulateHoverEffect(false);
    }, 1000);
  };
  const handleGameWin = () => {
    console.log("Game won");
    setGameStarted(false);
    setGameEnded(true);
    setPoints(maxPoints);
    setUserYear(showYear);
    setClosePopupsTrigger((prevCount) => prevCount + 1);
  };
  const handleGameLoss = (guessedYear) => {
    console.log("Game lost");
    setGameStarted(false);
    setGameEnded(true);
    setClosePopupsTrigger((prevCount) => prevCount + 1);
    const difference = Math.abs(parseInt(showYear, 10) - guessedYear);
    console.log(`Calculated difference: ${difference}`);
    const pointsEarned = calculatePoints(difference);
    console.log(
      `You were off by ${difference} years. This is the valid show year: ${validShowYear} and this is the user's year: ${guessedYear}`
    );
    setDifference(difference);
    console.log(`You got that many points ${pointsEarned} `);
    setPoints(pointsEarned);
    setClosePopupsTrigger((currentCount) => currentCount + 1);
    setSliderVisibility(true);
    setShowYear(showYear);
    setFormInitiallySubmitted(true);
    setSimulateHoverEffect(true);
    setTimeout(() => {
      setSimulateHoverEffect(false);
    }, 1000);
    setYear("");
  };
  const startNextRound = async () => {
    setGameStarted(true);
    setGameEnded(false);
    setUserYear("");
    setYear("");
    setSliderVisibility(false);
    setSimulateHoverEffect(false);
    setClosePopupsTrigger((prevCount) => prevCount + 1);
    const newYear = Math.floor(Math.random() * (2024 - 1 + 1)) + 1;
    setShowYear(newYear.toString());
    await fetchAndSetLocations(newYear.toString());
    setClosePopupsTrigger((prevCount) => prevCount + 1);
    try {
      const imageData = await fetchYearImage(newYear.toString());
      if (imageData && imageData.image_url !== "No image available") {
        setYearImage(imageData.image_url);
      } else {
        setYearImage("/defimg.webp");
      }
    } catch (error) {
      console.error("Failed to fetch year image:", error);
      setYearImage("/defimg.webp");
    }
  };
  const handleDiceClick = async () => {
    setGameStarted(false);
    setSliderVisibility(false);
    setFormInitiallySubmitted(true);
    setClosePopupsTrigger((currentCount) => currentCount + 1);
    const randomYear = Math.floor(Math.random() * (2024 - 1 + 1)) + 1;
    await fetchAndSetLocations(randomYear.toString());
    const imageData = await fetchYearImage(randomYear.toString());
    if (imageData && imageData.image_url !== "No image available") {
      setYearImage(imageData.image_url);
    } else {
      setYearImage("/defimg.webp");
    }
    setShowYear(randomYear.toString());
    setSimulateHoverEffect(true);
    setTimeout(() => {
      setSimulateHoverEffect(false);
    }, 1000);
  };
  const handleSubmit = async (event) => {
    setImageLoaded(false);

    event.preventDefault();
    const inputYear = parseInt(year, 10);
    if (isNaN(inputYear)) {
      alert("Please enter a valid year.");
      return;
    }
    if (yearInputRef.current) yearInputRef.current.blur();
    if (gameStarted) {
      setUserYear(inputYear);
      if (inputYear === parseInt(showYear, 10)) {
        handleGameWin();
      } else {
        setUserYear(inputYear);
        handleGameLoss(inputYear);
        console.log(inputYear);
      }
    } else {
      setSliderVisibility(false);
      setFormInitiallySubmitted(true);
      setIsFilled(false);
      setSimulateHoverEffect(true);
      setClosePopupsTrigger((prevCount) => prevCount + 1);
      setTimeout(() => {
        setSimulateHoverEffect(false);
      }, 1000);
      if (year.trim().length > 0) {
        await fetchAndSetLocations(year);
        const imageData = await fetchYearImage(year);
        if (imageData && imageData.image_url !== "No image available") {
          setYearImage(imageData.image_url);
        } else {
          setYearImage("/defimg.webp");
        }
        setShowYear(year);
        setYear("");
      }
    }
  };
  useEffect(() => {
    setIsFilled(year.trim().length > 0);
  }, [year]);
  const handleChange = (e) => {
    const inputValue = e.target.value;
    setYear(inputValue);
    setIsFilled(inputValue.length > 0);
  };
  useEffect(() => {
    console.log(`Updated difference in HomePage: ${difference}`);
  }, [difference]);

  return (
    <React.StrictMode>
      <SplashScreen />
      <div className="flex flex-col min-h-screen site-container h-screen">
        <div className="content">
          {/* Ensure this container wraps everything */}
          <div className="forfooter mb-8 bg-custom-bg ">
            <div className="">
              <div className="  ">
                <div className="tiimageContainer">
                  <div className="">
                    <div className="flex   item-center yearImageContainer hover09 topimg">
                      <figure className="figureYear">
                        <Image
                          src={yearImage}
                          alt={`Image for the year ${showYear}`}
                          className={`twikiimg ${
                            imageLoaded ? "twikiimg-visible" : ""
                          }`}
                          onLoad={() => setImageLoaded(true)}
                          width={500}
                          height={120}
                        />
                      </figure>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center  z-40">
                  <div className="flex justify-center mainlogo mx-20 my-10 min-w-[400px] max-w-[600px]">
                    <Image
                      src="/logo-no-background.webp"
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
                  <form onSubmit={handleSubmit} className="max-w-md  ">
                    <div className="input relative text-gray-600  align-center ">
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
                text-center border-2 border-gray-400 button-3  ${
                  isFilled ? "button-3" : "button-3"
                }`}
                        onInput={(e) =>
                          (e.target.value = e.target.value.slice(0, 4))
                        }
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
                  <div className=" flex w-screen -mt-10 z-99 mr-5">
                    <div className="flex   w-screen">
                      <div className="row3  justify-evenly w-screen flex  pb-8">
                        <div className="text-gray-500 text-3xl font-bold ml- ">
                          <div
                            className={` ${
                              formInitiallySubmitted
                                ? "opacity-visible"
                                : "opacity-hidden"
                            }`}
                          >
                            <div
                              className={`SMN_effect-64 ${
                                simulateHoverEffect ? "simulated-hover-64" : ""
                              }`}
                            >
                              <a
                                className={`custom-underline ${
                                  gameStarted ? "hide" : ""
                                }`}
                              >
                                Year {showYear}
                              </a>
                            </div>
                          </div>
                        </div>
                        <div
                          className={` playbuttondiv ${
                            gameStarted ? "hidden" : ""
                          }`}
                        >
                          <button
                            onClick={startGame}
                            className=" rounded-lg text-xl on-small-screen play-button1 hover15 text-custom-peach border-2 border-gray-400"
                          >
                            <figure>PLAY</figure>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {}
            <div
              dangerouslySetInnerHTML={{ __html: content }}
              className="text-white "
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
                  <MemoizedEndGameModal
                    key={`endGameModal-${Date.now()}`}
                    onClose={() => setGameEnded(false)}
                    gameEnded={gameEnded}
                    difference={difference}
                    points={points}
                    startNextRound={startNextRound}
                    setSliderVisibility={setSliderVisibility}
                    startPreloading={startPreloading}
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
                        onChange={() => {}}
                        sliderVisibility={sliderVisibility}
                        disabled={true}
                      />
                    </figure>
                  </div>
                </div>
              </div>
              <div className="iiimageContainer">
                <div className="flex justify-center items-center ">
                  <div className="flex item-center yearImageContainer hover09 ">
                    <figure className="figureYear">
                      <Image
                        src={yearImage}
                        alt={`Image for the year ${showYear}`}
                        className={`wikiimg ${
                          imageLoaded ? "wikiimg-visible" : ""
                        }`}
                        onLoad={() => setImageLoaded(true)}
                        width={400}
                        height={500}
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
                  <Image
                    src={yearImage}
                    alt={`Image for the year ${showYear}`}
                    className={`fwikiimg ${
                      imageLoaded ? "fwikiimg-visible" : ""
                    }`}
                    onLoad={() => setImageLoaded(true)}
                    width={500}
                    height={400}
                    loading="lazy"
                  />
                </figure>
              </div>
            </div>
          </div>

          <div className="footer footer-content flex flex-col items-center justify-center text-center mx-4 mt-8">
            <div className="dice2">
              <button
                onSubmit={handleSubmit}
                onClick={handleDiceClick}
                className=" on-small-screen hover15"
                loading="lazy"
              >
                {" "}
                <figure>
                  <Image
                    src="/dice.webp"
                    alt="Roll Dice"
                    width={40}
                    height={40}
                    style={{ objectFit: "contain" }}
                    loading="lazy"
                  />
                </figure>
              </button>
              <div className="divider text-color-bg ">
                <p className="text-gray-300">go to a random Year</p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
        <div className="justify-center items-center flex fixed inset-x--0 w-full text-xs bottom-0 z-[102] bg-custom-bg h-8 ">
          <div className=" text-white text-xs h-full justify-center items-center flex"></div>
          <div className=" footer-bottom text-center ">
            <p className="text-gray-400">
              copyright &copy;{" "}
              <span href="#" className="text-grey-400  text-custom-teal">
                Daniel Leitner
              </span>
              <span className="text-gray-500 text-sm">• | v1.29</span>
            </p>
          </div>
        </div>
      </div>
    </React.StrictMode>
  );
};
export default React.memo(HomePage);
