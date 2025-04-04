import { MapLocation } from "@/ts/types";
import { icon, LatLngLiteral } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, ZoomControl } from "react-leaflet";
import LoadingOverlay from "./LoadingOverlay";
import LocationMarkers from "./LocationMarkers";
import SearchBar from "./SearchBar";
import SelectedLocation from "./SelectedLocation";

type MapProps = {
  locations: MapLocation[];
};

export const Map: React.FC<MapProps> = ({ locations }) => {
  const t = useTranslations();
  const [selectedLocation, setSelectedLocation] = useState<
    MapLocation | undefined
  >();
  const [userLocation, setUserLocation] = useState<LatLngLiteral | null>(null);
  const [searchResults, setSearchResults] = useState<{
    result: LatLngLiteral;
    timestamp: number;
  } | null>(null);
  const [progress, setProgress] = useState(0);
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);

  const handleSearchClick = (result: LatLngLiteral | null) => {
    setSelectedLocation(undefined);
    if (result) {
      setSearchResults({ result, timestamp: Date.now() });
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

  const defaultCenter: LatLngLiteral = { lat: 23.5, lng: 120 };

  return (
    <div className="w-full h-screen relative overflow-hidden">
      <SearchBar
        onSearch={handleSearchClick}
        setIsLoading={setSearching}
        setProgress={setProgress}
      />
      <LoadingOverlay
        isLoading={searching || locating}
        progress={progress}
        message={searching ? t("searching") : t("locating")}
      />
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
        {searchResults && (
          <SelectedLocation
            key={searchResults.timestamp}
            center={searchResults.result}
          />
        )}
        {searchResults && (
          <Marker
            position={searchResults.result}
            icon={icon({ iconUrl: "/search-location.png", iconSize: [57, 64] })}
          />
        )}
        {selectedLocation && (
          <SelectedLocation
            key={selectedLocation.id}
            center={selectedLocation}
          />
        )}

        {userLocation && (
          <Marker
            position={userLocation}
            icon={icon({ iconUrl: "/user-location.png", iconSize: [45, 45] })}
          />
        )}
        <LocationMarkers
          locations={locations}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
        />
        <ZoomControl position="topright" />
      </MapContainer>
    </div>
  );
};
