import React, { useEffect } from "react";
import { useMap } from "react-leaflet";

const ClosePopups = ({ closePopupsTrigger }) => {
  const map = useMap(); // This hook provides the map instance

  useEffect(() => {
    // Close all popups when closePopupsTrigger changes
    if (closePopupsTrigger) {
      map.closePopup();
    }
  }, [closePopupsTrigger, map]); // Depend on closePopupsTrigger and map instance

  return null; // This component does not render anything
};

export default ClosePopups;
