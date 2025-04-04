import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Comments, MapLocation } from "@/ts/types";
import { ThickArrowLeftIcon } from "@radix-ui/react-icons";
import { icon } from "leaflet";
import Image from "next/image";
import { useState } from "react";
import { Marker, Popup } from "react-leaflet";

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
      setIsDrawerOpen(true); // 開啟新的 Drawer
    }, 0);
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
        >
          <Popup>{location.name}</Popup>
        </Marker>
      ))}

      <Drawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        direction="left"
      >
        <DrawerContent className="w-96 p-2 z-[999] top-[3%] h-3/4">
          <div className="top-3 left-3">
            <DrawerClose asChild>
              <button
                className="bg-neutral-700 text-neutral-100 rounded-full flex items-center justify-center
                w-8 h-8"
              >
                <ThickArrowLeftIcon className="w-4 h-4" />
              </button>
            </DrawerClose>
          </div>
          <DrawerHeader className="p-2">
            <DrawerTitle>{selectedLocation?.name || "地點資訊"}</DrawerTitle>
            <DrawerDescription>
              {selectedLocation
                ? `地址：${selectedLocation.site}`
                : "請選擇地點"}
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-2 w-full h-[72%]">
            <div className="flex items-center justify-center w-full bg-neutral-700 text-neutral-100 rounded-lg">
              <span>評論</span>
            </div>
            <div className="mt-2 w-full h-full border border-neutral-200 p-4 rounded-lg">
              <div className="max-h-full overflow-y-auto">
                <div className="space-y-4">
                  {comments.map((comment) => {
                    return (
                      <div
                        key={comment.user}
                        className="p-4 bg-neutral-100 rounded-md shadow-md break-words"
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          <Image
                            src="https://picsum.photos/48/48"
                            alt="User"
                            width={48}
                            height={48}
                            className="rounded-full object-cover"
                          />
                          <span className="text-sm font-semibold">
                            {comment.user}
                          </span>
                        </div>
                        <p>{comment.text}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default LocationMarkers;
