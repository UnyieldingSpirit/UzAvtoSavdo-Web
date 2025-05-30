import clsx from "clsx";
import { CheckIcon } from "lucide-react";
import { ColorButtonProps } from "./interface";

const ColorButton = ({ color, isSelected, onClick }: ColorButtonProps) => {
 return (
   <button
     onClick={onClick}
     className="group relative touch-manipulation"
     title={color.name}
   >
     <div className={clsx(
       "relative w-full pt-[100%] rounded-lg border-2",
       "transition-all duration-200",
       isSelected
         ? "border-primary scale-105 shadow-md"
         : "border-gray-200 hover:border-primary/60"
     )}>
       <div className="absolute inset-1 rounded-md overflow-hidden"
            style={{ backgroundColor: color.hex_value }}>
         {color.totalAvailable > 0 ? (
           <span className="absolute bottom-0 right-0 text-[10px] bg-primary text-white px-1 rounded-tl">
             {color.totalAvailable}
           </span>
         ) : (
           <span className="absolute bottom-0 right-0 text-[10px] bg-gray-500 text-white px-1 rounded-tl">
             {/* {color.queue_no} */}
           </span>
         )}
       </div>
       {isSelected && (
         <div className="absolute top-1 right-1 w-3 h-3 bg-primary rounded-full flex items-center justify-center">
           <CheckIcon className="w-2 h-2 text-white" />
         </div>
       )}
     </div>
   </button>
 );
};

export default ColorButton;