import { icon, LatLngLiteral } from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  ZoomControl,
} from "react-leaflet";
import { Progress } from "./ui/progress";
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
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedLocation, setSelectedLocation] = useState<
    MapLocation | undefined
  >();
  const [userLocation, setUserLocation] = useState<LatLngLiteral | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<LatLngLiteral | null>(
    null
  );
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);
  const [progress, setProgress] = useState(0);

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

    setSearching(true);
    setProgress(50);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}`
      );

      setProgress(80);

      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        setSearchResults({ lat: parseFloat(lat), lng: parseFloat(lon) });
        setProgress(90);
      } else {
        alert("找不到該位置，請嘗試其他名稱");
        setProgress(90);
      }
    } catch (error) {
      console.error("搜尋發生錯誤:", error);
      setProgress(90);
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    setLocating(true);
    setProgress(20);
    if (navigator.geolocation) {
      setProgress(50);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setProgress(90);
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setLocating(false);
        },
        (error) => {
          console.log("Error getting user location:", error);
          setLocating(false);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setLocating(false);
    }
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const defaultCenter: LatLngLiteral = { lat: 23.5, lng: 120 };

  return (
    <div className="w-full h-screen relative overflow-hidden">
      <div className="absolute top-4 left-4 transform bg-neutral-700 shadow-lg rounded-lg ring-2 ring-neutral-500 p-3 z-[999] flex gap-2">
        <input
          type="text"
          className="rounded p-2 w-60 bg-neutral-800 text-neutral-100 ring-2 ring-neutral-500 focus:outline-none"
          placeholder="輸入地名或地址"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          ref={inputRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <button
          className="bg-neutral-700 text-neutral-100 px-4 py-2 rounded hover:bg-neutral-800 active:ring-2 active:ring-neutral-500"
          onClick={handleSearch}
        >
          搜尋
        </button>
        {selectedLocation && (
          <div className="bg-blue-500 w-full">{selectedLocation.name}</div>
        )}
      </div>

      {/* 顯示 searching loading 畫面 */}
      {searching && (
        <div className="absolute top-0 left-0 w-full h-full bg-neutral-500 bg-opacity-55 backdrop-blur-sm flex items-center justify-center z-[1000]">
          <div className="w-full max-w-xl bg-neutral-300 p-4 rounded-lg shadow-lg">
            <Progress value={progress} max={100} />
            <div className="text-neutral-700 text-xl mt-4 text-center">
              搜尋中... {progress}%
            </div>
          </div>
        </div>
      )}

      {locating && (
        <div className="absolute top-0 left-0 w-full h-full bg-neutral-500 bg-opacity-55 backdrop-blur-sm flex items-center justify-center z-[1000]">
          <div className="w-full max-w-xl bg-neutral-300 p-4 rounded-lg shadow-lg">
            <Progress value={progress} max={100} />
            <div className="text-neutral-700 text-xl mt-4 text-center">
              定位中... {progress}%
            </div>
          </div>
        </div>
      )}

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
