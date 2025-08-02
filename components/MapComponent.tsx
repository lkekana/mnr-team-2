'use client';

type Route = {
  id: number;
  name: string;
  score: number;
  risk: string;
  color: string;
  time: string;
  distance: string;
};

type MapComponentProps = {
  selectedRoute: number | null;
  userRoute: Route | null;
};

export default function MapComponent({ selectedRoute }: { selectedRoute: number | null }) {
  // Optional: Visualize selected route using selectedRoute ID
  return <div className="w-full h-full">Map showing route ID: {selectedRoute}</div>;
}



