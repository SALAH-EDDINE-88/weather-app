import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private readonly apiKey = 'c4306b343c98dc73df9d20366ae1b44c';
  private readonly apiUrl = 'https://api.openweathermap.org/data/2.5';

  constructor(private http: HttpClient) {}

  
  getWeatherByCity(city: string, unit: string = 'metric'): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/weather?q=${city}&units=${unit}&appid=${this.apiKey}`
    );
  }

  
  getWeatherByCoords(lat: number, lon: number, unit: string = 'metric'): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${this.apiKey}`
    );
  }

  
  getForecast(city: string, unit: string = 'metric'): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/forecast?q=${city}&units=${unit}&appid=${this.apiKey}`
    );
  }
}
