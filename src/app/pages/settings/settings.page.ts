import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonLabel, IonInput,
  IonSelect, IonSelectOption,
  IonButton, IonButtons, IonBackButton
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonItem, IonLabel, IonInput,
    IonSelect, IonSelectOption,
    IonButton, IonButtons, IonBackButton
  ]
})
export class SettingsPage {

  city: string = '';
  unit: string = 'metric';

  ionViewWillEnter() {
    this.city = localStorage.getItem('city') || '';
    this.unit = localStorage.getItem('unit') || 'metric';
  }

  saveSettings() {
    localStorage.setItem('city', this.city);
    localStorage.setItem('unit', this.unit);
    history.back(); 
  }
}
