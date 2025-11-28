"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Cloud, Droplets, Wind, Loader2, MapPin, RefreshCw, Settings } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import UpdateLocationDialog from "@/components/UpdateLocationDialog";

interface WeatherData {
  temperature: number;
  humidity: number;
  condition: string;
  conditionIcon: string;
  windSpeed: number;
  time: string;
}

interface WeatherWidgetProps {
  district?: string | null;
}

export default function WeatherWidget({ district: districtProp }: WeatherWidgetProps) {
  const { t } = useLanguage();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLocationDialog, setShowLocationDialog] = useState(false);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if district prop is provided
      if (districtProp) {
        setLocation(districtProp);

        // Fetch weather data using district
        const weatherResponse = await fetch(
          `/api/weather?location=${encodeURIComponent(districtProp)}`
        );

        if (!weatherResponse.ok) {
          const errorData = await weatherResponse.json();
          throw new Error(errorData.message || "Failed to fetch weather data");
        }

        const weatherData = await weatherResponse.json();
        setWeather(weatherData);
        setLoading(false);
        return;
      }

      // Fallback: Fetch user profile to get location/district
      const token = localStorage.getItem("bearer_token");
      const profileResponse = await fetch("/api/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!profileResponse.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const profile = await profileResponse.json();

      // Check for district first, then fallback to location
      const userLocation = profile.district || profile.location;

      if (!userLocation) {
        setError("Location not set. Please update your profile.");
        setLoading(false);
        return;
      }

      setLocation(userLocation);

      // Fetch weather data
      const weatherResponse = await fetch(
        `/api/weather?location=${encodeURIComponent(userLocation)}`
      );

      if (!weatherResponse.ok) {
        const errorData = await weatherResponse.json();
        throw new Error(errorData.message || "Failed to fetch weather data");
      }

      const weatherData = await weatherResponse.json();
      setWeather(weatherData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching weather");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [districtProp]);

  if (loading) {
    return (
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        </CardContent>
      </Card>);

  }

  if (error) {
    return (
      <>
        <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
          <CardContent className="p-6">
            <div className="text-center">
              <Cloud className="w-12 h-12 text-orange-400 mx-auto mb-3" />
              <p className="text-sm text-orange-700 mb-4 font-medium">{error}</p>
              <div className="flex gap-2 justify-center">
                <Button
                  onClick={() => setShowLocationDialog(true)}
                  size="sm"
                  className="bg-gradient-to-r from-green-600 to-green-700">

                  <Settings className="w-4 h-4 mr-2" />
                  {t("profile.setLocation") || "Set Location"}
                </Button>
                <Button
                  onClick={fetchWeather}
                  size="sm"
                  variant="outline"
                  className="border-orange-300 text-orange-600 hover:bg-orange-50">

                  <RefreshCw className="w-4 h-4 mr-2" />
                  {t("common.retry") || "Retry"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <UpdateLocationDialog
          open={showLocationDialog}
          onOpenChange={setShowLocationDialog}
          onLocationUpdated={fetchWeather} />

      </>);

  }

  if (!weather) {
    return null;
  }

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="text-lg font-bold text-gray-800 capitalize">
                {location}
              </h3>
              <p className="text-xs text-gray-500">
                {new Date(weather.time).toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              onClick={fetchWeather}
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              title="Refresh weather">

              <RefreshCw className="w-4 h-4 text-blue-600" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-5xl">{weather.conditionIcon}</div>
            <div>
              <div className="text-4xl font-bold text-gray-800">
                {weather.temperature}°C
              </div>
              <p className="text-sm text-gray-600 font-medium">
                {weather.condition}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-blue-200">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Droplets className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 !whitespace-pre-line">
                {t("humidity") || "Humidity"}
              </p>
              <p className="text-lg font-bold text-gray-800">
                {weather.humidity}%
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
              <Wind className="w-5 h-5 text-cyan-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 !whitespace-pre-line">
                {t("wind") || "Wind"}
              </p>
              <p className="text-lg font-bold text-gray-800">
                {weather.windSpeed} km/h
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <UpdateLocationDialog
        open={showLocationDialog}
        onOpenChange={setShowLocationDialog}
        onLocationUpdated={fetchWeather} />

    </Card>);

}