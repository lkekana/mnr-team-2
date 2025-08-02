import React, { useEffect, useState } from 'react';
import { useMap } from '@vis.gl/react-google-maps';

interface WeatherData {
    lat: number;
    lng: number;
    temp: number;
    condition: string;
    icon: string;
}

interface WeatherOverlayProps {
    routePoints: google.maps.LatLng[];
}

export function WeatherOverlay({ routePoints }: WeatherOverlayProps) {
    const map = useMap();
    const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
    const [weatherMarkers, setWeatherMarkers] = useState<google.maps.Marker[]>([]);

    useEffect(() => {
        if (!map || !routePoints.length) return;

        // Sample every 5th point to avoid too many API calls
        const samplePoints = routePoints.filter((_, index) => index % 5 === 0);
        
        fetchWeatherForPoints(samplePoints);
    }, [map, routePoints]);

    const fetchWeatherForPoints = async (points: google.maps.LatLng[]) => {
        const weatherPromises = points.map(async (point) => {
            try {
                // Using OpenWeatherMap API (free tier)
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${point.lat()}&lon=${point.lng()}&appid=3ad83ef7501ff2cbaeb5b8413d232a9c&units=metric`
                );
                const data = await response.json();
                
                return {
                    lat: point.lat(),
                    lng: point.lng(),
                    temp: Math.round(data.main.temp),
                    condition: data.weather[0].main,
                    icon: data.weather[0].icon
                };
            } catch (error) {
                console.error('Weather fetch error:', error);
                return null;
            }
        });

        const results = await Promise.all(weatherPromises);
        const validWeather = results.filter(Boolean) as WeatherData[];
        setWeatherData(validWeather);
        displayWeatherMarkers(validWeather);
    };

    const displayWeatherMarkers = (weather: WeatherData[]) => {
        // Clear existing markers
        weatherMarkers.forEach(marker => marker.setMap(null));

        const newMarkers = weather.map(data => {
            const marker = new google.maps.Marker({
                position: { lat: data.lat, lng: data.lng },
                map: map,
                icon: {
                    url: `https://openweathermap.org/img/wn/${data.icon}@2x.png`,
                    scaledSize: new google.maps.Size(40, 40),
                },
                title: `${data.temp}°C - ${data.condition}`
            });

            // Add info window
            const infoWindow = new google.maps.InfoWindow({
                content: `
                    <div class="p-2">
                        <div class="font-semibold">${data.temp}°C</div>
                        <div class="text-sm text-gray-600">${data.condition}</div>
                    </div>
                `
            });

            marker.addListener('click', () => {
                infoWindow.open(map, marker);
            });

            return marker;
        });

        setWeatherMarkers(newMarkers);
    };

    return null;
}