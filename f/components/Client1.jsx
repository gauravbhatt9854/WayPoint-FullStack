import { useContext } from "react";
import { SocketContext } from "../providers/SocketProvider";

export const Client1 = ({isDropdownOpen}) => {
  const { clients } = useContext(SocketContext);
  return (
    <div className={`ml-4 bg-white rounded-lg shadow-lg overflow-y-scroll h-[100%] overflow-x-hidden w-[50%] lg:w-[20%] px-2`}>
      <div className="overflow-y-auto max-h-60 lg:pl-5">

        {clients.map((item, index) => (
          <h3 key={index} className="text-gray-700 text-sm px-2 w-full">
            {item.username}
          </h3>
        ))}
      </div>
    </div>
  );
};

export default Client1;
