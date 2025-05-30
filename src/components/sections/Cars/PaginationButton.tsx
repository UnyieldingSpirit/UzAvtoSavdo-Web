import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PaginationButtonProps } from "./interface";

const PaginationButton = ({ onClick, disabled, direction }: PaginationButtonProps) => (
 <button
   onClick={onClick}
   disabled={disabled}
   className={clsx(
     "p-2 rounded-full transition-colors",
     disabled 
       ? "text-gray-300" 
       : "text-gray-600 hover:bg-gray-100"
   )}
 >
   {direction === 'prev' ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
 </button>
);

export default PaginationButton;