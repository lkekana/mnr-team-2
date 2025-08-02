import { FaCarSide } from 'react-icons/fa'
import { WeatherPanel } from '@/components/weather-panel'
import { RouteLegend } from '@/components/route-legend'

export function RouteCard({
  route,
  onSelect,
  origin,
  destination
}: {
  route: {
    time: string
    distance: string
    score: number
    color: string // tailwind color name e.g. 'green'
  },
  onSelect: () => void
  origin: string
  destination: string
}) {
  return (
    <div className="p-4 rounded-lg shadow-md border bg-white w-full max-w-md">
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>🚗 {route.time}</span>
        <span>📏 {route.distance}</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mb-3">
        <div
          className={`h-full rounded-full bg-${route.color}-500`}
          style={{ width: `${route.score}%` }}
        ></div>
      </div>

      <button
        onClick={onSelect}
        className={`mt-2 w-full px-4 py-2 rounded-lg bg-${route.color}-600 text-white hover:opacity-90 flex items-center justify-center`}
      >
        <FaCarSide className="mr-2" />
        Choose Route
      </button>

      {/* Embedded Weather & Legend Components */}
      <div className="mt-4">
        <WeatherPanel origin={origin} destination={destination} />
      </div>

      <div className="mt-2">
        <RouteLegend />
      </div>
    </div>
  )
}