'use client';

import { useRef, useEffect } from 'react';
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
  console.log('on render');
  console.log(posts);

  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const labelMarkersRef = useRef<google.maps.Marker[]>([]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  /** Draw (or redraw) the post pins */
  const plotMarkers = async () => {
    if (!mapRef.current || !posts.length) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    const coords = await fetch('/BuildingCoords.json').then((r) => r.json());

    posts.forEach((post) => {
      const pin = coords['UTM'][post.location];
      if (!pin) return;

      const marker = new google.maps.Marker({
        position: pin,
        map: mapRef.current,
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

      markersRef.current.push(marker);
    });
  };

  /** Draw static labels using coordinates + building codes */
  const drawBuildingLabels = async () => {
    if (!mapRef.current) return;

    const coords = await fetch('/BuildingCoords.json').then((r) => r.json());

    // Clear previous label markers
    labelMarkersRef.current.forEach((m) => m.setMap(null));
    labelMarkersRef.current = [];

    Object.entries(coords['UTM']).forEach(([buildingName, data]) => {
      const { lat, lng, code } = data as { lat: number; lng: number; code?: string };
      const label = code || buildingName.split(' ')[0]; // fallback label

      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: mapRef.current!,
        icon: {
          url:
            'data:image/svg+xml;charset=UTF-8,' +
            encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" width="60" height="20">
                <text x="30" y="15" font-size="13" font-weight="bold"
                      text-anchor="middle"
                      fill="white" stroke="black" stroke-width="0.75" font-family="Arial">
                  ${label}
                </text>
              </svg>
            `),
          scaledSize: new google.maps.Size(60, 20),
          anchor: new google.maps.Point(30, 10),
        },
        optimized: false,
      });

      // Show labels only at high zoom levels
      google.maps.event.addListener(mapRef.current!, 'zoom_changed', () => {
        const zoom = mapRef.current!.getZoom()!;
        marker.setVisible(zoom >= 16);
      });

      labelMarkersRef.current.push(marker);
    });
  };

  useEffect(() => {
    plotMarkers();
    drawBuildingLabels();
  }, [posts, isLoaded]);

  return (
    isLoaded && (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={16}
        onLoad={(map) => {
          mapRef.current = map;

          // Draw building polygons from geojson
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
