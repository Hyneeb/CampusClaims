'use client';

import { useRef } from 'react';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import { MapStyle } from './MapStyle';

const containerStyle = {
  width: '100%',
  height: '500px',
};

const center = {
  lat: 43.5489,
  lng: -79.6643,
};

type Post = {
  id: string;
  title: string;
  location: string;
  post_type: 'lost' | 'found';
};

const UtmMap = ({ posts }: { posts: Post[] }) => {
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  return (
    isLoaded && (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={16}
        onLoad={(map) => {
          mapRef.current = map;

          // ✅ Draw building polygons from geojson
          fetch('/UtmBuildings.geojson')
            .then((res) => res.json())
            .then((data) => {
              data.features.forEach((feature: any) => {
                const geometry = feature.geometry;

                if (geometry.type !== 'Polygon') return;

                const paths = geometry.coordinates.map((ring: [number, number][]) =>
                  ring.map(([lng, lat]) => ({ lat, lng }))
                );

                const polygon = new google.maps.Polygon({
                  paths,
                  strokeColor: '#ffffff',
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                  fillColor: '#5289bf',
                  fillOpacity: 0.5,
                  zIndex: 1000,
                });

                polygon.setMap(mapRef.current!);
              });
            });

          // ✅ Plot lost/found markers from post data
          fetch('/BuildingCoords.json')
            .then((res) => res.json())
            .then((coords) => {
              console.log("whhaty  is thix..." + coords);
              posts.forEach((post) => {
                console.log("hi");
                console.log("place:  " + post.location); 
                const pin = coords['UTM'][post.location];
                console.log(pin);
                if (!pin) return;

                const marker = new google.maps.Marker({
                  position: pin,
                  map: mapRef.current!,
                  icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    fillColor: post.post_type === 'lost' ? '#e74c3c' : '#2ecc71',
                    fillOpacity: 0.9,
                    strokeWeight: 0,
                    scale: 6,
                  },
                  title: post.title,
                });

                marker.addListener('click', () => {
                  window.location.href = `/posting/${post.id}`;
                });
              });
            });
        }}
        options={{
          disableDefaultUI: true,
          styles: MapStyle,
        }}
      />
    )
  );
};

export default UtmMap;
