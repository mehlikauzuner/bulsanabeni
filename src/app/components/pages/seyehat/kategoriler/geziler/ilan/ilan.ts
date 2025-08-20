import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GezilerService } from '../../../../../../services/geziler-service';
import { AuthService } from '../../../../../../services/auth-service';


@Component({
  selector: 'app-geziler-ilan',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ilan.html',
  styleUrls: ['./ilan.css'],
})
export class GezilerIlan implements OnInit {
  constructor(
    private geziler: GezilerService,
    private auth: AuthService
  ) {}

  // ===== Başlık / Açıklama =====
  maxTitleLen = 200;
  title = '';
  maxDescLen = 500;
  description = '';

  // ===== Tarih & Saat =====
  readonly YEAR_SPAN = 30;
  years: number[] = [];
  private readonly today = new Date();
  private readonly todayYear = this.today.getFullYear();
  private readonly todayMonth = this.today.getMonth() + 1;
  private readonly todayDay = this.today.getDate();

  monthsAll = [
    { id: 1, name: 'Ocak' }, { id: 2, name: 'Şubat' }, { id: 3, name: 'Mart' },
    { id: 4, name: 'Nisan' }, { id: 5, name: 'Mayıs' }, { id: 6, name: 'Haziran' },
    { id: 7, name: 'Temmuz' }, { id: 8, name: 'Ağustos' }, { id: 9, name: 'Eylül' },
    { id: 10, name: 'Ekim' }, { id: 11, name: 'Kasım' }, { id: 12, name: 'Aralık' },
  ];
  selectedYear: number | null = null;
  selectedMonth: number | null = null;
  selectedDay: number | null = null;
  selectedHour: number | null = null;
  eventDate: string | null = null;

  // ===== Şehir / İlçe =====
  cities: any[] = [];
  districts: any[] = [];
  selectedCityId: number | null = null;
  selectedCityName: string | null = null;
  selectedDistrictId: number | null = null;
  selectedDistrictName: string | null = null;

  // ===== Flags =====
  sending = false;
  sendOk = false;
  sendErr = false;

  ngOnInit() {
    this.loadYears();
    this.loadCities();
  }

  loadYears() {
    for (let i = this.todayYear; i <= this.todayYear + this.YEAR_SPAN; i++) {
      this.years.push(i);
    }
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
    const hh = this.selectedHour != null ? String(this.selectedHour).padStart(2, '0') : '00';
    const isoDateTime = this.eventDate ? `${this.eventDate}T${hh}:00:00` : null;

    // AuthService’den gelen kullanıcı bilgileri
    const userName = this.auth.currentUserName() ?? 'Kullanıcı';
    const userId = this.auth.currentUserId() ?? 0;

    return {
      title: this.title.trim(),
      description: this.description.trim(),
      date: isoDateTime,
      time: `${hh}:00:00`,

      // 🔴 DB’de NOT NULL olan alanlar
      cityName: this.selectedCityName,
      district: this.selectedDistrictName,
      userName: userName,

      // opsiyonel id’ler
      userId: userId,
      cityId: this.selectedCityId ?? undefined,
      districtId: this.selectedDistrictId ?? undefined,
    };
  }

  submitIlan() {
    if (!this.formValid()) return;

    const payload = this.buildPayload();
    this.sending = true;
    this.sendOk = false;
    this.sendErr = false;

    this.geziler.createIlan(payload).subscribe({
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
    return (
      this.title.trim().length > 0 &&
      this.description.trim().length > 0 &&
      this.selectedCityName != null &&
      this.selectedDistrictName != null &&
      this.eventDate != null
    );
  }

  resetForm() {
    this.title = '';
    this.description = '';
    this.selectedCityId = null;
    this.selectedCityName = null;
    this.selectedDistrictId = null;
    this.selectedDistrictName = null;
    this.selectedYear = null;
    this.selectedMonth = null;
    this.selectedDay = null;
    this.selectedHour = null;
    this.eventDate = null;
  }
}
