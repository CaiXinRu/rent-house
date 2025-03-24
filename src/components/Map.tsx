import { icon, LatLngLiteral } from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  ZoomControl,
} from "react-leaflet";

// type MapType = "roadmap" | "satellite" | "hybrid" | "terrain";

type MapLocation = LatLngLiteral & { id: string };

type MapProps = {
  center: LatLngLiteral;
  locations: MapLocation[];
};

const SelectedLocation = ({ center }: { center: LatLngLiteral }) => {
  const map = useMap();
  map.panTo(center, { animate: true });
  return null;
};

export const Map: React.FC<MapProps> = ({ center, locations }) => {
  // const [mapType, setMapType] = useState<MapType>("roadmap");
  const [selectedLocation, setSelectedLocation] = useState<
    MapLocation | undefined
  >();

  // const getUrl = () => {
  //   const mapTypeUrls: Record<MapType, string> = {
  //     roadmap: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  //     satellite: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  //     hybrid: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  //     terrain: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  //   };
  //   return mapTypeUrls[mapType];
  // };

  const mapMarkIcon = icon({
    iconUrl: "map-marker.png",
    iconSize: [47, 55],
  });

  const mapMarkActiveIcon = icon({
    iconUrl: "active-map-marker.png",
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

  return (
    <div className="w-full h-screen overflow-hidden">
      <MapContainer
        center={center}
        zoom={13}
        minZoom={5}
        zoomControl={false}
        attributionControl={false}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer url="http://mt0.google.com/vt/lyrs=m&hl=zh-TW&x={x}&y={y}&z={z}" />
        {selectedLocation && <SelectedLocation center={selectedLocation} />}
        {renderMarks()}
        <ZoomControl position="topright" />
      </MapContainer>
    </div>
  );
};
