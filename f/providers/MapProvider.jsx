import React, { createContext, useState } from 'react'
import { useAuth0 } from "@auth0/auth0-react";
const MapContext = createContext();

const MapProvider = (props) => {
    const { isAuthenticated } = useAuth0();
    if (!isAuthenticated) return null;

    const [currMap, setCurrMap] = useState(2);
    const [isMap, setIsMap] = useState(true);

    const list = [
        {
            attribution: '&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            url: 'https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}.jpg',
            type: 'satellite'
        },
        {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            type: 'street'
        },
        {
            attribution: '&copy; OpenStreetMap France | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            url: 'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
            type: 'street'
        },
        {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            type: 'satellite'
        },
        {
            attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a>',
            url: "https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}.jpg",
            type: 'satellite'
        },
    ];

    return (
        <MapContext.Provider value={{ list, currMap, setCurrMap ,  isMap , setIsMap }}>
            {props.children}
        </MapContext.Provider>
    )
}

export { MapProvider, MapContext }