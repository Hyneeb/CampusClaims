'use client';

import { useEffect, useRef } from 'react';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import { MapStyle } from './MapStyle';

const containerStyle = {
  width: '100%',
  height: '500px'
};

const center = {
  lat: 43.6566,
  lng: -79.3805
};

type Post = {
    id: string;
    title: string;
    location: string;
    post_type: 'lost' | 'found';
};

const TmuMap = ({ posts }: { posts: Post[] }) => {
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!
  });

  useEffect(() => {
    if (isLoaded && mapRef.current) return;

    fetch("https://m.torontomu.ca/core_apps/map/components/map_funcs.cfc?method=getBuildingData")
      .then(res => res.json())
      .then(data => {
        data.forEach((building: any) => {
          const coords = building.POLYGON.split(',\r').map((coord: string) => {
            const [lat, lng] = coord.split(',').map(Number);
            return { lat, lng };
          });

          const polygon = new google.maps.Polygon({
            paths: coords,
            strokeColor: '#ffffff',
            strokeOpacity: 0.8,
            strokeWeight: 1,
            fillColor: '#5289bf',
            fillOpacity: 1.0
          });

          polygon.setMap(mapRef.current!);

          const bounds = new google.maps.LatLngBounds();
          coords.forEach((coord: google.maps.LatLngLiteral) => bounds.extend(coord));
          const labelPos = bounds.getCenter();
          const marker = new google.maps.Marker({
            position: labelPos,
            map: mapRef.current!,
            icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg xmlns="http://www.w3.org/2000/svg" width="60" height="20">
                    <text x="30" y="15" font-size="13" font-weight="bold"
                          text-anchor="middle"
                          fill="white" stroke="black" stroke-width="0.75" font-family="Arial">
                      ${building.CODE}
                    </text>
                  </svg>
                `),
                scaledSize: new google.maps.Size(60, 20),
                anchor: new google.maps.Point(30, 10)
              },
            optimized: false // allows proper label rendering
            });

            google.maps.event.addListener(mapRef.current!, 'zoom_changed', () => {
                const zoom = mapRef.current!.getZoom()!;
                marker.setVisible(zoom >= 16);
            });
        });
      });
  }, [isLoaded, mapRef.current]);

  return (
    isLoaded && (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={16}
        onLoad={(map) => {
          mapRef.current = map;
        }}
        options={{
          disableDefaultUI: true,
          styles: MapStyle
        }}
      />
    )
  );
};

export default TmuMap;