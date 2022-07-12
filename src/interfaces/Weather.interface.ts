export interface Weather {
  temperature: number;
  feelsLike: number;
  windSpeed: number;
  description: string;
  imageURL: string;
}

export interface HourlyWeather extends Weather {
  date: Date;
}

export default interface CityWeather extends Weather {
  cityName: string;
  country: string;
}

export interface DetailedCityWeather {
  cityName: string;
  country: string;
  forecast: HourlyWeather[];
}
