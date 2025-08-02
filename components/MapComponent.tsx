'use client'
import { useState, useEffect } from 'react'
import { APIProvider, Map, useMap, useMapsLibrary } from '@vis.gl/react-google-maps'
import { FloatingNav } from '@/components/floating-nav'
import { RouteInputs } from '@/components/route-inputs'
import { RouteLegend } from '@/components/route-legend'
import { WeatherPanel } from '@/components/weather-panel'
import { FaCarSide } from 'react-icons/fa'

export interface RoutePreferences {
    prioritizeSafety: boolean;
    avoidHighways: boolean;
    avoidTolls: boolean;
    avoidFerries: boolean;
    preferMajorCities: boolean;
    maxTravelTime: number;
}

// -------------------- RouteRenderer ---------------------
function RouteRenderer({ origin, destination, preferences }: { origin: string; destination: string; preferences: RoutePreferences }) {
    const map = useMap();
    const routesLibrary = useMapsLibrary('routes');
    const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
    const [mainRenderer, setMainRenderer] = useState<google.maps.DirectionsRenderer>();
    const [altRenderers, setAltRenderers] = useState<google.maps.DirectionsRenderer[]>([]);

    useEffect(() => {
        if (!routesLibrary || !map) return;
        setDirectionsService(new routesLibrary.DirectionsService());

        const mainRenderer = new routesLibrary.DirectionsRenderer({
            suppressMarkers: false,
            polylineOptions: {
                strokeColor: '#4285F4',
                strokeWeight: 6,
                strokeOpacity: 0.9
            }
        });
        setMainRenderer(mainRenderer);
    }, [routesLibrary, map]);

    useEffect(() => {
        if (!directionsService || !mainRenderer || !origin || !destination) return;

        altRenderers.forEach(renderer => renderer.setMap(null));
        setAltRenderers([]);

        directionsService.route({
            origin,
            destination,
            travelMode: google.maps.TravelMode.DRIVING,
            provideRouteAlternatives: true,
            avoidHighways: preferences.avoidHighways,
            avoidTolls: preferences.avoidTolls,
            avoidFerries: preferences.avoidFerries,
            optimizeWaypoints: true,
            region: 'ZA'
        }).then((response) => {
            const routes = response.routes;
            if (routes.length === 0) return;

            mainRenderer.setMap(map);
            mainRenderer.setDirections({
                ...response,
                routes: [routes[0]]
            });

            if (routes.length > 1) {
                const alternatives = getAlternativeRoutes(routes.slice(1), preferences);
                displayAlternativeRoutes(alternatives);
            }
        }).catch((error) => {
            console.error('Error fetching directions:', error);
        });

        return () => {
            mainRenderer.setMap(null);
            altRenderers.forEach(renderer => renderer.setMap(null));
        };
    }, [directionsService, mainRenderer, map, origin, destination, preferences]);

    const getAlternativeRoutes = (routes: google.maps.DirectionsRoute[], prefs: RoutePreferences) => {
        const alternatives = [];

        if (prefs.prioritizeSafety) {
            const safestRoute = findSafestRoute(routes);
            if (safestRoute) alternatives.push({ route: safestRoute, type: 'safety', color: '#10B981' });
        }

        const leastComplexRoute = findLeastComplexRoute(routes);
        if (leastComplexRoute && !alternatives.find(alt => alt.route === leastComplexRoute)) {
            alternatives.push({ route: leastComplexRoute, type: 'simple', color: '#F59E0B' });
        }

        return alternatives;
    };

    const findSafestRoute = (routes: google.maps.DirectionsRoute[]) => {
        const scoredRoutes = routes.map(route => {
            let safetyScore = 0;
            const legs = route.legs[0];

            if (legs.distance && legs.distance.value < 100000) safetyScore += 10;
            if (legs.duration && legs.duration.value < 7200) safetyScore += 5;

            const routeSteps = legs.steps || [];
            const goesThroughMajorCity = routeSteps.some(step =>
                step.instructions?.toLowerCase().includes('johannesburg') ||
                step.instructions?.toLowerCase().includes('pretoria') ||
                step.instructions?.toLowerCase().includes('cape town')
            );
            if (goesThroughMajorCity) safetyScore += 15;

            return { route, safetyScore };
        });

        scoredRoutes.sort((a, b) => b.safetyScore - a.safetyScore);
        return scoredRoutes[0]?.route;
    };

    const findLeastComplexRoute = (routes: google.maps.DirectionsRoute[]) => {
        const scoredRoutes = routes.map(route => {
            const legs = route.legs[0];
            const routeSteps = legs.steps || [];
            const complexityScore = routeSteps.length;

            return { route, complexityScore };
        });

        scoredRoutes.sort((a, b) => a.complexityScore - b.complexityScore);
        return scoredRoutes[0]?.route;
    };

    const displayAlternativeRoutes = (alternatives: any[]) => {
        const newRenderers = alternatives.map(alt => {
            const renderer = new (routesLibrary as any).DirectionsRenderer({
                suppressMarkers: true,
                polylineOptions: {
                    strokeColor: alt.color,
                    strokeWeight: 4,
                    strokeOpacity: 0.6
                }
            });

            renderer.setMap(map);
            renderer.setDirections({
                routes: [alt.route],
                request: { origin, destination, travelMode: google.maps.TravelMode.DRIVING }
            });

            return renderer;
        });

        setAltRenderers(newRenderers);
    };

    return null;
}

