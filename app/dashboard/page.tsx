"use client"

import { useState, useEffect } from "react"
import axios from "axios"

// Convert your existing Dashboard component to Next.js page
export default function Dashboard() {
  const [apiStatus, setApiStatus] = useState("checking...")
  const [apiData, setApiData] = useState(null)

  useEffect(() => {
    const checkAPI = async () => {
      try {
        const baseURL = process.env.NEXT_PUBLIC_API_URL || "https://gamesyncsphere-production.up.railway.app"
        const response = await axios.get(`${baseURL}/api/test`)
        setApiStatus("connected ✅")
        setApiData(response.data)
        console.log("API Response:", response.data)
      } catch (error) {
        setApiStatus("disconnected ❌")
        console.error("API Error:", error)
      }
    }

    checkAPI()
  }, [])

  return (
    <div className="min-h-screen bg-charcoal text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 holographic-text">GameSyncSphere Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* API Status Card */}
          <div className="holographic-card p-6">
            <h3 className="text-xl font-semibold mb-4 text-white">API Status</h3>
            <p className="text-gray-300">Backend connection: {apiStatus}</p>
            {apiData && (
              <div className="mt-4 text-sm text-gray-400">
                <p>Message: {apiData.message}</p>
                <p>Features: {apiData.features?.join(", ")}</p>
              </div>
            )}
          </div>

          {/* Gaming Analytics Card */}
          <div className="holographic-card p-6">
            <h3 className="text-xl font-semibold mb-4 text-white">Gaming Analytics</h3>
            <p className="text-gray-300 mb-4">Cross-platform gaming insights and performance tracking</p>
            <button className="holographic-button px-4 py-2 text-white">View Analytics</button>
          </div>

          {/* Data Monetization Card */}
          <div className="holographic-card p-6">
            <h3 className="text-xl font-semibold mb-4 text-white">Data Monetization</h3>
            <p className="text-gray-300 mb-4">Earn money from your gaming data and survey participation</p>
            <button className="holographic-button px-4 py-2 text-white bg-green-600">View Earnings</button>
          </div>
        </div>

        {/* Implementation Progress */}
        <div className="mt-8 bg-yellow-500/10 border-l-4 border-yellow-500 p-6 rounded">
          <h3 className="text-lg font-semibold text-yellow-400 mb-2">Implementation Progress</h3>
          <ul className="text-yellow-300 space-y-1">
            <li>✅ Basic server setup</li>
            <li>✅ Frontend foundation</li>
            <li>✅ API health monitoring</li>
            <li>⏳ Gaming API integrations (Steam, Xbox, PlayStation)</li>
            <li>⏳ AI survey generation system</li>
            <li>⏳ Data monetization platform</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
