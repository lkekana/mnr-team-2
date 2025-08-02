'use client';
import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import SidebarNav from "../nav/page";

const AnalyticsPage = () => {
  // Example data (can be dynamic from Supabase or other API)
  const pointHistory = [
    { date: "2025-07-25", points: 120 },
    { date: "2025-07-26", points: 130 },
    { date: "2025-07-27", points: 115 },
    { date: "2025-07-28", points: 145 },
    { date: "2025-07-29", points: 160 },
    { date: "2025-07-30", points: 158 },
    { date: "2025-07-31", points: 170 },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <SidebarNav />
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Your Analytics</h1>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-2">Accumulated Points Over Time</h2>
        
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={pointHistory} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value) => [`${value} pts`, "Points"]}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="points"
              stroke="#4F46E5"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsPage;
