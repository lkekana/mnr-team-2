'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { FaCarSide } from 'react-icons/fa';
import SidebarNav from "../nav/page";

// Lazy load map
const MapView = dynamic(() => import('@/components/MapComponent'), { ssr: false });

const routeSuggestions = [
  {
    id: 1,
    name: 'Route A',
    score: 85,
    risk: 'Low',
    color: 'green',
    time: '25 mins',
    distance: '12 km',
    origin: 'Maseru, Lesotho',
    destination: 'Ladybrand, South Africa',
  },
  {
    id: 2,
    name: 'Route B',
    score: 72,
    risk: 'Moderate',
    color: 'yellow',
    time: '20 mins',
    distance: '10.5 km',
    origin: 'Maseru, Lesotho',
    destination: 'Ficksburg, South Africa',
  },
  {
    id: 3,
    name: 'Route C',
    score: 56,
    risk: 'High',
    color: 'red',
    time: '18 mins',
    distance: '10 km',
    origin: 'Maseru, Lesotho',
    destination: 'Clocolan, South Africa',
  },
];


export default function WeatherAlertPage() {
  const [selectedRoute, setSelectedRoute] = useState<number | null>(null);
  const [userRoute, setUserRoute] = useState<typeof routeSuggestions[0] | null>(null);
  const [routeToConfirm, setRouteToConfirm] = useState<typeof routeSuggestions[0] | null>(null);

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

      {/* Map View (expanded if route confirmed) */}
      <div className={`flex-1 bg-blue-300 relative transition-all duration-500`}>
        <div className="min-h-screen flex flex-col bg-gray-100">
  <div className="flex-1 bg-blue-300 relative">
    <MapView/>
  </div>
</div>


        {userRoute && (
          <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-xl shadow text-sm font-medium">
            Using <span className={`text-${userRoute.color}-600 font-bold`}>{userRoute.name}</span> — {userRoute.risk} Risk
          </div>
        )}
      </div>

      {/* Show Suggestions only if no route confirmed */}
      {!userRoute && (
        <div className="max-h-[50vh] overflow-y-auto bg-white shadow-inner p-4 transition-all duration-500">
          <h2 className="text-xl font-semibold mb-4">Suggested Safer Routes</h2>
          <div className="space-y-4">
            {routeSuggestions.map((route) => (
              <div
                key={route.id}
                className={`p-4 rounded-xl border shadow-sm bg-gray-50 flex flex-col gap-2 border-${route.color}-300`}
              >
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

                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-${route.color}-500`}
                    style={{ width: `${route.score}%` }}
                  ></div>
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

      {/* Confirmation Modal */}
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
