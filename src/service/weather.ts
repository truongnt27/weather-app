export const fetchGeoCoords = async (city) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${city}&format=json&limit=1`
  );
  const data = await response.json();
  return data.length
    ? {
        lat: data[0].lat,
        lon: data[0].lon,
      }
    : null;
};

export interface WeatherData {
  latitude: number;
  longitude: number;
  timezone: string;
  current_weather: {
    temperature: number;
    windspeed: number;
    weathercode: number;
    is_day: number;
  };
  current: {
    time: string;
    temperature_2m: number;
    weather_code: number;
    rain: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weathercode: number[];
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weathercode: number[];
  };
}

export const fetchWeatherData = async (lat, lon, days = 7) => {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weathercode&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto&current=temperature_2m,weather_code&forecast_days=${days}`
  );
  return await response.json();
};