// -------------------- MapView ---------------------

const riskColors = {
    low: 'green',
    medium: 'yellow',
    high: 'red'
};

function getRiskLevel(destination: string): { score: number; level: 'low' | 'medium' | 'high' } {
    const mockRisk: Record<string, { score: number; level: 'low' | 'medium' | 'high' }> = {
        'Johannesburg': { score: 80, level: 'high' },
        'Pretoria': { score: 60, level: 'medium' },
        'Cape Town': { score: 30, level: 'low' }
    };

    return mockRisk[destination] ?? { score: 40, level: 'medium' };
}


export default function MapView() {
    const position = { lat: -29.2025, lng: 28.0337 };
    const [routeData, setRouteData] = useState<{ origin: string; destination: string } | null>(null);

    const routePreferences: RoutePreferences = {
        prioritizeSafety: true,
        avoidHighways: false,
        avoidTolls: false,
        avoidFerries: true,
        preferMajorCities: true,
        maxTravelTime: 8
    };

    const handleRouteRequest = (origin: string, destination: string) => {
        console.log('Route request received:', { origin, destination });
        setRouteData({ origin, destination });
    };

    return (
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
            <RouteInputs onRouteRequest={handleRouteRequest} />
            <RouteLegend />
            {routeData && (
                <WeatherPanel
                    origin={routeData.origin}
                    destination={routeData.destination}
                />
            )}
            <FloatingNav />
            <Map
                style={{ width: '100vw', height: '100vh' }}
                defaultCenter={position}
                defaultZoom={6}
                gestureHandling={'greedy'}
                disableDefaultUI={true}
            >
                {routeData && (
                    <RouteRenderer
                        origin={routeData.origin}
                        destination={routeData.destination}
                        preferences={routePreferences}
                    />
                )}
            </Map>

            {routeData && (() => {
                const { score, level } = getRiskLevel(routeData.destination);
                const color = riskColors[level];

                return (
                    <div
                        key={routeData.destination}
                        className={`p-4 rounded-xl border shadow-sm bg-gray-50 flex flex-col gap-2 border-${color}-300`}
                    >
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold">{routeData.destination}</h3>
                            <span className={`text-sm font-medium text-${color}-600`}>
                                {routeData.destination} Risk - {score}%
                            </span>
                        </div>

                        <div className="flex justify-between text-sm text-gray-600">
                            <span>🚗 {routeData.origin}</span>
                            <span>📏 {routeData.destination}</span>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                                className={`h-full rounded-full bg-${color}-500`}
                                style={{ width: `${score}%` }}
                            ></div>
                        </div>

                        <button
                            className={`mt-2 px-4 py-2 rounded-lg bg-${color}-600 text-white hover:opacity-90`}
                        >
                            <FaCarSide className="inline mr-2" />
                            Choose Route
                        </button>
                    </div>
                );
            })()}
        </APIProvider>
    );
}
