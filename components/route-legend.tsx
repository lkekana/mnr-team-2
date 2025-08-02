import React from 'react';

export function RouteLegend() {
    return (
        <div className="fixed bottom-6 left-6 z-50 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-4 shadow-lg">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Route Legend</h3>
            
            <div className="space-y-2">
                <div className="flex items-center space-x-2">
                    <div className="w-4 h-1 bg-blue-500 rounded"></div>
                    <span className="text-xs text-gray-700">Main Route (Fastest)</span>
                </div>
                
                <div className="flex items-center space-x-2">
                    <div className="w-4 h-1 bg-green-500 rounded opacity-60"></div>
                    <span className="text-xs text-gray-700">Safety Priority</span>
                </div>
                
                <div className="flex items-center space-x-2">
                    <div className="w-4 h-1 bg-yellow-500 rounded opacity-60"></div>
                    <span className="text-xs text-gray-700">Least Complex</span>
                </div>
            </div>
        </div>
    );
}