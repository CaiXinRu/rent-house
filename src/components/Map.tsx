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

type MapLocation = LatLngLiteral & { id: string };

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
  console.log(userLocation)

  return (
    <div className="w-full h-screen overflow-hidden">
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
