import { useContext } from "react";
import Client1 from "./Client1";
import { MapContext } from "../providers/MapProvider";
import { UserContext } from "../providers/UserProvider";
import { ChatContext } from "../providers/ChatProvider";
import { FaMap, FaComments, FaServer, FaSignOutAlt, FaLayerGroup } from "react-icons/fa";

const Header = () => {
  const { list, currMap, setCurrMap , setIsMap } = useContext(MapContext);
  const { setIsChat } = useContext(ChatContext);
  const { user, handleLogout } = useContext(UserContext);
  const logo = process.env.VITE_SAMPLE_LOGO;

  return (
    <header className="flex flex-row items-start justify-between bg-gray-900 text-white p-2 shadow-md w-full">

      {/* Left: Profile (mobile: vertical) */}
      <div className="flex flex-col items-center sm:flex-row sm:items-center gap-1 sm:gap-2 flex-shrink-0">
        <div className="h-10 w-10 sm:h-10 sm:w-10 rounded-full overflow-hidden border-2 border-green-400">
          <img src={user?.picture || logo} alt="profile" />
        </div>
        <h1 className="text-xs sm:text-sm lg:text-base font-semibold truncate max-w-[80px] text-center sm:text-left">
          {user?.name}
        </h1>
      </div>

      {/* Center: Client list */}
      <div className="flex-1 max-w-full overflow-hidden mx-1 sm:mx-2">
        <Client1 />
      </div>

      {/* Right: Buttons (mobile: 3 rows, 2 per row) */}
      <div className="grid grid-cols-2 grid-rows-3 gap-1 sm:flex sm:flex-row sm:gap-2 flex-shrink-0">
        <button
          onClick={() => setIsChat(prev => !prev)}
          className="bg-blue-600 hover:bg-blue-700 p-2 rounded-md text-white flex items-center justify-center text-sm sm:text-lg"
          title="Toggle Chat"
        >
          <FaComments />
        </button>

        <button
          onClick={() => setCurrMap((currMap + 1) % list.length)}
          className="bg-green-700 text-white p-2 rounded-md flex items-center justify-center text-sm sm:text-lg"
          title="Change Map"
        >
          <FaLayerGroup />
        </button>

        <button
          onClick={() => setIsMap(prev => !prev)}
          className="bg-blue-600 hover:bg-blue-700 p-2 rounded-md text-white flex items-center justify-center text-sm sm:text-lg"
          title="Toggle Map"
        >
          <FaMap />
        </button>

        <button
          className="bg-green-700 text-white p-2 rounded-md flex items-center justify-center text-sm sm:text-lg"
          disabled
          title="Server Status"
        >
          <FaServer />
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md flex items-center justify-center text-sm sm:text-lg"
          title="Logout"
        >
          <FaSignOutAlt />
        </button>
      </div>
    </header>
  );
};

export default Header;