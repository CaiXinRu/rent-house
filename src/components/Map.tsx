import { icon, LatLngLiteral } from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  ZoomControl,
} from "react-leaflet";
// import schoolData from "@/lib/json/schools.json";

type MapLocation = { id: string } & { name: string } & {
  site: string;
} & LatLngLiteral;

type MapProps = {
  // center: LatLngLiteral;
  locations: MapLocation[];
};

const SelectedLocation = ({
  zoomLevel = 20,
  center,
}: {
  zoomLevel?: number;
  center: LatLngLiteral;
}) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    map.panTo(center, { animate: true });

    setTimeout(() => {
      map.setZoom(zoomLevel);
    }, 300);
  }, [center, zoomLevel, map]);

  return null;
};

export const Map: React.FC<MapProps> = ({ locations }) => {
  const [selectedLocation, setSelectedLocation] = useState<
    MapLocation | undefined
  >();
  const [userLocation, setUserLocation] = useState<LatLngLiteral | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<LatLngLiteral | null>(
    null
  );

  const mapMarkIcon = icon({
    iconUrl: "map-marker.png",
    iconSize: [47, 55],
  });
  const mapMarkActiveIcon = icon({
    iconUrl: "active-map-marker.png",
    iconSize: [57, 64],
  });
  const userIcon = icon({
    iconUrl: "user-location.png",
    iconSize: [45, 45],
  });
  const mapSearchIcon = icon({
    iconUrl: "search-location.png",
    iconSize: [57, 64],
  });

  const renderMarks = () => {
    return locations.map((location) => (
      <div key={location.id}>
        <Marker
          icon={
            location.id === selectedLocation?.id
              ? mapMarkActiveIcon
              : mapMarkIcon
          }
          position={{ lat: location.lat, lng: location.lng }}
          eventHandlers={{
            click: () => {
              setSelectedLocation(location);
            },
          }}
        />
      </div>
    ));
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}`
      );
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        setSearchResults({ lat: parseFloat(lat), lng: parseFloat(lon) });
      } else {
        alert("找不到該位置，請嘗試其他名稱");
      }
    } catch (error) {
      console.error("搜尋發生錯誤:", error);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.log("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const defaultCenter: LatLngLiteral = { lat: 23.5, lng: 120 };

  return (
    <div className="w-full h-screen relative overflow-hidden">
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg p-2 z-[999] flex gap-2">
        <input
          type="text"
          className="border border-gray-300 rounded p-2 w-72 text-slate-400"
          placeholder="輸入地名或地址"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleSearch}
        >
          搜尋
        </button>
        {selectedLocation && (
          <div className="bg-blue-500 w-full">{selectedLocation.name}</div>
        )}
      </div>

      <MapContainer
        key={userLocation ? "user" : "default"}
        center={userLocation || defaultCenter}
        zoom={userLocation ? 15 : 7}
        minZoom={5}
        zoomControl={false}
        attributionControl={false}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {/* 移動到搜尋結果 */}
        {searchResults && <SelectedLocation center={searchResults} />}
        {searchResults && (
          <Marker position={searchResults} icon={mapSearchIcon} />
        )}
        {/* 選中的標記，將地圖移動過去 */}
        {selectedLocation && <SelectedLocation center={selectedLocation} />}
        {/* 使用者位置標記 */}
        {userLocation && <Marker position={userLocation} icon={userIcon} />}
        {renderMarks()}
        <ZoomControl position="topright" />
      </MapContainer>
    </div>
  );
};
