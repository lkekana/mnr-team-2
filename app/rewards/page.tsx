'use client';

import { useState } from 'react';
import { Circle } from 'rc-progress';
import { ChevronRight } from 'lucide-react';

export default function RewardsPage() {
  const [score] = useState(265); // Example score

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Travel Risk Score */}
      <div className="bg-white rounded-2xl shadow p-5 mb-6">
        <h2 className="text-xl font-bold mb-2">Travel Risk Score</h2>
        <p className="text-gray-600">Current score based on your recent activity</p>
        <div className="w-36 h-36 mx-auto my-4 relative">
          <Circle
            percent={(score / 400) * 100}
            strokeWidth={10}
            trailWidth={10}
            strokeColor="#4F46E5"
            trailColor="#E5E7EB"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center">
            <span className="text-2xl font-bold">{score}</span>
            <span className="text-sm text-gray-500">/ 400</span>
          </div>
        </div>
      </div>

      {/* Rewards History */}
      <div className="bg-white rounded-2xl shadow p-5 mb-6">
        <h2 className="text-xl font-bold mb-4">Rewards History</h2>
        <ul className="space-y-3">
          <li className="flex items-center justify-between text-gray-700">
            <div>
              <p className="font-medium">Completed 5 safe travels</p>
              <p className="text-sm text-gray-400">Jul 22, 2025</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </li>
          <li className="flex items-center justify-between text-gray-700">
            <div>
              <p className="font-medium">Reached Weekly Goal</p>
              <p className="text-sm text-gray-400">Jul 15, 2025</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </li>
        </ul>
      </div>

      {/* Weekly & Monthly Goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl shadow p-5">
          <h3 className="text-lg font-semibold mb-2">Weekly Goal</h3>
          <p className="text-sm text-gray-600">Complete 3 journeys with zero incidents.</p>
          <div className="mt-2 text-sm text-green-600 font-semibold">Progress: 2/3</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-5">
          <h3 className="text-lg font-semibold mb-2">Monthly Goal</h3>
          <p className="text-sm text-gray-600">Maintain a risk score under 200 for 4 weeks.</p>
          <div className="mt-2 text-sm text-orange-600 font-semibold">Progress: Week 2/4</div>
        </div>
      </div>

      {/* How to Get Rewarded */}
      <div className="bg-white rounded-2xl shadow p-5">
        <h2 className="text-xl font-bold mb-3">How to Get Rewarded</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Keep your travel risk score low (under 200).</li>
          <li>Complete weekly and monthly safety challenges.</li>
          <li>Avoid any risky behavior or flagged events.</li>
          <li>Track your progress and redeem rewards often.</li>
        </ul>
      </div>
    </div>
  );
}
