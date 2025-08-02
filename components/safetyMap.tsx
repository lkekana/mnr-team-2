'use client';

import { useState, useEffect, useRef } from 'react';
import {
  APIProvider,
  Map,
  useMap,
  useMapsLibrary
} from '@vis.gl/react-google-maps';
import { FloatingNav } from '@/components/floating-nav';
import { RouteInputs } from '@/components/route-inputs';

function RouteRenderer({ origin, destination }: { origin: string; destination: string }) {
  const map = useMap();
  const routesLibrary = useMapsLibrary('routes');
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();

  useEffect(() => {
    if (!routesLibrary || !map) return;

    const service = new routesLibrary.DirectionsService();
    const renderer = new routesLibrary.DirectionsRenderer({
      suppressMarkers: false,
      polylineOptions: {
        strokeColor: '#4285F4',
        strokeWeight: 6,
        strokeOpacity: 0.8
      }
    });

    renderer.setMap(map);
    setDirectionsService(service);
    setDirectionsRenderer(renderer);
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer || !origin || !destination) return;

    directionsService
      .route({
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
      })
      .catch((error) => {
        console.error('Error fetching directions:', error);
      });

    return () => {
      directionsRenderer.setMap(null);
    };
  }, [directionsService, directionsRenderer, origin, destination]);

  return null;
}

function MapOverlayRenderer({ classifiedMarker }: { classifiedMarker?: { lat: number; lng: number; type: 'safe' | 'danger' } }) {
  const map = useMap();
  const markerRef = useRef<google.maps.Marker | null>(null);

  useEffect(() => {
    if (!map || typeof window === 'undefined' || !google?.maps) return;

    if (markerRef.current) {
      markerRef.current.setMap(null);
      markerRef.current = null;
    }

    if (classifiedMarker) {
      markerRef.current = new google.maps.Marker({
        map,
            position: { lat: classifiedMarker.lat, lng: classifiedMarker.lng }, // ✅ fixed

        icon: {
          path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          fillColor: classifiedMarker.type === 'danger' ? 'red' : 'green',
          fillOpacity: 1,
          strokeWeight: 1,
          scale: 6
        }
      });
    }
  }, [map, classifiedMarker]);

  return null;
}

// 🔍 Danger/Safe area lists
const dangerousAreas = [
  'Akasia',
  'Mamelodi East',
  'Temba',
  'Hillbrow',
  'Jeppestown',
  'Johannesburg Central',
];

const safeAreas = [
  'Mooikloof Ridge',
  'Die Wilgers',
  'Hillshaven',
  'Midvaal',
  'Midrand',
  'Edenvale',
  'Bryanston',
  'Northcliff',
  'Dainfern',
  'Paulshof',
  'Sandhurst',
  'Hyde Park'
];

function classifyArea(locationName: string): 'safe' | 'danger' | 'unknown' {
  const name = locationName.toLowerCase();
  if (dangerousAreas.some(area => name.includes(area.toLowerCase()))) return 'danger';
  if (safeAreas.some(area => name.includes(area.toLowerCase()))) return 'safe';
  return 'unknown';
}

export default function MapView() {
  const [routeData, setRouteData] = useState<{ origin: string; destination: string } | null>(null);
  const [classifiedMarker, setClassifiedMarker] = useState<{ lat: number; lng: number; type: 'safe' | 'danger' } | null>(null);
  const centerPosition = { lat: -26.171498, lng: 27.95 };

  const handleRouteRequest = (origin: string, destination: string) => {
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ address: destination }, (results, status) => {
      if (status === 'OK' && results && results.length > 0) {
        const result = results[0];
        const lat = result.geometry.location.lat();
        const lng = result.geometry.location.lng();
        const locationName = result.formatted_address;

        const classification = classifyArea(locationName);

        if (classification === 'danger') {
          alert('⚠️ Warning: This destination is in a high-crime zone!');
        }

        if (classification !== 'unknown') {
          setClassifiedMarker({ lat, lng, type: classification });
        } else {
          setClassifiedMarker(null); // No marker for unknown
        }

        setRouteData({ origin, destination });
      } else {
        console.error('Geocoding failed:', status);
        alert('Could not find location. Please try again.');
      }
    });
  };

  return (
    <APIProvider
      apiKey="AIzaSyCyLvGP9ifUp9swhKHTzsmvrdazjpVleek"
      libraries={['geometry']}
    >
      <RouteInputs onRouteRequest={handleRouteRequest} />
      <FloatingNav />
      <Map
        style={{ width: '100vw', height: '100vh' }}
        defaultCenter={centerPosition}
        defaultZoom={9}
        gestureHandling="greedy"
        disableDefaultUI={true}
      >
        {routeData && (
          <RouteRenderer
            origin={routeData.origin}
            destination={routeData.destination}
          />
        )}
        <MapOverlayRenderer classifiedMarker={classifiedMarker ?? undefined} />
      </Map>
    </APIProvider>
  );
}
