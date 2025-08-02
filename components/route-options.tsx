import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

interface RouteOptionsProps {
    onOptionsChange: (options: RoutePreferences) => void;
}

export interface RoutePreferences {
    prioritizeSafety: boolean;
    avoidHighways: boolean;
    avoidTolls: boolean;
    avoidFerries: boolean;
    preferMajorCities: boolean;
    maxTravelTime: number; // in hours
}

export function RouteOptions({ onOptionsChange }: RouteOptionsProps) {
    const [showOptions, setShowOptions] = React.useState(false);
    const [preferences, setPreferences] = React.useState<RoutePreferences>({
        prioritizeSafety: true,
        avoidHighways: false,
        avoidTolls: false,
        avoidFerries: true,
        preferMajorCities: true,
        maxTravelTime: 8
    });

    const handlePreferenceChange = (key: keyof RoutePreferences, value: boolean | number) => {
        const newPreferences = { ...preferences, [key]: value };
        setPreferences(newPreferences);
        onOptionsChange(newPreferences);
    };

    return (
        <div className="fixed top-6 right-6 z-50">
            <Button
                onClick={() => setShowOptions(!showOptions)}
                className="bg-white/80 hover:bg-white text-black border border-gray-300 rounded-full p-3"
            >
                <Settings className="h-5 w-5" />
            </Button>

            {showOptions && (
                <div className="absolute top-12 right-0 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg p-4 w-64 shadow-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">Route Preferences</h3>
                    
                    <div className="space-y-3">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={preferences.prioritizeSafety}
                                onChange={(e) => handlePreferenceChange('prioritizeSafety', e.target.checked)}
                                className="rounded"
                            />
                            <span className="text-sm">Prioritize Safety</span>
                        </label>

                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={preferences.avoidHighways}
                                onChange={(e) => handlePreferenceChange('avoidHighways', e.target.checked)}
                                className="rounded"
                            />
                            <span className="text-sm">Avoid Highways</span>
                        </label>

                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={preferences.avoidTolls}
                                onChange={(e) => handlePreferenceChange('avoidTolls', e.target.checked)}
                                className="rounded"
                            />
                            <span className="text-sm">Avoid Toll Roads</span>
                        </label>

                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={preferences.preferMajorCities}
                                onChange={(e) => handlePreferenceChange('preferMajorCities', e.target.checked)}
                                className="rounded"
                            />
                            <span className="text-sm">Prefer Major Cities</span>
                        </label>

                        <div>
                            <label className="text-sm text-gray-700">Max Travel Time: {preferences.maxTravelTime}h</label>
                            <input
                                type="range"
                                min="1"
                                max="12"
                                value={preferences.maxTravelTime}
                                onChange={(e) => handlePreferenceChange('maxTravelTime', parseInt(e.target.value))}
                                className="w-full mt-1"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}