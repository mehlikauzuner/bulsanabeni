import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GezilerService } from '../../../../../../services/geziler-service';
import { City, District } from '../../../../../../models/ilan-model';

@Component({
  selector: 'app-geziler-ilan',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ilan.html',
  styleUrls: ['./ilan.css'],
})
export class GezilerIlan implements OnInit {
  constructor(private geziler: GezilerService) {}

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
  months = this.monthsAll.slice();
  days: number[] = [];
  selectedYear: number | null = null;
  selectedMonth: number | null = null;
  selectedDay: number | null = null;
  hours: number[] = [];
  selectedHour: number | null = null;
  eventDate = '';
  dateInvalid = false;

  // ===== Konum =====
  cities: City[] = [];
  districts: District[] = [];
  selectedCityId: number | null = null;
  selectedDistrictId: number | null = null;
  selectedCityName = '';
  selectedDistrictName = '';
  citySearch = '';
  districtSearch = '';
  showCityDropdown = false;
  showDistrictDropdown = false;
  loadingCities = false;
  loadingDistricts = false;
  locationError: string | null = null;
  private districtCache: Record<number, District[]> = {};

  // ===== Submit =====
  submitting = false;
  submitError: string | null = null;
  createdId: number | null = null;

  ngOnInit(): void {
    for (let y = this.todayYear; y <= this.todayYear + this.YEAR_SPAN; y++) this.years.push(y);
    this.buildHours();
  }

  // ===== Form kontrolü =====
  get formValid(): boolean {
    const okTitle = !!this.title.trim();
    const okDesc = !!this.description.trim() && this.description.length <= this.maxDescLen;
    const okDate = !!this.eventDate && !this.dateInvalid;
    const okTime = this.selectedHour !== null;
    const okCity = this.selectedCityId !== null;
    const okDist = this.selectedDistrictId !== null;
    return okTitle && okDesc && okDate && okTime && okCity && okDist;
  }

  // ===== Tarih / Saat metodları =====
  private daysInMonth(year: number, month: number) {
    return new Date(year, month, 0).getDate();
  }

  onYearSelect(y: number) {
    this.selectedYear = y || null;
    this.selectedMonth = null;
    this.selectedDay = null;
    this.days = [];
    this.months = this.selectedYear === this.todayYear
      ? this.monthsAll.filter(m => m.id >= this.todayMonth)
      : this.monthsAll.slice();
    this.syncEventDate();
  }

  onMonthSelect(m: number) {
    this.selectedMonth = m || null;
    this.selectedDay = null;
    if (this.selectedYear && this.selectedMonth) {
      const max = this.daysInMonth(this.selectedYear, this.selectedMonth);
      const startDay = (this.selectedYear === this.todayYear && this.selectedMonth === this.todayMonth)
        ? this.todayDay : 1;
      this.days = Array.from({ length: max - startDay + 1 }, (_, i) => startDay + i);
    } else this.days = [];
    this.syncEventDate();
  }

  onDaySelect(d: number) {
    this.selectedDay = d || null;
    this.syncEventDate();
  }

  private syncEventDate() {
    if (this.selectedYear && this.selectedMonth && this.selectedDay) {
      this.eventDate = `${this.selectedYear}-${String(this.selectedMonth).padStart(2,'0')}-${String(this.selectedDay).padStart(2,'0')}`;
      this.dateInvalid = false;
    } else this.eventDate = '';
    this.buildHours();
  }

  private buildHours() {
    if (
      this.selectedYear === this.todayYear &&
      this.selectedMonth === this.todayMonth &&
      this.selectedDay === this.todayDay
    ) {
      const nowHour = new Date().getHours();
      this.hours = Array.from({ length: 24 - nowHour }, (_, i) => nowHour + i);
    } else {
      this.hours = Array.from({ length: 24 }, (_, i) => i);
    }
    if (this.selectedHour !== null && !this.hours.includes(this.selectedHour)) this.selectedHour = null;
  }

  // ===== Konum metodları =====
  private norm(s: string): string {
    return (s || '').toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  get filteredCities(): City[] {
    const q = this.norm(this.citySearch).trim();
    return !q ? this.cities : this.cities.filter(c => this.norm(c.name).startsWith(q));
  }

  get filteredDistricts(): District[] {
    if (!this.selectedCityId) return [];
    const base = this.districts.filter(d => !d.cityId || d.cityId === this.selectedCityId);
    const q = this.norm(this.districtSearch).trim();
    return !q ? base : base.filter(d => this.norm(d.name).startsWith(q));
  }

  selectCity(c: City) {
    this.selectedCityId = c.id;
    this.selectedCityName = c.name;
    this.citySearch = c.name;
    this.showCityDropdown = false;
    this.selectedDistrictId = null;
    this.selectedDistrictName = '';
    this.districtSearch = '';
    this.districts = [];
    this.loadDistricts(c.id);
  }

  selectDistrict(d: District) {
    if (!this.selectedCityId) return;
    this.selectedDistrictId = d.id;
    this.selectedDistrictName = d.name;
    this.districtSearch = d.name;
    this.showDistrictDropdown = false;
  }

  private loadCities() {
    this.loadingCities = true;
    this.geziler.getCities().subscribe({
      next: list => { this.cities = list ?? []; this.loadingCities = false; },
      error: () => { this.locationError = 'İller yüklenemedi.'; this.loadingCities = false; }
    });
  }

  private loadDistricts(cityId: number) {
    if (this.districtCache[cityId]) {
      this.districts = this.districtCache[cityId];
      return;
    }
    this.loadingDistricts = true;
    this.geziler.getDistricts(cityId).subscribe({
      next: list => {
        const arr = (list ?? []).filter(d => !d.cityId || d.cityId === cityId);
        this.districtCache[cityId] = arr;
        this.districts = arr;
        this.loadingDistricts = false;
      },
      error: () => {
        this.locationError = 'İlçeler yüklenemedi.';
        this.loadingDistricts = false;
      }
    });
  }

  // ===== Payload oluşturma =====
  private buildPayload(): any {
    const hh = this.selectedHour != null ? String(this.selectedHour).padStart(2, '0') : '00';
    const isoDateTime = this.eventDate ? `${this.eventDate}T${hh}:00:00` : null;

    return {
      Title: this.title.trim(),
      Description: this.description.trim(),
      Date: isoDateTime,
      Time: `${hh}:00:00`,
      City: this.selectedCityName,
      District: this.selectedDistrictName
    };
  }

  // ===== Form submit =====
  onSubmit() {
    if (!this.formValid || this.submitting) return;

    this.submitting = true;
    this.submitError = null;
    this.createdId = null;

    const payload = this.buildPayload();
    this.geziler.createIlan(payload).subscribe({
      next: (res) => {
        this.createdId = typeof res === 'number' ? res : (res?.id ?? res?.data?.id ?? null);
        this.submitting = false;
      },
      error: (err) => {
        const e = err?.error;
        const msgs: string[] = [];
        if (typeof e === 'string') msgs.push(e);
        if (e?.message) msgs.push(e.message);
        if (e?.title) msgs.push(e.title);
        if (e?.errors && typeof e.errors === 'object') {
          Object.keys(e.errors).forEach(key => {
            const arr = e.errors[key];
            if (Array.isArray(arr)) arr.forEach(m => msgs.push(`${key}: ${m}`));
          });
        }
        this.submitError = msgs.length ? msgs.join(' | ') : 'Kayıt sırasında bir hata oluştu.';
        this.submitting = false;
      }
    });
  }
}
