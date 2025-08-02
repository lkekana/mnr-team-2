'use client';

import React from 'react';
import { FaMapMarkerAlt, FaShieldAlt, FaExclamationTriangle } from 'react-icons/fa';

type RiskZone = {
  id: number;
  name: string;
  type: string;
  risk: string;
  polygon: [number, number][];
};

type SafetyZone = {
  id: number;
  name: string;
  coords: [number, number];
};

type MapProps = {
  userLocation: [number, number] | null;
  selectedRoute: number | null;
  riskZones: RiskZone[];
  safetyZones: SafetyZone[];
};

export default function Map({
  userLocation,
  selectedRoute,
  riskZones,
  safetyZones,
}: MapProps) {
  return (
    <div className="relative h-full w-full bg-gradient-to-br from-blue-200 to-blue-400 overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 border border-blue-300">
        {Array.from({ length: 144 }).map((_, idx) => (
          <div key={idx} className="border border-blue-100"></div>
        ))}
      </div>

      {/* User marker */}
      {userLocation && (
        <div
          className="absolute w-6 h-6 rounded-full bg-black flex items-center justify-center text-white text-xs shadow"
          style={{ top: '40%', left: '50%' }}
        >
          <FaMapMarkerAlt />
        </div>
      )}

      {/* Risk zones */}
      {riskZones.map((zone) => (
        <div
          key={zone.id}
          className="absolute top-[20%] left-[30%] w-[100px] h-[100px] bg-red-600 bg-opacity-40 border-2 border-red-700 rounded-full flex items-center justify-center"
        >
          <FaExclamationTriangle className="text-white text-2xl" />
        </div>
      ))}

      {/* Safety zones */}
      {safetyZones.map((zone) => (
        <div
          key={zone.id}
          className="absolute top-[70%] left-[60%] w-[50px] h-[50px] bg-green-500 bg-opacity-80 rounded-full flex items-center justify-center shadow-md"
        >
          <FaShieldAlt className="text-white text-lg" title={zone.name} />
        </div>
      ))}

      {/* Mock route line */}
      {selectedRoute && (
        <div className="absolute top-[45%] left-[48%] w-1 h-[100px] bg-yellow-400 animate-pulse shadow-md" />
      )}
    </div>
  );
}