// components/DynamicMap.js
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const DynamicMap = () => (
  <MapContainer
    center={[20, 0]}
    zoom={2}
    scrollWheelZoom={false}
    style={{ height: "500px", width: "100%" }}
  >
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    />
    {/* Markers will go here */}
  </MapContainer>
);

export default DynamicMap;
