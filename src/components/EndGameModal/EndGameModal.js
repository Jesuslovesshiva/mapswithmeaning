import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

const EndGameModal = ({
  onClose,
  gameEnded,
  difference,
  points,
  startNextRound,
  setSliderVisibility,
  startPreloading,
}) => {
  const [isClosed, setIsClosed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false); // New state for image loading

  useEffect(() => {
    if (startPreloading) {
      // Logic here if need to do something when preloading starts

      setImageLoaded(true); // Pretend the image is ready; adjust based on actual logic
    }
  }, [startPreloading]);

  const handleClose = () => {
    setIsClosed(true); // This will trigger the fade-out effect
    setTimeout(() => {
      onClose(); // This will close the modal
      setSliderVisibility(false); // This will hide the slider
    }, 220); // Adjust timeout to match your CSS transitions
  };

  const mapRef = useRef(null);
  useEffect(() => {
    // Ensure the map is loaded
    if (mapRef.current) {
      const handleMapClick = () => {
        setIsClosed(true); // Triggers the popup to start closing
        setTimeout(onClose, 500); // Adjust based on your transition
      };

      // Add click event listener
      mapRef.current.addEventListener("click", handleMapClick);

      // Cleanup function to remove event listener
      return () => {
        if (mapRef.current) {
          mapRef.current.removeEventListener("click", handleMapClick);
        }
      };
    }
  }, [mapRef, onClose]); // Depend on mapRef and onClose to avoid adding listeners multiple times

  return (
    <div
      className={`popup1 ${gameEnded && !isClosed ? "show" : "hide"}`}
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 2,
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <span className="material-symbols-outlined mb-5 border-r">
        <Image
          src="/cacao1.webp"
          alt="Cacao"
          width={85}
          height={85}
          className="rounded-full"
          onLoad={() => {
            console.log("Image has completed loading");
            setImageLoaded(true);
          }}
        />
      </span>

      <button className="popup-close-button" onClick={handleClose}>
        ×
      </button>
      <p className="guess text-gray-200 text-xl">
        Your guess was <strong>{difference}</strong> years off
      </p>
      <p className="points text-gray-200 text-lg">
        Your points: <strong className="text--custom-teal">{points}</strong>
      </p>

      <button
        className="nextround  rounded-lg text-xl on-small-screen play-button hover15 text-custom-peach border-2 border-gray-400"
        onClick={startNextRound}
      >
        NEXT ROUND
      </button>
    </div>
  );
};

export default React.memo(EndGameModal);
