// // Inside DynamicMap component
// import { useEffect, useState } from "react";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

// const DynamicMap = ({ locations }) => {
//   const [markers, setMarkers] = useState([]);

//   useEffect(() => {
//     const fetchCoordinates = async () => {
//       const coords = await Promise.all(
//         locations.map(async (location) => {
//           const response = await fetch(
//             `https://nominatim.openstreetmap.org/search?format=json&q=${location}`
//           );
//           const data = await response.json();
//           return data[0]
//             ? [parseFloat(data[0].lat), parseFloat(data[0].lon)]
//             : null;
//         })
//       );
//       setMarkers(coords.filter(Boolean));
//     };

//     fetchCoordinates();
//   }, [locations]);

//   return (
//     <MapContainer
//       center={[20, 0]}
//       zoom={2}
//       scrollWheelZoom={false}
//       style={{ height: "500px", width: "100%" }}
//     >
//       <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//       {markers.map((position, idx) => (
//         <Marker key={idx} position={position}>
//           <Popup>{locations[idx]}</Popup>
//         </Marker>
//       ))}
//     </MapContainer>
//   );
// };

// export default DynamicMap;
