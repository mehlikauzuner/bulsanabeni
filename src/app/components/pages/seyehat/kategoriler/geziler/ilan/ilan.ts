import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule }     from '@angular/material/select';
import { MatIconModule }       from '@angular/material/icon';
import { GezilerService } from '../../../../../../services/geziler-service';
import { AuthService } from '../../../../../../services/auth-service';


type City    = { id: number; name: string };
type District= { id: number; name: string };

@Component({
  selector: 'app-geziler-ilan',
  standalone: true,
  imports: [CommonModule, FormsModule,MatDatepickerModule, MatInputModule, MatNativeDateModule,
    MatSelectModule, MatIconModule],
  templateUrl: './ilan.html',
  styleUrls: ['./ilan.css'],
})


export class GezilerIlan implements OnInit {
  constructor(
    private geziler: GezilerService,
    private auth: AuthService
  ) {}

  readonly maxTitleLen = 200;
  readonly maxDescLen = 500;
 
  title = '';
  description = '';

  eventDate: Date | null = null;
  selectedTime: string | null = null; 

 readonly timeOptions = Array.from({ length: 96 }, (_, i) =>
    `${String(Math.floor(i / 4)).padStart(2, '0')}:${String((i % 4) * 15).padStart(2, '0')}`
  );


  get combinedIso(): string | null {
    if (!this.eventDate || !this.selectedTime) return null;
    const [hh, mm] = this.selectedTime.split(':').map(Number);
    const d = new Date(this.eventDate);
    d.setHours(hh, mm, 0, 0);
    return d.toISOString();
  }


  cities: City[] = [];
  districts: District[] = [];
  selectedCityId: number | null = null;
  selectedCityName: string | null = null;
  selectedDistrictId: number | null = null;
  selectedDistrictName: string | null = null;

  sending = false;
  sendOk  = false;
  sendErr = false;

  ngOnInit() {
    this.loadCities();
  }

  loadCities() {
    this.geziler.getCities().subscribe({
      next: data => this.cities = data,
      error: err => console.error('Şehirler alınamadı', err)
    });
  }

  onCityChange(cityId: number) {
    this.selectedCityId = cityId;
    const city = this.cities.find(c => c.id === cityId);
    this.selectedCityName = city ? city.name : null;

    this.geziler.getDistricts(cityId).subscribe({
      next: data => this.districts = data,
      error: err => console.error('İlçeler alınamadı', err)
    });
  }

  onDistrictChange(districtId: number) {
    this.selectedDistrictId = districtId;
    const dist = this.districts.find(d => d.id === districtId);
    this.selectedDistrictName = dist ? dist.name : null;
  }

 private buildPayload() {
  const userName = this.auth.currentUserName() ?? 'Kullanıcı';
  const userId   = this.auth.currentUserId() ?? 0;

  return {
    title: this.title.trim(),
    description: this.description.trim(),
    date: this.combinedIso,
    time: this.selectedTime ? this.selectedTime + ':00:00' : null,
    cityName: this.selectedCityName,
    district: this.selectedDistrictName,
    userName,
    userId,
    cityId: this.selectedCityId ?? undefined,
    districtId: this.selectedDistrictId ?? undefined,
  };
}

  submitIlan() {
  if (!this.formValid()) return;

  this.sending = true;
  this.sendOk = this.sendErr = false;

  this.geziler.createIlan(this.buildPayload()).subscribe({
    next: () => {
      this.sending = false;
      this.sendOk = true;
      this.resetForm();
    },
    error: err => {
      console.error('İlan gönderilemedi', err);
      this.sending = false;
      this.sendErr = true;
    }
  });
}

formValid(): boolean {
  return !!(
    this.title.trim() &&
    this.description.trim() &&
    this.selectedCityName &&
    this.selectedDistrictName &&
    this.eventDate
  );
}

  resetForm() {
    this.title = '';
    this.description = '';
    this.selectedCityId = null;
    this.selectedCityName = null;
    this.selectedDistrictId = null;
    this.selectedDistrictName = null;
    this.eventDate = null;
  }
}
