"use client"

import { Sun, CloudRain } from "lucide-react"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Sun className="h-8 w-8 text-yellow-500" />
              <CloudRain className="absolute -bottom-1 -right-1 h-4 w-4 text-blue-500" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SkyNow
            </span>
          </div>

          {/* Center Text - Desktop */}
          <div className="hidden md:block">
            <h1 className="text-lg font-medium text-gray-700">Real-time Weather Forecasts & Alerts</h1>
          </div>

          {/* Right Side Info */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-sm text-gray-600">Accurate • Reliable • Fast</div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Live Data"></div>
          </div>
        </div>

        {/* Mobile Center Text */}
        <div className="md:hidden pb-2">
          <p className="text-sm text-gray-600 text-center">Real-time Weather Forecasts & Alerts</p>
        </div>
      </div>
    </header>
  )
}
