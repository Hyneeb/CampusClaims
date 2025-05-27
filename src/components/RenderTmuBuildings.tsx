'use client';

import { useRef, useEffect, useState } from 'react';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import { MapStyle } from './MapStyle';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 43.6566,
  lng: -79.3805,
};

type Post = {
  id: string;
  title: string;
  location: string;
  post_type: 'lost' | 'found';
};

const TmuMap = ({ posts }: { posts: Post[] }) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const labelMarkersRef = useRef<google.maps.Marker[]>([]);
  const [filter, setFilter] = useState<'lost' | 'found'>('lost');

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const plotMarkers = async () => {
    if (!mapRef.current || !posts.length) return;

    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    const coords = await fetch('/BuildingCoords.json').then((r) => r.json());
    const seenCoords: Record<string, number> = {};

    const markers = posts
      .filter((post) => post.post_type === filter)
      .map((post) => {
        let pin = coords['TMU'][post.location];
        if (!pin) return null;

        const key = `${pin.lat.toFixed(5)},${pin.lng.toFixed(5)}`;
        const count = seenCoords[key] ?? 0;
        seenCoords[key] = count + 1;

        if (count > 0) {
          const angle = (count * 45) * (Math.PI / 180);
          const offset = 0.00005;
          pin = {
            lat: pin.lat + Math.sin(angle) * offset,
            lng: pin.lng + Math.cos(angle) * offset,
          };
        }

        const marker = new google.maps.Marker({
          position: pin,
          title: post.title,
          icon: {
            url:
              'data:image/svg+xml;charset=UTF-8,' +
              encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="${
                  post.post_type === 'lost' ? '#e74c3c' : '#2ecc71'
                }">
                  <path fill-rule="evenodd" d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" clip-rule="evenodd"/>
                </svg>
              `),
            scaledSize: new google.maps.Size(32, 32),
            anchor: new google.maps.Point(16, 32),
          },
        });

        marker.addListener('click', () => {
          window.location.href = `/posting/${post.id}`;
        });

        return marker;
      })
      .filter(Boolean) as google.maps.Marker[];

    new MarkerClusterer({ markers, map: mapRef.current });
  };

  useEffect(() => {
    plotMarkers();
  }, [posts, isLoaded, filter]);

  return (
    <>
      {isLoaded && (
        <div className="relative w-full h-[500px]">
          {/* Toggle */}
          <div className="absolute top-2 left-2 z-10 inline-flex rounded shadow-md bg-white text-sm font-medium border border-gray-300">
            <button
              onClick={() => setFilter('lost')}
              className={`px-3 py-1 ${
                filter === 'lost' ? 'bg-[#f5f5f5]' : 'bg-white'
              } rounded-l border-r border-gray-300 hover:bg-[#f0f0f0] transition`}
            >
              Lost
            </button>
            <button
              onClick={() => setFilter('found')}
              className={`px-3 py-1 ${
                filter === 'found' ? 'bg-[#f5f5f5]' : 'bg-white'
              } rounded-r hover:bg-[#f0f0f0] transition`}
            >
              Found
            </button>
          </div>

          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={16}
            onLoad={(map) => {
              mapRef.current = map;

              fetch('https://m.torontomu.ca/core_apps/map/components/map_funcs.cfc?method=getBuildingData')
                .then((res) => res.json())
                .then((data) => {
                  labelMarkersRef.current.forEach((m) => m.setMap(null));
                  labelMarkersRef.current = [];

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
                      fillOpacity: 1.0,
                      zIndex: 1000,
                    });

                    polygon.setMap(mapRef.current!);

                    const bounds = new google.maps.LatLngBounds();
                    coords.forEach((coord: google.maps.LatLngLiteral) => bounds.extend(coord));
                    const labelPos = bounds.getCenter();

                    const marker = new google.maps.Marker({
                      position: labelPos,
                      map: mapRef.current!,
                      icon: {
                        url:
                          'data:image/svg+xml;charset=UTF-8,' +
                          encodeURIComponent(`
                            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="20">
                              <text x="30" y="15" font-size="13" font-weight="bold"
                                    text-anchor="middle"
                                    fill="white" stroke="black" stroke-width="0.75" font-family="Arial">
                                ${building.CODE}
                              </text>
                            </svg>
                          `),
                        scaledSize: new google.maps.Size(60, 20),
                        anchor: new google.maps.Point(30, 10),
                      },
                      optimized: false,
                    });

                    google.maps.event.addListener(mapRef.current!, 'zoom_changed', () => {
                      marker.setVisible(mapRef.current!.getZoom()! >= 16);
                    });

                    labelMarkersRef.current.push(marker);
                  });
                });
            }}
            options={{
              disableDefaultUI: true,
              styles: MapStyle,
            }}
          />
        </div>
      )}
    </>
  );
};

export default TmuMap;
