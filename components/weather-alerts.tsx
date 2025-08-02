import React, { useEffect, useState } from 'react';
import { AlertTriangle, Cloud, CloudRain, Wind, X } from 'lucide-react';

interface WeatherAlert {
    id: string;
    type: 'hail' | 'heavy_rain' | 'flood' | 'high_winds';
    severity: 'moderate' | 'severe' | 'extreme';
    location: string;
    message: string;
    action: string;
}

interface WeatherAlertsProps {
    routePoints: { lat: number; lng: number; location: string }[];
}

export function WeatherAlerts({ routePoints }: WeatherAlertsProps) {
    const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
    const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (routePoints.length > 0) {
            checkWeatherHazards();
        }
    }, [routePoints]);

    const checkWeatherHazards = async () => {
        const newAlerts: WeatherAlert[] = [];

        for (const point of routePoints) {
            try {
                const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY || '3ad83ef7501ff2cbaeb5b8413d232a9c';
                
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${point.lat}&lon=${point.lng}&appid=${apiKey}&units=metric`
                );
                
                if (!response.ok) {
                    console.error('Weather API error:', response.status);
                    continue;
                }
                
                const data = await response.json();
                const hazards = analyzeWeatherHazards(data, point.location);
                newAlerts.push(...hazards);
            } catch (error) {
                console.error('Weather hazard check error:', error);
            }
        }

        console.log('Weather alerts found:', newAlerts);
        setAlerts(newAlerts);
    };

    const analyzeWeatherHazards = (weatherData: any, location: string): WeatherAlert[] => {
        const hazards: WeatherAlert[] = [];
        const weather = weatherData.weather[0];
        const main = weatherData.main;
        const wind = weatherData.wind || {};

        // Heavy Rain Detection - only if actually raining
        if (weather.main === 'Rain' && weatherData.rain?.['1h']) {

            const rainAmount = weatherData.rain['1h'];

            if (rainAmount > 10) {
                hazards.push({
                    id: `rain-${location}`,
                    type: 'heavy_rain',
                    severity: rainAmount > 20 ? 'severe' : 'moderate',
                    location,
                    message: `Heavy rainfall detected (${rainAmount}mm/h)`,
                    action: 'Consider delaying travel or taking alternative route'
                });
            }
        }

        // Thunderstorm with potential hail
        if (weather.main === 'Thunderstorm' || weather.description.toLowerCase().includes('hail')) {

            hazards.push({
                id: `storm-${location}`,
                type: 'hail',
                severity: 'severe',
                location,
                message: 'Thunderstorm conditions - potential hail risk',
                action: 'Seek shelter immediately. Avoid travel if possible.'
            });
        }

        // High Winds Detection
        if (wind.speed && wind.speed > 15) { // 15 m/s = ~54 km/h

            hazards.push({
                id: `wind-${location}`,
                type: 'high_winds',
                severity: wind.speed > 25 ? 'extreme' : 'severe',
                location,
                message: `High winds detected (${Math.round(wind.speed * 3.6)} km/h)`,
                action: 'Exercise extreme caution. Avoid high-profile vehicles.'
            });
        }

        // Flood Risk - only with significant rainfall
        if (weather.main === 'Rain' && weatherData.rain?.['1h'] && weatherData.rain['1h'] > 15) {
            hazards.push({
                id: `flood-${location}`,
                type: 'flood',
                severity: 'moderate',
                location,
                message: 'Potential flooding risk due to heavy rainfall',
                action: 'Avoid low-lying areas and underpasses'
            });
        }

        return hazards;
    };

    const getAlertIcon = (type: string) => {
        switch (type) {
            case 'hail': return <Cloud className="h-5 w-5" />;
            case 'heavy_rain': return <CloudRain className="h-5 w-5" />;
            case 'flood': return <CloudRain className="h-5 w-5" />;
            case 'high_winds': return <Wind className="h-5 w-5" />;
            default: return <AlertTriangle className="h-5 w-5" />;
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'moderate': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
            case 'severe': return 'bg-orange-50 border-orange-200 text-orange-800';
            case 'extreme': return 'bg-red-50 border-red-200 text-red-800';
            default: return 'bg-gray-50 border-gray-200 text-gray-800';
        }
    };

    const dismissAlert = (alertId: string) => {
        setDismissedAlerts(prev => new Set([...prev, alertId]));
    };

    const visibleAlerts = alerts.filter(alert => !dismissedAlerts.has(alert.id));

    if (visibleAlerts.length === 0) return null;

    return (
        <div className="fixed top-6 right-6 z-40 w-80 space-y-2" style={{marginTop: '280px'}}>
            {visibleAlerts.map((alert) => (
                <div
                    key={alert.id}
                    className={`border rounded-lg p-4 shadow-lg backdrop-blur-sm ${getSeverityColor(alert.severity)}`}
                >
                    <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-0.5">
                                {getAlertIcon(alert.type)}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                    <h4 className="font-semibold text-sm">Weather Hazard Alert</h4>
                                    <span className="text-xs px-2 py-1 rounded-full bg-white/50 font-medium">
                                        {alert.severity.toUpperCase()}
                                    </span>
                                </div>
                                <p className="text-sm mt-1 font-medium">{alert.message}</p>
                                <p className="text-xs mt-1 opacity-75">Near: {alert.location}</p>
                                <div className="mt-2 p-2 bg-white/30 rounded text-xs">
                                    <strong>Action:</strong> {alert.action}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => dismissAlert(alert.id)}
                            className="flex-shrink-0 ml-2 p-1 hover:bg-white/20 rounded"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}