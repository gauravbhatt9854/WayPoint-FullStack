import { useEffect, useContext, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { SocketContext } from "../providers/SocketProvider";
import { MapContext } from "../providers/MapProvider";

const Map = () => {
  const [mapCenter, setMapCenter] = useState([20, 78]); // default India center
  const { clients } = useContext(SocketContext);
  const { list, currMap, isMap } = useContext(MapContext);

  const hasInitialized = useRef(false);
  const isUserInteracting = useRef(false);

  // Fetch user location once and set map center
  useEffect(() => {
    if (!hasInitialized.current && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const loc = [coords.latitude, coords.longitude];
          setMapCenter(loc);
          hasInitialized.current = true;
        },
        (error) => {
          console.error("Geolocation error in Map page:", error);
          hasInitialized.current = true; // Prevent retrying
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  const getClientIcon = (profileUrl) =>
    new L.Icon({
      iconUrl: profileUrl || process.env.VITE_RANDOM_LOGO,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    });

  const MapEventHandler = () => {
    const map = useMapEvents({
      zoomstart: () => (isUserInteracting.current = true),
      movestart: () => (isUserInteracting.current = true),
      zoomend: () => {
        setTimeout(() => {
          isUserInteracting.current = false;
        }, 10000);
        setMapCenter([map.getCenter().lat, map.getCenter().lng]);
      },
      moveend: () => {
        setTimeout(() => {
          isUserInteracting.current = false;
        }, 10000);
        setMapCenter([map.getCenter().lat, map.getCenter().lng]);
      },
    });
    return null;
  };

  const ClientMarkers = useMemo(() => (
    <>
      {clients.map(({ id, lat, lng, username, profileUrl }) => (
        <Marker key={id} position={[lat, lng]} icon={getClientIcon(profileUrl)}>
          <Popup>{username} is here on the map</Popup>
        </Marker>
      ))}
    </>
  ), [clients]);

  return (
<div className={`${isMap ? "block" : "hidden"} h-[50%] w-[95%] sm:w-[90%] md:w-[85%] lg:h-[85%] lg:w-[50%]`}>
  <MapContainer
    center={mapCenter}
    zoom={4}
    scrollWheelZoom={true}
    style={{ height: "100%", width: "100%" }}
  >
    <TileLayer
      attribution={list[currMap].attribution}
      url={list[currMap].url}
    />
    <MapEventHandler />
    {ClientMarkers}
  </MapContainer>
</div>

  );
};

export default Map;