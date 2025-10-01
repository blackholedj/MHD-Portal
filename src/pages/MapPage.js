// src/pages/MapPage.js
import React from "react";
import { stops } from "../data/stops";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
//import { FaLocationDot } from "react-icons/fa6";

// Ukázková data zastávek. V reálné aplikaci by se načítala z databáze nebo API.
// const stops = [
//   {
//     id: 1,
//     name: "Náměstí Míru",
//     position: [50.075, 14.435],
//     lines: ["A", "10", "16"],
//   },
//   {
//     id: 2,
//     name: "I.P. Pavlova",
//     position: [50.073, 14.429],
//     lines: ["C", "4", "22"],
//   },
//   {
//     id: 3,
//     name: "Karlovo náměstí",
//     position: [50.076, 14.418],
//     lines: ["B", "3", "18", "24"],
//   },
// ];

const busStopIcon = new L.Icon({
  iconUrl: "location-dot.png",
  iconSize: [25, 25],
});

const MapPage = () => {
  const defaultPosition = [50.501187, 13.639245]; // Centrum Mostu jako výchozí bod

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Mapa linek a zastávek</h1>
      <div className="h-[600px] w-full bg-white rounded-lg shadow-md">
        <MapContainer
          center={defaultPosition}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="     https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=05f34cca3a664e4e9b9137da6f639778"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Zde by probíhal map přes data zastávek */}
          {Object.values(stops).map((stop) => (
            <Marker key={stop.id} position={stop.coords} icon={busStopIcon}>
              <Popup>
                <b>{stop.name}</b>
                <br />
                {/* Linky: {stop.lines.join(", ")} */}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapPage;
