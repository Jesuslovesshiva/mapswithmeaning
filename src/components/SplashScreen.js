// components/SplashScreen.js

import React, { useEffect, useState } from "react";

const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Disable scrolling on the body
    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => {
      setIsVisible(false);
      // Re-enable scrolling when the splash screen is hidden
      document.body.style.overflow = "auto";
    }, 100); // Adjust the time as needed

    return () => {
      clearTimeout(timer);
      // Make sure to re-enable scrolling if the component unmounts before the timer is up
      document.body.style.overflow = "auto";
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-white flex justify-center items-center z-[103]">
      {" "}
      {/* Increase z-index if necessary */}
      {/* <img src="./warrior1.png" alt="Loading..." />{" "} */}
      {/* Adjust image size as needed */}
    </div>
  );
};

export default SplashScreen;
