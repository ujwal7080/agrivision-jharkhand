import { NextRequest, NextResponse } from 'next/server';

interface WeatherResponse {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    weather_code: number;
    wind_speed_10m: number;
    time: string;
  };
  timezone: string;
}

interface WeatherData {
  temperature: number;
  humidity: number;
  condition: string;
  conditionIcon: string;
  windSpeed: number;
  time: string;
}

const WEATHER_CODES: { [key: number]: { description: string; icon: string } } = {
  0: { description: 'Clear sky', icon: '☀️' },
  1: { description: 'Mainly clear', icon: '🌤️' },
  2: { description: 'Partly cloudy', icon: '⛅' },
  3: { description: 'Overcast', icon: '☁️' },
  45: { description: 'Foggy', icon: '🌫️' },
  48: { description: 'Foggy', icon: '🌫️' },
  51: { description: 'Light drizzle', icon: '🌦️' },
  53: { description: 'Drizzle', icon: '🌦️' },
  55: { description: 'Heavy drizzle', icon: '🌧️' },
  61: { description: 'Light rain', icon: '🌧️' },
  63: { description: 'Rain', icon: '🌧️' },
  65: { description: 'Heavy rain', icon: '⛈️' },
  71: { description: 'Light snow', icon: '🌨️' },
  73: { description: 'Snow', icon: '❄️' },
  75: { description: 'Heavy snow', icon: '❄️' },
  77: { description: 'Snow grains', icon: '❄️' },
  80: { description: 'Light showers', icon: '🌦️' },
  81: { description: 'Showers', icon: '🌧️' },
  82: { description: 'Heavy showers', icon: '⛈️' },
  85: { description: 'Light snow showers', icon: '🌨️' },
  86: { description: 'Snow showers', icon: '❄️' },
  95: { description: 'Thunderstorm', icon: '⛈️' },
  96: { description: 'Thunderstorm with hail', icon: '⛈️' },
  99: { description: 'Thunderstorm with heavy hail', icon: '⛈️' },
};

// Jharkhand district coordinates
const DISTRICT_COORDINATES: { [key: string]: { lat: number; lon: number } } = {
  'ranchi': { lat: 23.344315, lon: 85.296013 },
  'dhanbad': { lat: 23.7957, lon: 86.4304 },
  'bokaro': { lat: 23.801, lon: 85.325 },
  'giridih': { lat: 24.180, lon: 85.199 },
  'hazaribagh': { lat: 24.160, lon: 85.372 },
  'jamshedpur': { lat: 22.794, lon: 86.180 },
  'east singhbhum': { lat: 22.8042, lon: 86.1971 },
  'west singhbhum': { lat: 22.6392, lon: 84.8272 },
  'deoghar': { lat: 24.485, lon: 86.696 },
  'dumka': { lat: 24.269, lon: 87.249 },
  'garhwa': { lat: 24.168, lon: 83.813 },
  'godda': { lat: 24.827, lon: 87.212 },
  'gumla': { lat: 23.043, lon: 84.541 },
  'jamtara': { lat: 23.963, lon: 86.802 },
  'khunti': { lat: 23.073, lon: 85.278 },
  'koderma': { lat: 24.467, lon: 85.599 },
  'latehar': { lat: 23.744, lon: 84.499 },
  'lohardaga': { lat: 23.434, lon: 84.680 },
  'pakur': { lat: 24.633, lon: 87.849 },
  'palamu': { lat: 24.031, lon: 84.073 },
  'ramgarh': { lat: 23.631, lon: 85.519 },
  'sahibganj': { lat: 25.250, lon: 87.650 },
  'seraikela-kharsawan': { lat: 22.701, lon: 86.148 },
  'simdega': { lat: 22.617, lon: 84.500 },
  'chatra': { lat: 24.207, lon: 84.872 },
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const location = searchParams.get('location');

    if (!location) {
      return NextResponse.json(
        { error: 'Location parameter required' },
        { status: 400 }
      );
    }

    // Try to find coordinates for the district
    const normalizedLocation = location.toLowerCase().trim();
    const coords = DISTRICT_COORDINATES[normalizedLocation];

    if (!coords) {
      // If district not found, return error with suggestion
      return NextResponse.json(
        { 
          error: 'District not found',
          message: `Location "${location}" not found. Please use a valid Jharkhand district name.`,
          availableDistricts: Object.keys(DISTRICT_COORDINATES)
        },
        { status: 404 }
      );
    }

    // Fetch weather from Open-Meteo API
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=Asia/Kolkata`;

    const response = await fetch(url, {
      next: { revalidate: 600 }, // Cache for 10 minutes
    });

    if (!response.ok) {
      throw new Error('Weather API request failed');
    }

    const data: WeatherResponse = await response.json();

    const weatherCode = data.current.weather_code;
    const weatherInfo = WEATHER_CODES[weatherCode] || { description: 'Unknown', icon: '🌡️' };

    const weatherData: WeatherData = {
      temperature: Math.round(data.current.temperature_2m * 10) / 10,
      humidity: data.current.relative_humidity_2m,
      condition: weatherInfo.description,
      conditionIcon: weatherInfo.icon,
      windSpeed: Math.round(data.current.wind_speed_10m * 10) / 10,
      time: data.current.time,
    };

    return NextResponse.json(weatherData);
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}
