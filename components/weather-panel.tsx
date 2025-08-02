import React, { useEffect, useState } from 'react';
import { Cloud, Sun, CloudRain, Thermometer } from 'lucide-react';
import { WeatherAlerts } from './weather-alerts';

interface WeatherInfo {
    location: string;
    temp: number;
    condition: string;
    humidity: number;
    windSpeed: number;
}

interface WeatherPanelProps {
    origin: string;
    destination: string;
    routePoints?: { lat: number; lng: number; location: string }[];
}

export function WeatherPanel({ origin, destination, routePoints = [] }: WeatherPanelProps) {
    const [originWeather, setOriginWeather] = useState<WeatherInfo | null>(null);
    const [destWeather, setDestWeather] = useState<WeatherInfo | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (origin && destination) {
            fetchWeatherForLocations();
        }
    }, [origin, destination]);

    const fetchWeatherForLocations = async () => {
        setLoading(true);
        try {
            // Geocode locations first
            const originCoords = await geocodeLocation(origin);
            const destCoords = await geocodeLocation(destination);

            if (originCoords && destCoords) {
                const [originWeatherData, destWeatherData] = await Promise.all([
                    fetchWeatherData(originCoords.lat, originCoords.lng, origin),
                    fetchWeatherData(destCoords.lat, destCoords.lng, destination)
                ]);

                setOriginWeather(originWeatherData);
                setDestWeather(destWeatherData);
            }
        } catch (error) {
            console.error('Weather fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const geocodeLocation = async (location: string) => {
        try {
            const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY || '3ad83ef7501ff2cbaeb5b8413d232a9c';
            const response = await fetch(
                `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${apiKey}`
            );
            const data = await response.json();
            return data[0] ? { lat: data[0].lat, lng: data[0].lon } : null;
        } catch (error) {
            console.error('Geocoding error:', error);
            return null;
        }
    };

    const fetchWeatherData = async (lat: number, lng: number, locationName: string): Promise<WeatherInfo | null> => {
        try {
            const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY || '3ad83ef7501ff2cbaeb5b8413d232a9c';
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`
            );
            const data = await response.json();

            return {
                location: locationName,
                temp: Math.round(data.main.temp),
                condition: data.weather[0].main,
                humidity: data.main.humidity,
                windSpeed: Math.round(data.wind.speed * 3.6) // Convert m/s to km/h
            };
        } catch (error) {
            console.error('Weather data fetch error:', error);
            return null;
        }
    };

    const getWeatherIcon = (condition: string) => {
        switch (condition.toLowerCase()) {
            case 'clear': return <Sun className="h-5 w-5 text-yellow-500" />;
            case 'rain': return <CloudRain className="h-5 w-5 text-blue-500" />;
            case 'clouds': return <Cloud className="h-5 w-5 text-gray-500" />;
            default: return <Thermometer className="h-5 w-5 text-gray-500" />;
        }
    };

    if (!origin || !destination) return null;

    return (
        <>
            <div className="fixed top-6 right-2 sm:right-6 z-50 w-72 sm:w-80">
                <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg p-4 shadow-lg">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Cloud className="h-4 w-4 mr-2" />
                        Route Weather
                    </h3>

                    {loading ? (
                        <div className="text-sm text-gray-600">Loading weather...</div>
                    ) : (
                        <div className="space-y-3">
                            {originWeather && (
                                <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">Origin</div>
                                        <div className="text-xs text-gray-600">{originWeather.location}</div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {getWeatherIcon(originWeather.condition)}
                                        <span className="text-sm font-semibold">{originWeather.temp}°C</span>
                                    </div>
                                </div>
                            )}

                            {destWeather && (
                                <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">Destination</div>
                                        <div className="text-xs text-gray-600">{destWeather.location}</div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {getWeatherIcon(destWeather.condition)}
                                        <span className="text-sm font-semibold">{destWeather.temp}°C</span>
                                    </div>
                                </div>
                            )}

                            {originWeather && destWeather && (
                                <div className="pt-2 border-t border-gray-200">
                                    <div className="text-xs text-gray-600">
                                        Temperature difference: {Math.abs(destWeather.temp - originWeather.temp)}°C
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <WeatherAlerts routePoints={routePoints} />
        </>
    );
}