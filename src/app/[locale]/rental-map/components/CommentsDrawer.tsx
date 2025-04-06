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
import { PersonIcon, ThickArrowLeftIcon } from "@radix-ui/react-icons";

type CommentsDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedLocation?: MapLocation;
  comments: Comments[];
  onClose: () => void;
};

const CommentsDrawer: React.FC<CommentsDrawerProps> = ({
  open,
  onOpenChange,
  selectedLocation,
  comments,
  onClose,
}) => {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="left">
      <DrawerContent className="w-1/3 min-w-96 p-2 z-[999] top-[3%] h-3/4">
        <div className="top-3 left-3">
          <DrawerClose asChild>
            <button
              onClick={onClose}
              className="bg-neutral-700 text-neutral-100 rounded-full flex items-center justify-center w-8 h-8"
            >
              <ThickArrowLeftIcon className="w-4 h-4" />
            </button>
          </DrawerClose>
        </div>
        <DrawerHeader className="p-2">
          <DrawerTitle>{selectedLocation?.name || "地點資訊"}</DrawerTitle>
          <DrawerDescription>
            {selectedLocation ? `地址：${selectedLocation.site}` : "請選擇地點"}
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-2 w-full h-[72%]">
          <div className="flex items-center justify-center w-full bg-neutral-700 text-neutral-100 rounded-sm">
            <span>評論</span>
          </div>
          <div className="mt-2 w-full h-full border border-neutral-200 p-4 rounded-lg">
            <div className="max-h-full overflow-y-auto">
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div
                    key={comment.user}
                    className="p-4 bg-neutral-100 rounded-md shadow-md break-words"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="bg-neutral-700 text-neutral-100 rounded-full flex items-center justify-center w-8 h-8">
                        <PersonIcon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-semibold">
                        {comment.user}
                      </span>
                    </div>
                    <p>{comment.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <DrawerFooter />
      </DrawerContent>
    </Drawer>
  );
};

export default CommentsDrawer;
