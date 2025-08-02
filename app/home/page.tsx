"use client"; 
// app/page.jsx (Next.js App Router) or pages/index.js (Pages Router)
import { FaCloudSun, FaCarCrash } from "react-icons/fa";
import SidebarNav from "../nav/page";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  return (
    <main className="min-h-screen flex flex-col bg-gray-100 text-gray-900">
      <SidebarNav/>
      {/* Top Half */}
      <section className="flex-1 flex items-center justify-center bg-blue-300 text-white text-3xl font-bold">
        thisis?
      </section>

      {/* Bottom Half */}
      <section className="flex-1 bg-white p-4">
        <h2 className="text-xl font-semibold mb-4 items-center justify-center mb-2">Alerts</h2>

        <div className="grid grid-cols-2 gap-4">
          {/* Weather Card */}
          <div onClick={() => router.push("/weather-alert")} className="bg-blue-100 rounded-xl flex flex-col items-center justify-center py-6 shadow-md">
            <span className="text-lg font-medium mb-2">Weather</span>
            <FaCloudSun className="text-4xl text-blue-500" />
          </div>

          {/* Accident Card */}
          <div onClick={() => router.push("/safety-area")} className="bg-red-100 rounded-xl flex flex-col items-center justify-center py-6 shadow-md">
            <span className="text-lg font-medium mb-2">Area Safety</span>
            <FaCarCrash className="text-4xl text-red-500" />
          </div>
        </div>
      </section>
    </main>
  );
}
