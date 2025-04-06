import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "@/i18n/navigation";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import { useState } from "react";

const TriggerMenu = () => {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  return (
    <TooltipProvider>
      <DropdownMenu>
        <Tooltip delayDuration={300} open={tooltipOpen}>
          <TooltipTrigger
            asChild
            onMouseEnter={() => setTooltipOpen(true)}
            onMouseLeave={() => setTooltipOpen(false)}
            onClick={() => setTooltipOpen(false)}
          >
            <DropdownMenuTrigger className="text-neutral-100 hover:bg-neutral-800 rounded p-1 focus-visible:outline-none">
              <DragHandleDots2Icon className="w-5 h-5" />
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            className="z-[1000] bg-neutral-800 text-neutral-100"
          >
            <span>查看更多</span>
          </TooltipContent>
        </Tooltip>

        <DropdownMenuContent className="z-[1000]">
          <DropdownMenuItem className="flex justify-center">
            <Link href={"/rental-list"}>租屋列表</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
};

export default TriggerMenu;
