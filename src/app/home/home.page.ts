import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import * as L from 'leaflet';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonIcon,
  IonButtons,
  IonButton,
  IonSpinner
} from '@ionic/angular/standalone';

import { WeatherService } from './../core/services/weather.service';
import { Geolocation } from '@capacitor/geolocation';

import { addIcons } from 'ionicons';
import { settingsSharp, refreshOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    IonIcon,
    IonButtons,
    IonButton,
    IonSpinner
  ],
})
export class HomePage {

  weatherData: any = null;
  forecastData: any[] = [];
  currentDate: Date = new Date();

  unit: string = 'metric';
  unitSymbol: string = '°C';

  isLoading: boolean = true;
  map: any; 

  constructor(private weatherService: WeatherService) {
    addIcons({ settingsSharp, refreshOutline });
  }

  async ionViewWillEnter() {
    this.isLoading = true;
    const savedCity = localStorage.getItem('city');
    this.unit = localStorage.getItem('unit') || 'metric';
    this.unitSymbol = this.unit === 'metric' ? '°C' : '°F';

    if (savedCity && savedCity.trim() !== '') {
      this.loadWeatherByCity(savedCity);
    } else {
      await this.loadWeatherByLocation();
    }
  }

  async loadWeatherByLocation() {
    try {
      const position = await Geolocation.getCurrentPosition();
      this.weatherService
        .getWeatherByCoords(
          position.coords.latitude,
          position.coords.longitude,
          this.unit
        )
        .subscribe({
          next: (data) => {
            this.weatherData = data;
            this.loadForecast(data.name);
            
            setTimeout(() => this.initMap(data.coord.lat, data.coord.lon), 600);
            this.isLoading = false;
          },
          error: () => this.loadWeatherByCity('Casablanca')
        });
    } catch {
      this.loadWeatherByCity('Casablanca');
    }
  }

  loadWeatherByCity(city: string) {
    this.weatherService.getWeatherByCity(city, this.unit).subscribe({
      next: (data) => {
        this.weatherData = data;
        this.loadForecast(city);
        setTimeout(() => this.initMap(data.coord.lat, data.coord.lon), 600);
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  loadForecast(city: string) {
    this.weatherService.getForecast(city, this.unit).subscribe({
      next: (data) => {
        this.forecastData = data.list.filter(
          (item: any) => item.dt_txt.includes('12:00:00')
        );
      },
      error: (err) => console.error(err)
    });
  }

  doRefresh(event: any) {
    this.ionViewWillEnter().then(() => {
      event.target.complete();
    });
  }

  isDaytime(): boolean {
    const hour = new Date().getHours();
    return hour >= 6 && hour < 19;
  }

  
  initMap(lat: number, lon: number) {
    if (this.map) {
      this.map.remove();
    }
    
    
    const defaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34]
    });

    this.map = L.map('map').setView([lat, lon], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    
    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize();
      }
    }, 400);

    L.marker([lat, lon], { icon: defaultIcon })
      .addTo(this.map)
      .bindPopup(`<b>${this.weatherData?.name || 'Location'}</b>`)
      .openPopup();
  }
}