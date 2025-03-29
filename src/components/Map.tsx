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
import schoolData from "@/lib/json/schools.json";

type MapLocation = { id: string } & { name: string } & {
  site: string;
} & LatLngLiteral;

type MapProps = {
  // center: LatLngLiteral;
  locations: MapLocation[];
};

const SelectedLocation = ({ center }: { center: LatLngLiteral }) => {
  const map = useMap();
  map.panTo(center, { animate: true });
  return null;
};

export const Map: React.FC<MapProps> = ({ locations }) => {
  const [selectedLocation, setSelectedLocation] = useState<
    MapLocation | undefined
  >();
  const [userLocation, setUserLocation] = useState<LatLngLiteral | null>(null);
  const [searchQuery, setSearchQuery] = useState(""); // 使用者輸入的地址
  const [searchResults, setSearchResults] = useState<LatLngLiteral | null>(
    null
  ); // 搜尋後的座標

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

  // 📌【搜尋地名/地址】
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const result = schoolData.find(
        (school) =>
          school.name.includes(searchQuery) || school.site.includes(searchQuery)
      );

      if (result) {
        setSearchResults({ lat: result.lat, lng: result.lng });
      } else {
        alert("找不到該學校，請嘗試其他名稱");
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
  console.log(userLocation);

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
        <TileLayer url="http://mt0.google.com/vt/lyrs=m&hl=zh-TW&x={x}&y={y}&z={z}" />
        {/* 移動到搜尋結果 */}
        {searchResults && <SelectedLocation center={searchResults} />}
        {searchResults && (
          <Marker position={searchResults} icon={mapMarkActiveIcon} />
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
