'use client'
import { useState, useEffect } from 'react'
import { APIProvider, Map, useMap, useMapsLibrary } from '@vis.gl/react-google-maps'
import { FloatingNav } from '@/components/floating-nav'
import { RouteInputs } from '@/components/route-inputs'

function RouteRenderer({ origin, destination }: { origin: string; destination: string }) {
    const map = useMap();
    const routesLibrary = useMapsLibrary('routes');
    const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
    const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();

    useEffect(() => {
        if (!routesLibrary || !map) return;
        setDirectionsService(new routesLibrary.DirectionsService());
        const renderer = new routesLibrary.DirectionsRenderer({
            suppressMarkers: false,
            polylineOptions: {
                strokeColor: '#4285F4',
                strokeWeight: 6,
                strokeOpacity: 0.8
            }
        });
        setDirectionsRenderer(renderer);
    }, [routesLibrary, map]);

    useEffect(() => {
        if (!directionsService || !directionsRenderer || !origin || !destination) return;

        console.log('Requesting route from:', origin, 'to:', destination);
        directionsRenderer.setMap(map);

        directionsService.route({
            origin,
            destination,
            travelMode: google.maps.TravelMode.DRIVING,
        }).then((response) => {
            console.log('Route response:', response);
            directionsRenderer.setDirections(response);
        }).catch((error) => {
            console.error('Error fetching directions:', error);
        });

        return () => {
            directionsRenderer.setMap(null);
        };
    }, [directionsService, directionsRenderer, map, origin, destination]);

    return null;
}

export default function MapView() {
    const position = { lat: -29.2025, lng: 28.0337 };
    const [routeData, setRouteData] = useState<{ origin: string; destination: string } | null>(null);

    const handleRouteRequest = (origin: string, destination: string) => {
        console.log('Route request received:', { origin, destination });
        setRouteData({ origin, destination });
    };

    return (
        <APIProvider apiKey={"AIzaSyCyLvGP9ifUp9swhKHTzsmvrdazjpVleek"}>
            <RouteInputs onRouteRequest={handleRouteRequest} />
            <FloatingNav />
            <Map
                style={{width: '100vw', height: '100vh'}}
                defaultCenter={position}
                defaultZoom={6}
                gestureHandling={'greedy'}
                disableDefaultUI={true}
            >
                {routeData && (
                    <RouteRenderer 
                        origin={routeData.origin} 
                        destination={routeData.destination} 
                    />
                )}
            </Map>
        </APIProvider>
    )
}