"use client"

import type React from "react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Header from "@/components/header"
import {
  MapPin,
  Search,
  Sun,
  Thermometer,
  Droplets,
  Wind,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  AlertTriangle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Umbrella,
  Cloud,
  CloudRain,
  Snowflake,
  Zap,
} from "lucide-react"

interface WeatherData {
  source?: string
  timezone?: string | number | null
  current: {
    temp: number
    feels_like: number
    humidity: number
    pressure: number
    uvi?: number
    wind_speed: number
    wind_deg?: number
    wind_dir?: string
    weather: Array<{
      main: string
      description: string
      icon: string
    }>
    sunrise: number
    sunset: number
    sunrise_time?: string
    sunset_time?: string
  }
  hourly: Array<{
    dt: number
    temp: number
    weather: Array<{
      main: string
      description: string
      icon: string
    }>
    pop: number
    humidity: number
    wind_speed: number
    wind_deg?: number
    uv?: number
  }>
  daily: Array<{
    dt: number
    temp: {
      min: number
      max: number
    }
    weather: Array<{
      main: string
      description: string
      icon: string
    }>
    pop: number
    humidity: number
    wind_speed: number
    sunrise: number
    sunset: number
    sunrise_time?: string
    sunset_time?: string
    sunrise_utc?: boolean
    sunset_utc?: boolean
    sunrise_estimated?: boolean
    sunset_estimated?: boolean
    uv?: number
    source?: string
    hourly?: Array<{
      dt: number
      temp: number
      weather: {
        main: string
        description: string
        icon: string
      }
      pop: number
      humidity: number
      wind_speed: number
    }>
  }>
  location?: {
    name: string
    country: string
    region?: string
    timezone?: string
  }
}

const WeatherLoadingScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center">
    <div className="flex flex-col items-center gap-6 max-w-md px-4">
      {/* Animated Weather Illustration */}
      <div className="relative w-40 h-40">
        {/* Sun */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
          <div className="w-16 h-16 bg-yellow-300 rounded-full shadow-lg animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-4 h-2 bg-yellow-400 rounded-full"
                style={{
                  transform: `rotate(${i * 45}deg) translateX(24px)`,
                }}
              />
            ))}
          </div>
        </div>
        {/* Cloud */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="relative">
            <div className="w-32 h-12 bg-white rounded-full shadow-md" />
            <div className="absolute -top-4 left-4 w-10 h-10 bg-white rounded-full" />
            <div className="absolute -top-4 right-4 w-8 h-8 bg-white rounded-full" />
            {/* Falling rain animation */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute bottom-0 w-1 h-6 bg-blue-300 rounded-full animate-rain"
                style={{
                  left: `${10 + i * 20}px`,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Loading Text */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Weather Data</h2>
        <p className="text-gray-600">Getting the latest forecast for you...</p>
      </div>

      {/* Animated Progress */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className="bg-blue-500 h-2 rounded-full animate-progress" style={{ width: "0%" }} />
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes rain {
          0% { transform: translateY(0) scaleY(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(40px) scaleY(1); opacity: 0; }
        }
        .animate-rain {
          animation: rain 1.5s linear infinite;
        }
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  </div>
)

export default function WeatherPage() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [expandedDay, setExpandedDay] = useState<number | null>(null)
  const [fallbackIcon, setFallbackIcon] = useState<Record<string, boolean>>({})

  // Load default city weather on component mount
  useEffect(() => {
    const loadDefaultWeather = async () => {
      try {
        setLoading(true)
        setError(null)

        // Default to London - a well-known international city
        const response = await fetch(`/api/forecast?query=${encodeURIComponent("London")}`)

        if (!response.ok) {
          // If London fails, try Delhi as backup
          const backupResponse = await fetch(`/api/forecast?query=${encodeURIComponent("Delhi")}`)

          if (!backupResponse.ok) {
            throw new Error("Failed to fetch default weather data")
          }

          const backupData = await backupResponse.json()
          setWeatherData(backupData)
          return
        }

        const data = await response.json()
        setWeatherData(data)
      } catch (err) {
        console.error("Default weather load error:", err)
        setError("Unable to load default weather. Please search for a city.")
      } finally {
        setLoading(false)
      }
    }

    loadDefaultWeather()
  }, [])

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    try {
      setIsSearching(true)
      setError(null)
      setFallbackIcon({})
      setExpandedDay(null)

      const response = await fetch(`/api/forecast?query=${encodeURIComponent(searchQuery)}`)

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage = "Failed to fetch weather data"

        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.error || errorMessage
        } catch {
          errorMessage = "Weather service is currently unavailable"
        }

        throw new Error(errorMessage)
      }

      const data = await response.json()
      setWeatherData(data)
    } catch (err) {
      console.error("Search error:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsSearching(false)
    }
  }

  const handleImageError = (iconUrl: string) => {
    setFallbackIcon((prev) => ({ ...prev, [iconUrl]: true }))
  }

  const getWeatherIcon = (iconCode: string, size: "sm" | "md" | "lg" = "md") => {
    const sizeClasses = {
      sm: "h-5 w-5",
      md: "h-8 w-8",
      lg: "h-16 w-16",
    }

    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
      "01d": Sun,
      "01n": Sun,
      "02d": Cloud,
      "02n": Cloud,
      "03d": Cloud,
      "03n": Cloud,
      "04d": Cloud,
      "04n": Cloud,
      "09d": CloudRain,
      "09n": CloudRain,
      "10d": CloudRain,
      "10n": CloudRain,
      "11d": Zap,
      "11n": Zap,
      "13d": Snowflake,
      "13n": Snowflake,
      "50d": Cloud,
      "50n": Cloud,
    }

    let code = iconCode
    if (iconCode.includes("openweathermap.org")) {
      const match = iconCode.match(/\/([^/]+)@2x\.png$/)
      code = match ? match[1] : "01d"
    }

    const IconComponent = iconMap[code] || Cloud
    const colorClass = code.includes("01")
      ? "text-yellow-500"
      : code.includes("09") || code.includes("10")
        ? "text-blue-500"
        : code.includes("11")
          ? "text-purple-500"
          : code.includes("13")
            ? "text-blue-200"
            : "text-gray-500"

    return <IconComponent className={`${sizeClasses[size]} ${colorClass}`} />
  }

  const renderWeatherIcon = (iconUrl: string, description: string, size = "h-8 w-8") => {
    if (fallbackIcon[iconUrl]) {
      if (iconUrl.includes("openweathermap.org")) {
        const match = iconUrl.match(/\/([^/]+)@2x\.png$/)
        const code = match ? match[1] : "01d"
        return getWeatherIcon(code, "md")
      }

      const condition = iconUrl.toLowerCase()
      if (condition.includes("sunny") || condition.includes("clear")) {
        return <Sun className={`${size} text-yellow-500`} />
      } else if (condition.includes("rain")) {
        return <CloudRain className={`${size} text-blue-500`} />
      } else if (condition.includes("snow")) {
        return <Snowflake className={`${size} text-blue-200`} />
      } else if (condition.includes("thunder")) {
        return <Zap className={`${size} text-purple-500`} />
      } else {
        return <Cloud className={`${size} text-gray-500`} />
      }
    }

    return (
      <Image
        src={iconUrl || "/placeholder.svg"}
        alt={description}
        width={32}
        height={32}
        className={size}
        onError={() => handleImageError(iconUrl)}
        unoptimized
      />
    )
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
      hour: "numeric",
      hour12: true,
    })
  }

  const formatShortDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) return "Today"
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow"

    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
  }

  const getWindDirection = (degrees: number) => {
    const directions = [
      "N",
      "NNE",
      "NE",
      "ENE",
      "E",
      "ESE",
      "SE",
      "SSE",
      "S",
      "SSW",
      "SW",
      "WSW",
      "W",
      "WNW",
      "NW",
      "NNW",
    ]
    const index = Math.round(degrees / 22.5) % 16
    return directions[index]
  }

  const getUVLevel = (uvi: number) => {
    if (uvi <= 2) return { level: "Low", color: "text-green-600" }
    if (uvi <= 5) return { level: "Moderate", color: "text-yellow-600" }
    if (uvi <= 7) return { level: "High", color: "text-orange-600" }
    if (uvi <= 10) return { level: "Very High", color: "text-red-600" }
    return { level: "Extreme", color: "text-purple-600" }
  }

  const getHumidityLevel = (humidity: number) => {
    if (humidity <= 30) return "Low"
    if (humidity <= 60) return "Moderate"
    return "High"
  }

  const getDayHourlyData = (dayIndex: number) => {
    if (!weatherData) return []

    const day = weatherData.daily[dayIndex]
    if (day.hourly && day.hourly.length > 0) {
      return day.hourly
    }

    const dayStart = day.dt
    const dayEnd = dayStart + 24 * 60 * 60
    return weatherData.hourly.filter((hour) => hour.dt >= dayStart && hour.dt < dayEnd)
  }

  const getNext24Hours = () => {
    if (!weatherData) return []

    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(23, 59, 59)

    return weatherData.hourly
      .filter((hour) => {
        const hourDate = new Date(hour.dt * 1000)
        return hourDate <= tomorrow
      })
      .slice(0, 24)
  }

  const getDayCardBackground = (index: number) => {
    const backgrounds = [
      "bg-sky-100 border-sky-300",
      "bg-emerald-100 border-emerald-300",
      "bg-indigo-100 border-indigo-300",
      "bg-amber-100 border-amber-300",
      "bg-rose-100 border-rose-300",
    ]
    return backgrounds[index % backgrounds.length]
  }

  const renderSunTime = (
    time: string | undefined,
    isUTC: boolean | undefined,
    isEstimated: boolean | undefined,
    icon: React.ReactNode,
    isMobile = false,
  ) => {
    if (!time) return null

    const showBadge = isUTC || isEstimated
    const badgeText = isEstimated ? "EST" : "UTC"
    const badgeColor = isEstimated ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"

    return (
      <div className="flex items-center gap-2">
        {icon}
        <div className="min-w-0 flex-1">
          <div className={`font-semibold text-gray-900 ${isMobile ? "flex flex-col" : "flex items-center gap-1"}`}>
            <span className="truncate">{time}</span>
            {showBadge && (
              <Badge
                variant="secondary"
                className={`${badgeColor} text-xs px-1 py-0 h-4 ${isMobile ? "self-start mt-0.5" : ""}`}
              >
                {badgeText}
              </Badge>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return <WeatherLoadingScreen />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-4 px-3 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Search Bar */}
          <Card className="shadow-sm border-gray-100">
            <CardContent className="p-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by city name (e.g., Delhi, Mumbai, Bangalore)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-gray-200"
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <Button onClick={handleSearch} disabled={isSearching} className="bg-blue-600 hover:bg-blue-700">
                  {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {weatherData && (
            <>
              {/* Current Weather */}
              <Card className="shadow-md bg-gradient-to-br from-sky-50 to-gray-100 border border-gray-200/80 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-sky-600" />
                      <span className="font-medium text-gray-900">
                        {weatherData.location?.name}, {weatherData.location?.country}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-500">Now</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-6xl font-bold mb-2 text-gray-900">
                        {Math.round(weatherData.current.temp)}°C
                      </div>
                      <div className="text-lg font-medium text-gray-700 capitalize mb-1">
                        {weatherData.current.weather[0].description}
                      </div>
                      <div className="text-sm text-gray-600">
                        Feels like {Math.round(weatherData.current.feels_like)}°C
                      </div>
                      <div className="text-sm text-gray-600 mt-2">
                        High: {Math.round(weatherData.daily[0]?.temp.max || weatherData.current.temp)}° • Low:{" "}
                        {Math.round(weatherData.daily[0]?.temp.min || weatherData.current.temp)}°
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-center">
                      {renderWeatherIcon(
                        weatherData.current.weather[0].icon,
                        weatherData.current.weather[0].description,
                        "h-20 w-20 text-sky-500",
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sunrise & Sunset */}
              <Card className="bg-gradient-to-r from-orange-50 to-pink-50 border-orange-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900">Sunrise & Sunset</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Sunrise className="h-6 w-6 text-orange-500" />
                      <div>
                        <div className="text-sm text-gray-600">Sunrise</div>
                        <div className="text-lg font-semibold text-gray-900">
                          {weatherData.current.sunrise_time || formatTime(weatherData.current.sunrise)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Sunset className="h-6 w-6 text-pink-500" />
                      <div>
                        <div className="text-sm text-gray-600">Sunset</div>
                        <div className="text-lg font-semibold text-gray-900">
                          {weatherData.current.sunset_time || formatTime(weatherData.current.sunset)}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Next 24 Hours Forecast */}
              <Card className="bg-indigo-50 border-indigo-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Thermometer className="h-5 w-5 text-orange-600" />
                    Next 24 Hours Forecast
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <div className="flex gap-3 pb-2 min-w-max">
                      {getNext24Hours().map((hour, index) => (
                        <div
                          key={index}
                          className="flex flex-col items-center min-w-[80px] p-3 rounded-lg bg-white border border-indigo-100 hover:shadow-sm transition-all duration-200"
                        >
                          <div className="text-xs text-gray-600 mb-2 font-medium">
                            {index === 0 ? "Now" : formatTime(hour.dt)}
                          </div>
                          <div className="mb-2">
                            {renderWeatherIcon(hour.weather[0].icon, hour.weather[0].description, "h-14 w-14")}
                          </div>
                          <div className="text-lg font-bold text-gray-900 mb-1">{Math.round(hour.temp)}°</div>
                          {hour.pop > 0 && (
                            <div className="flex items-center gap-1 text-xs text-blue-600">
                              <Umbrella className="h-6 w-6" />
                              {Math.round(hour.pop * 100)}%
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 5-Day Forecast */}
              <Card className="bg-emerald-50 border-emerald-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Eye className="h-5 w-5 text-blue-600" />
                    {`${weatherData.daily.length}-Day Weather Forecast`}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {weatherData.daily.slice(0, 5).map((day, index) => (
                      <div key={index} className={`rounded-lg border overflow-hidden ${getDayCardBackground(index)}`}>
                        <div
                          className="flex items-center p-4 hover:bg-white/50 transition-colors cursor-pointer min-h-[80px]"
                          onClick={() => setExpandedDay(expandedDay === index ? null : index)}
                        >
                          {/* Left side - Date and Weather */}
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-24 sm:w-32 flex-shrink-0">
                              <div className="font-semibold text-gray-900 text-sm sm:text-base">
                                {formatShortDate(day.dt)}
                              </div>
                              <div className="text-xs sm:text-sm text-gray-600 leading-tight">
                                {day.weather[0].description}
                              </div>
                            </div>

                            {/* Weather Icon */}
                            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                              {renderWeatherIcon(day.weather[0].icon, day.weather[0].description, "h-14 w-14")}
                            </div>
                          </div>

                          {/* Right side - Temperature and Controls */}
                          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                            {/* Precipitation */}
                            {day.pop > 0 && (
                              <div className="hidden sm:flex items-center gap-1 text-blue-600 w-12 justify-center">
                                <Umbrella className="h-10 w-10" />
                                <span className="text-xs">{Math.round(day.pop * 100)}%</span>
                              </div>
                            )}
                            {/* Temperature */}
                            <div className="text-right w-16 sm:w-20">
                              <div className="flex items-center justify-end gap-1">
                                <span className="font-bold text-lg text-gray-900">{Math.round(day.temp.max)}°</span>
                                <span className="text-gray-500 text-sm">/{Math.round(day.temp.min)}°</span>
                              </div>
                              {/* Mobile precipitation */}
                              {day.pop > 0 && (
                                <div className="sm:hidden flex items-center justify-end gap-1 text-xs text-blue-600 mt-1">
                                  <Umbrella className="h-10 w-10" />
                                  {Math.round(day.pop * 100)}%
                                </div>
                              )}
                            </div>

                            {/* Expand button */}
                            <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                              {expandedDay === index ? (
                                <ChevronUp className="h-5 w-5 text-gray-400" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Daily Summary */}
                        <div className="border-t bg-white/60 p-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="flex items-center gap-2">
                              <Wind className="h-4 w-4 text-blue-600 flex-shrink-0" />
                              <div className="min-w-0">
                                <div className="text-xs text-gray-600">Max Wind</div>
                                <div className="font-semibold text-gray-900 truncate">
                                  {Math.round(day.wind_speed)} m/s
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Droplets className="h-4 w-4 text-cyan-600 flex-shrink-0" />
                              <div className="min-w-0">
                                <div className="text-xs text-gray-600">Humidity</div>
                                <div className="font-semibold text-gray-900 truncate">{day.humidity}%</div>
                              </div>
                            </div>

                            {/* Mobile-optimized sunrise/sunset layout */}
                            <div className="md:hidden col-span-2">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <div className="text-xs text-gray-600 mb-1">Sunrise</div>
                                  {renderSunTime(
                                    day.sunrise_time,
                                    day.sunrise_utc,
                                    day.sunrise_estimated,
                                    <Sunrise className="h-4 w-4 text-orange-600 flex-shrink-0" />,
                                    true,
                                  )}
                                </div>
                                <div>
                                  <div className="text-xs text-gray-600 mb-1">Sunset</div>
                                  {renderSunTime(
                                    day.sunset_time,
                                    day.sunset_utc,
                                    day.sunset_estimated,
                                    <Sunset className="h-4 w-4 text-pink-600 flex-shrink-0" />,
                                    true,
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Desktop sunrise/sunset layout */}
                            <div className="hidden md:flex items-center gap-2">
                              <Sunrise className="h-4 w-4 text-orange-600 flex-shrink-0" />
                              <div className="min-w-0">
                                <div className="text-xs text-gray-600">Sunrise</div>
                                {renderSunTime(day.sunrise_time, day.sunrise_utc, day.sunrise_estimated, null)}
                              </div>
                            </div>

                            <div className="hidden md:flex items-center gap-2">
                              <Sunset className="h-4 w-4 text-pink-600 flex-shrink-0" />
                              <div className="min-w-0">
                                <div className="text-xs text-gray-600">Sunset</div>
                                {renderSunTime(day.sunset_time, day.sunset_utc, day.sunset_estimated, null)}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Hourly Details - Only show if expanded */}
                        {expandedDay === index && (
                          <div className="mt-6 pt-4 border-t border-gray-200">
                            <h4 className="font-semibold mb-3 text-gray-900">Temperature Details</h4>
                            <div className="overflow-x-auto">
                              <div className="flex gap-2 pb-2 min-w-max">
                                {getDayHourlyData(index).map((hour, hourIndex) => (
                                  <div
                                    key={hourIndex}
                                    className="flex flex-col items-center min-w-[70px] p-2 rounded-lg bg-white border border-gray-100"
                                  >
                                    <div className="text-xs text-gray-600 mb-1">{formatTime(hour.dt)}</div>
                                    {renderWeatherIcon(
                                      Array.isArray(hour.weather) ? hour.weather[0]?.icon : hour.weather.icon,
                                      Array.isArray(hour.weather)
                                        ? hour.weather[0]?.description
                                        : hour.weather.description,
                                      "h-14 w-14",
                                    )}
                                    <div className="font-semibold text-sm text-gray-900 mt-1">
                                      {Math.round(hour.temp)}°
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Show UTC note if any times are UTC */}
                    {weatherData.daily.some(
                      (day) => day.sunrise_utc || day.sunset_utc || day.sunrise_estimated || day.sunset_estimated,
                    ) && (
                      <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                          <div className="text-xs text-amber-800">
                            <span className="font-medium">Note:</span> Times marked with
                            <Badge variant="secondary" className="bg-blue-100 text-blue-600 text-xs px-1 py-0 h-4 mx-1">
                              EST
                            </Badge>
                            are approximate estimations, derived from typical daily sunrise and sunset drift patterns.
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Current Conditions */}
              <Card className="shadow-sm border-gray-100">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">Current Conditions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Wind */}
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">Wind</span>
                        <Wind className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {Math.round(weatherData.current.wind_speed)} m/s
                      </div>
                      <div className="text-sm text-gray-600">
                        {weatherData.current.wind_dir ||
                          (weatherData.current.wind_deg ? getWindDirection(weatherData.current.wind_deg) : "Variable")}
                      </div>
                    </div>

                    {/* Humidity */}
                    <div className="bg-cyan-50 rounded-xl p-4 border border-cyan-100">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">Humidity</span>
                        <Droplets className="h-6 w-6 text-cyan-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">{weatherData.current.humidity}%</div>
                      <div className="text-sm text-gray-600">{getHumidityLevel(weatherData.current.humidity)}</div>
                    </div>

                    {/* Pressure */}
                    <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">Pressure</span>
                        <Gauge className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {Math.round(weatherData.current.pressure)}
                      </div>
                      <div className="text-sm text-gray-600">hPa</div>
                    </div>

                    {/* UV Index */}
                    <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">UV Index</span>
                        <Sun className="h-6 w-6 text-yellow-600" />
                      </div>
                      {weatherData.current.uvi !== undefined ? (
                        <>
                          <div className="text-2xl font-bold text-gray-900 mb-1">
                            {Math.round(weatherData.current.uvi)}
                          </div>
                          <div className={`text-sm ${getUVLevel(weatherData.current.uvi).color}`}>
                            {getUVLevel(weatherData.current.uvi).level}
                          </div>
                        </>
                      ) : (
                        <div className="group relative">
                          <div className="text-2xl font-bold text-gray-900 mb-1">N/A</div>
                          <div className="text-sm text-gray-600">Not available</div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
