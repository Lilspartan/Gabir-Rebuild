import { ReactNode } from "react";

const Tooltip = ({  message, children } : { message: string, children: ReactNode }) => {
  return (
    <div className="relative flex flex-row items-center group">
      {children}
      {/* <div className="overflow-show absolute bottom-0 flex flex-col items-start hidden mb-6 transition-all duration-200 group-hover:flex">
        <span className="relative z-50 p-2 text-xs leading-none text-white whitespace-no-wrap bg-gray-600 shadow-lg rounded-md">{message}</span>
      </div> */}
    </div>
  );
};

export default Tooltip;