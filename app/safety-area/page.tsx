'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { FaCarSide } from 'react-icons/fa';
import SidebarNav from "../nav/page";
import * as turf from '@turf/turf';

const Map = dynamic(() => import('@/components/areaAlertMap'), { ssr: false });

const routeSuggestions = [
  { id: 1, name: 'Route A', score: 85, risk: 'Low', color: 'green', time: '25 mins', distance: '12 km' },
  { id: 2, name: 'Route B', score: 72, risk: 'Moderate', color: 'yellow', time: '20 mins', distance: '10.5 km' },
  { id: 3, name: 'Route C', score: 56, risk: 'High', color: 'red', time: '18 mins', distance: '10 km' },
];
type RiskZone = {
  id: number;
  name: string;
  type: string;
  risk: string;
  polygon: [number, number][];
};
const riskZones: RiskZone[] = [
  {
    id: 1,
    name: 'Zone A',
    type: 'Theft',
    risk: 'High',
    polygon: [
      [28.043, -26.203],
      [28.045, -26.202],
      [28.047, -26.204],
      [28.043, -26.205],
    ] as [number, number][],
  },
];

type SafetyZone = {
  id: number;
  name: string;
  coords: [number, number];
};

const safetyZones: SafetyZone[] = [
  {
    id: 1,
    name: 'Police Station',
    coords: [28.041, -26.207],
  },
  {
    id: 2,
    name: 'Safe Hub',
    coords: [28.049, -26.209],
  },
];


export default function WeatherAlertPage() {
  const [selectedRoute, setSelectedRoute] = useState<number | null>(null);
  const [userRoute, setUserRoute] = useState<typeof routeSuggestions[0] | null>(null);
  const [routeToConfirm, setRouteToConfirm] = useState<typeof routeSuggestions[0] | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [alertZone, setAlertZone] = useState<typeof riskZones[0] | null>(null);
  const [alreadyAlertedZone, setAlreadyAlertedZone] = useState<number[]>([]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (err) => console.warn(err),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  useEffect(() => {
    if (userLocation) {
      const zone = riskZones.find((zone) => isInRiskZone(userLocation, zone));
      if (zone && !alreadyAlertedZone.includes(zone.id)) {
        setAlertZone(zone);
        setAlreadyAlertedZone((prev) => [...prev, zone.id]);
      }
    }
  }, [userLocation, alreadyAlertedZone]);

  function isInRiskZone(userCoords: [number, number], zone: typeof riskZones[0]) {
    const point = turf.point([userCoords[1], userCoords[0]]);
    const coords = zone.polygon;
    const closedCoords = coords[0][0] === coords.at(-1)?.[0] && coords[0][1] === coords.at(-1)?.[1]
      ? coords
      : [...coords, coords[0]];
    const polygon = turf.polygon([closedCoords]);
    return turf.booleanPointInPolygon(point, polygon);
  }

  const handleConfirm = () => {
    if (routeToConfirm) {
      setSelectedRoute(routeToConfirm.id);
      setUserRoute(routeToConfirm);
      setRouteToConfirm(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <SidebarNav />

      <div className="flex-1 relative">
        <Map selectedRoute={selectedRoute} userLocation={userLocation}
        riskZones={riskZones} safetyZones={safetyZones}/>

        {userRoute && (
          <div className={`absolute top-4 left-4 bg-white px-4 py-2 rounded-xl shadow text-sm font-medium`}>
            Using <span className={`text-${userRoute.color}-600 font-bold`}>{userRoute.name}</span> — {userRoute.risk} Risk
          </div>
        )}

        {alertZone && (
          <div className="absolute top-0 left-0 right-0 bg-red-700 text-white p-4 z-50 text-center shadow-xl">
            <p className="text-lg font-semibold">🚨 High-Risk Area Detected!</p>
            <p>
              You're entering <strong>{alertZone.name}</strong> - Risk Type: {alertZone.type}
            </p>
          </div>
        )}
      </div>

      {!userRoute && (
        <div className="max-h-[50vh] overflow-y-auto bg-white p-4">
          <h2 className="text-xl font-semibold mb-4">Suggested Safer Routes</h2>
          <div className="space-y-4">
            {routeSuggestions.map((route) => (
              <div key={route.id} className={`p-4 rounded-xl border border-${route.color}-300 bg-gray-50`}>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold">{route.name}</h3>
                  <span className={`text-sm font-medium text-${route.color}-600`}>
                    {route.risk} Risk - {route.score}%
                  </span>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <span>🚗 {route.time}</span>
                  <span>📏 {route.distance}</span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mt-2">
                  <div
                    className={`h-full rounded-full bg-${route.color}-500`}
                    style={{ width: `${route.score}%` }}
                  />
                </div>

                <button
                  onClick={() => setRouteToConfirm(route)}
                  className={`mt-2 px-4 py-2 rounded-lg bg-${route.color}-600 text-white hover:opacity-90`}
                >
                  <FaCarSide className="inline mr-2" />
                  Choose Route
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {routeToConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-2">Confirm Route</h3>
            <p className="mb-4">
              Are you sure you want to use <strong>{routeToConfirm.name}</strong> ({routeToConfirm.risk} Risk)?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setRouteToConfirm(null)}
                className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className={`px-4 py-2 rounded bg-${routeToConfirm.color}-600 text-white hover:opacity-90`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
