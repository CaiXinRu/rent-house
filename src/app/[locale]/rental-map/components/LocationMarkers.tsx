import { Comments, MapLocation } from "@/ts/types";
import { icon } from "leaflet";
import { useState } from "react";
import { Marker } from "react-leaflet";
import CommentsDrawer from "./CommentsDrawer";

type LocationMarkersProps = {
  locations: MapLocation[];
  selectedLocation?: MapLocation;
  setSelectedLocation: (location: MapLocation | undefined) => void;
};

const mapMarkIcon = icon({
  iconUrl: "/map-marker.png",
  iconSize: [47, 55],
});

const mapMarkActiveIcon = icon({
  iconUrl: "/active-map-marker.png",
  iconSize: [57, 64],
});

const LocationMarkers: React.FC<LocationMarkersProps> = ({
  locations,
  selectedLocation,
  setSelectedLocation,
}) => {
  const [comments, setComments] = useState<Comments[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const handleMarkerClick = (location: MapLocation) => {
    setIsDrawerOpen(false);
    setSelectedLocation(location);
    setComments(location.comments);
    setTimeout(() => {
      setIsDrawerOpen(true);
    }, 0);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedLocation(undefined);
  };

  return (
    <>
      {locations.map((location) => (
        <Marker
          key={location.id}
          icon={
            location.id === selectedLocation?.id
              ? mapMarkActiveIcon
              : mapMarkIcon
          }
          position={{ lat: location.lat, lng: location.lng }}
          eventHandlers={{
            click: () => handleMarkerClick(location),
          }}
        />
      ))}

      <CommentsDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        selectedLocation={selectedLocation}
        comments={comments}
        onClose={handleDrawerClose}
      />
    </>
  );
};

export default LocationMarkers;
