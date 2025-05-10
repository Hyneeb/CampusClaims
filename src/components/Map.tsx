'use client';

import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { useEffect, useRef } from 'react';

type Item = {
    id: string;
    lat: number;
    lng: number;
};

type Props = {
    campus: string;
    lostItems: Item[];
    foundItems: Item[];
};

const boundsBySchool: Record<string, google.maps.LatLngBoundsLiteral> = {
    TMU: {
      north: 43.659,
      south: 43.654,
      east: -79.377,
      west: -79.384,
    },
    UTM: {
      north: 43.665,
      south: 43.660,
      east: -79.390,
      west: -79.400,
    }
  };

  const containerStyle = {
    width: '100%',
    height: '500px',
  };

  export default function Map({ campus, lostItems, foundItems }: Props) {
    const { isLoaded } = useLoadScript({
      googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!
    });
  
    const mapRef = useRef<google.maps.Map | null>(null);
  
    const onLoad = (map: google.maps.Map) => {
      mapRef.current = map;
      const bounds = boundsBySchool[campus];
      map.fitBounds(bounds);
    };
  
    if (!isLoaded) return <p>Loading map...</p>;
  
    return (
      <GoogleMap
        onLoad={onLoad}
        mapContainerStyle={containerStyle}
        options={{
          tilt: 0,
          heading: 0,
          disableDefaultUI: true,
          zoomControl: true,
          restriction: {
            latLngBounds: boundsBySchool[campus],
            strictBounds: true
          }
        }}
      >
        {/* Lost Items - Blue Pins */}
        {lostItems.map((item) => (
          <Marker
            key={item.id}
            position={{ lat: item.lat, lng: item.lng }}
            icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
          />
        ))}
  
        {/* Found Items - Green Pins */}
        {foundItems.map((item) => (
          <Marker
            key={item.id}
            position={{ lat: item.lat, lng: item.lng }}
            icon="http://maps.google.com/mapfiles/ms/icons/green-dot.png"
          />
        ))}
      </GoogleMap>
    );
  }