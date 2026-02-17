export interface WeatherInfo {
  main: string;
  description: string;
  icon: string;
}

export interface Temperature {
  current: number;
  feels_like: number;
  min: number;
  max: number;
}

export interface CityWeather {
  city_code: string;
  city_name: string;
  country: string;
  weather: WeatherInfo;
  temperature: Temperature;
  humidity: number;
  pressure: number;
  wind_speed: number;
  visibility: number;
  clouds: number;
  comfort_score: number;
  rank: number;
}

export interface WeatherResponse {
  success: boolean;
  data: CityWeather[];
  count: number;
}

export type SortField = 'rank' | 'city_name' | 'temperature' | 'comfort_score';
export type SortDirection = 'asc' | 'desc';
