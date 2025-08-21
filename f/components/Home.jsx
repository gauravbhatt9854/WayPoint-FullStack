import React, { Suspense } from 'react';
import { MapProvider } from '../providers/MapProvider';
import { ChatProvider } from '../providers/ChatProvider';
import { SocketProvider } from '../providers/SocketProvider';

// Lazy imports
const Map = React.lazy(() => import('./Map'));
const Chat = React.lazy(() => import('./Chat'));
const Contribute = React.lazy(() => import('./Contribute'));
const Header = React.lazy(() => import("../components/Header"));

const Home = () => {
  return (
    <SocketProvider>
      <ChatProvider>
        <MapProvider>
          <div className="flex flex-col h-screen w-full overflow-hidden">

            <Suspense fallback={<div>Loading Header...</div>}>
              <Header />
            </Suspense>

            <div className="flex flex-col lg:flex-row gap-5 flex-1 p-5 overflow-auto">
              <Suspense fallback={<div>Loading Chat...</div>}>
                <Chat />
              </Suspense>

              <Suspense fallback={<div>Loading Map...</div>}>
                <Map />
              </Suspense>

              <Suspense fallback={<div>Loading Contribute...</div>}>
                <Contribute />
              </Suspense>
            </div>

          </div>
        </MapProvider>
      </ChatProvider>
    </SocketProvider>
  )
}

export default Home;
