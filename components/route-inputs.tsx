import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, X } from "lucide-react";

interface RouteInputsProps {
	onRouteRequest: (origin: string, destination: string) => void;
}

export function RouteInputs({ onRouteRequest }: RouteInputsProps) {
	const [origin, setOrigin] = useState('');
	const [destination, setDestination] = useState('');

	// This clears the input fields without making a route request
	const handleClearInputs = () => {
		setOrigin('');
		setDestination('');
	};

	const handleOriginChange = (value: string) => {
		setOrigin(value);
	};

	const handleDestinationChange = (value: string) => {
		setDestination(value);
	};

	const handleGetDirections = () => {
		if (origin.trim() && destination.trim()) {
			onRouteRequest(origin.trim(), destination.trim());
		}
	};

	return (
		<div className="fixed top-6 left-6 z-50 w-96">
			<div className="bg-white/10 backdrop-blur-glass border border-white/20 rounded-2xl p-6 shadow-glass">
				<div className="flex items-center justify-center gap-3 mb-6">
					<div className="p-2 bg-primary rounded-lg text-center">
						<Navigation className="h-5 w-5 text-primary-foreground" />
					</div>
					<h2 className="text-lg font-semibold text-gray-900">
						Plan Your Route
					</h2>
				</div>

				<div className="space-y-3">
					<div className="relative">
						<div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
							<div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
						</div>
						<Input
							placeholder="Enter starting location"
							value={origin}
							onChange={(e) => handleOriginChange(e.target.value)}
							className="pl-10 h-12 bg-white/80 backdrop-blur-sm border-white/30 focus:border-primary text-black"
						/>
					</div>

					<div className="relative">
						<div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
							<MapPin className="h-4 w-4 text-red-500" />
						</div>
						<Input
							placeholder="Enter destination"
							value={destination}
							onChange={(e) => handleDestinationChange(e.target.value)}
							className="pl-10 h-12 bg-white/80 backdrop-blur-sm border-white/30 focus:border-primary text-black"
						/>
					</div>

					<div className="flex justify-center gap-2">
						<Button
							onClick={handleGetDirections}
							disabled={!origin.trim() || !destination.trim()}
							className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
						>
							Get Directions
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={handleClearInputs}
							className="p-2 bg-white hover:bg-gray-100 border-gray-300 rounded-full text-black"
						>
							<X className="h-4 w-4" />
						</Button>
					</div>

					{origin && destination && (
						<div className="pt-4 border-t border-white/20">
							<p className="text-sm text-gray-700 font-medium">Route Active</p>
							<p className="text-xs text-gray-600">
								Showing directions from origin to destination
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
