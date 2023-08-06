'use client';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet.fullscreen';
import 'leaflet.fullscreen/Control.FullScreen.css';

import L from 'leaflet';
import { divIcon } from 'leaflet';
import { LatLngExpression } from 'leaflet';
import { useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';

const mapBoxURL =
  'https://api.mapbox.com/styles/v1/mapbox/navigation-day-v1/tiles/512/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoiam1sd2ViIiwiYSI6ImNsa2QzcnIxejAzMmszcG1tOTh5bmh2Ym0ifQ.5SNkUbeD9ubwM2NuY3DDYg';

const markerIcon = divIcon({
  className: 'bg-transparent text-gray-600 animate-scaleIn animate-once',
  iconSize: [36, 36],
  html: `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 384 512" height="36px" width="36px" xmlns="http://www.w3.org/2000/svg"><path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"></path></svg>`,
});

const FullscreenControl = function (props: any) {
  const map = useMap();

  useEffect(() => {
    // create control
    const control = L.control.fullscreen(props);
    // link control to map
    control.addTo(map);

    return () => {
      // get leaflet-control-zoom-fullscreen elements that need to be removed from container
      const elementsToRemove =
        control
          .getContainer()
          ?.getElementsByClassName('leaflet-control-zoom-fullscreen') ?? [];
      for (let i = 0; i < elementsToRemove.length; i++) {
        elementsToRemove[i].remove();
      }
    };
  }, [map, props]);

  return null;
};

type Props = {
  name: string;
  position: number[];
};

const BeachMap = ({ name, position }: Props) => {
  if (!position || position.length !== 2) {
    throw new Error('Invalid position');
  }
  const parsedPosition = position as LatLngExpression;
  return (
    <MapContainer
      center={parsedPosition}
      zoom={12}
      scrollWheelZoom={false}
      closePopupOnClick
      className="absolute z-0 h-full w-full"
    >
      <TileLayer
        url={mapBoxURL}
        attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
        detectRetina
      />
      <Marker position={parsedPosition} icon={markerIcon}>
        <Popup>
          <div className="text-base font-sans font-semibold text-gray-500">
            {name}
          </div>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${position.join(
              ',',
            )}`}
            target="_blank"
            rel="external noopener noreferrer"
            className="font-sans block mt-0.5 text-sm motion-safe:hover:text-sky-600 transition-colors"
          >
            Ver en Google Maps
          </a>
        </Popup>
      </Marker>
      <FullscreenControl />
    </MapContainer>
  );
};

export default BeachMap;
