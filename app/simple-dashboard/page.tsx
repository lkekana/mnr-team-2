// "use client";
// import { getUserLocation } from "@/lib/utils";
// import { useEffect } from "react"

export default function DashboardPage() {
  
  // useEffect(() => {
  //   getUserLocation().then((position) => {
  //     if (position) {
  //       console.log("User's location:", position.coords);
  //     } else {
  //       console.log("Location not available.");
  //     }
  //   });
  // }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
          
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-600 mb-4">
                🎉 Welcome to your Hackathon Dashboard!
              </h2>
              <p className="text-gray-500 mb-6">
                Your login is working perfectly. Let's build the rest of your features!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-800">Total Alerts</h3>
                  <p className="text-3xl font-bold text-blue-600 mt-2">12</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-800">Tests Completed</h3>
                  <p className="text-3xl font-bold text-green-600 mt-2">8</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-800">Profile Complete</h3>
                  <p className="text-3xl font-bold text-purple-600 mt-2">85%</p>
                </div>
              </div>
              
              <div className="mt-8">
              <p className="text-sm text-gray-600">
                Navigate to: 
                <a href="/dashboard" className="text-blue-600 hover:underline ml-2">Dashboard</a> | 
                <a href="/" className="text-blue-600 hover:underline ml-2">Home</a> |
                <a href="/destinations" className="text-blue-600 hover:underline ml-2">Destinations</a>
              </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}