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
	const [loading, setLoading] = useState(false);
		const [error, setError] = useState('');
	

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

	const handleGetDirections  = async () => {
		// if (origin.trim() && destination.trim()) {
		// 	onRouteRequest(origin.trim(), destination.trim());
		// }
		
		try {
    // 1. Check network status first
		if (!navigator.onLine) {
		throw new Error('No internet connection. Please check your network and try again.');
		}

		// 2. Validate inputs
		if (!origin.trim() || !destination.trim()) {
		throw new Error('Please enter both origin and destination');
		}

		// 3. Add loading state (you'll need to manage this in your component state)
		setLoading(true);
		
		// 4. Make the request with timeout
		const timeoutPromise = new Promise((_, reject) => 
		setTimeout(() => reject(new Error('Request timed out')), 10000)
		);

		// Assuming onRouteRequest returns a promise
		await Promise.race([
		onRouteRequest(origin.trim(), destination.trim()),
		timeoutPromise
		]);

	} catch (error: any) {
		// 5. Handle different error types
		let errorMessage = 'Failed to get directions';
		
		if (error.message.includes('internet')) {
		errorMessage = error.message;
		} else if (error.message.includes('timed out')) {
		errorMessage = 'The request took too long. Please try again.';
		} else if (error.message.includes('origin and destination')) {
		errorMessage = error.message;
		} else {
		console.error('Direction error:', error);
		}

		// 6. Show error to user (implementation depends on your UI framework)
		setError(errorMessage); // You'll need error state management
		alert(errorMessage); // Fallback if you don't have a better UI

		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed top-0 left-0 right-0 sm:top-6 sm:left-6 sm:right-auto z-50 sm:w-96">
			<div className="bg-white/95 backdrop-blur-sm border-0 border-b sm:border sm:border-gray-200 sm:rounded-lg p-4 sm:p-6 shadow-lg">
				<div className="flex items-center justify-center gap-3 mb-4 sm:mb-6">
					<div className="p-2 bg-primary rounded-lg text-center">
						<Navigation className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
					</div>
					<h2 className="text-base sm:text-lg font-semibold text-gray-900">
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
							className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg disabled:opacity-50 text-sm sm:text-base"
						>
							Get Directions
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={handleClearInputs}
							className="p-2 bg-white hover:bg-gray-100 border-gray-300 rounded-full text-black"
						>
							<X className="h-3 w-3 sm:h-4 sm:w-4" />
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
