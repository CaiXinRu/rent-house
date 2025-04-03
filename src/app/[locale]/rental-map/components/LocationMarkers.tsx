import { Marker, Popup } from "react-leaflet";
import { icon, LatLngLiteral } from "leaflet";

type MapLocation = {
  id: string;
  name: string;
  site: string;
} & LatLngLiteral;

type LocationMarkersProps = {
  locations: MapLocation[];
  selectedLocation?: MapLocation;
  setSelectedLocation: (location: MapLocation) => void;
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
  return (
    <>
      {locations.map((location) => (
        <div key={location.id}>
          <Marker
            icon={
              location.id === selectedLocation?.id
                ? mapMarkActiveIcon
                : mapMarkIcon
            }
            position={{ lat: location.lat, lng: location.lng }}
            eventHandlers={{
              click: () => setSelectedLocation(location),
            }}
          >
            <Popup>{location.name}</Popup>
          </Marker>
        </div>
      ))}
    </>
  );
};

export default LocationMarkers;
