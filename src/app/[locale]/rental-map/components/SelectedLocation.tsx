import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { LatLngLiteral } from "leaflet";

type SelectedLocationProps = {
  center: LatLngLiteral;
  zoomLevel?: number;
};

const SelectedLocation: React.FC<SelectedLocationProps> = ({
  center,
  zoomLevel = 17,
}) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !center) return;

    setTimeout(() => {
      map.flyTo(center, zoomLevel, { animate: true, duration: 1.5 });
    }, 100);
  }, [center, map, zoomLevel]);

  return null;
};

export default SelectedLocation;
