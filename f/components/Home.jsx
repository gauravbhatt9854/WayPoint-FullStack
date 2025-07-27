import React, { useContext } from 'react';
import { MapProvider } from '../providers/MapProvider';
import { ChatProvider } from '../providers/ChatProvider';
import { SocketProvider } from '../providers/SocketProvider';


// Lazy imports
const Map = React.lazy(() => import('./Map'));
const Chat = React.lazy(() => import('./Chat'));
const Contribute = React.lazy(() => import('./Contribute'));

const Home = () => {
    return (
        <div className="pl-2 md:pl-10 pt-5 lg:pt-0 h-[85%] lg:h-[85%] w-full flex flex-col lg:flex-row gap-5 justify-center lg:p-5 items-center overflow-hidden relative z-1">
            <ChatProvider><Chat></Chat></ChatProvider>
            <SocketProvider><MapProvider> <Map></Map> </MapProvider></SocketProvider>
            <ChatProvider><MapProvider> <Contribute></Contribute> </MapProvider></ChatProvider>
        </div>
    )
}

export default Home