import { useContext } from "react";
import { SocketContext } from "../providers/SocketProvider";

export const Client1 = () => {
  const { clients } = useContext(SocketContext);

  return (
    <div className="ml-4 bg-white rounded-lg shadow-lg h-[100%] w-[95%] sm:w-[90%] md:w-[50%] lg:w-[20%] px-2 overflow-hidden">
      <div className="overflow-y-auto h-full">
        {clients.map((item, index) => (
          <h3 
            key={index} 
            className="text-gray-700 text-sm px-2 w-full truncate"
          >
            {/* Show only first name on mobile, full name on larger screens */}
            <span className="inline lg:hidden">{item.username.split(" ")[0]}</span>
            <span className="hidden lg:inline">{item.username}</span>
          </h3>
        ))}
      </div>
    </div>
  );
};

export default Client1;