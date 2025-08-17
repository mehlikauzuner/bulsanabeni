// components/pages/seyehat/kategoriler/geziler/ilan/ilan.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { IlanModel } from '../../../../../../models/ilan-model';

type City = { id: number; name: string };
type District = { id: number; name: string; cityId?: number };

@Component({
  selector: 'app-geziler-ilan',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './ilan.html',
  styleUrls: ['./ilan.css'],
})
export class GezilerIlan implements OnInit {
  constructor(private http: HttpClient) {}

  // ===== DEV TEST USER =====
  // FK hatası yaşamamak için Users tablosunda Id=1 olduğundan emin ol (seed).
  private readonly TEST_USER_ID: number | null = 1;

  ilanUser: any = { id: 1, fullName: 'Test Kullanıcı', email: 'test@test.com' };

  // ===== Başlık / Açıklama =====
  maxTitleLen = 200;
  title = '';
  titleTouched = false;
  get titleLen() { return this.title.length; }
  get titleInvalid() { return this.titleTouched && !this.title.trim(); }
  onTitleChange(e: Event) { this.title = (e.target as HTMLInputElement).value; }

  maxDescLen = 500;
  description = '';
  descriptionTouched = false;
  get descLen() { return this.description.length; }
  get descInvalid() { return this.descriptionTouched && !this.description.trim(); }
  onDescChange(e: Event) { this.description = (e.target as HTMLTextAreaElement).value; }

  // ===== Tarih & Saat (geçmiş seçilmez) =====
  readonly YEAR_SPAN = 5;
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
  onHourChange(e: Event) {
    const v = (e.target as HTMLSelectElement).value;
    this.selectedHour = v === '' ? null : +v;
  }

  eventDate = '';
  dateInvalid = false;

  private daysInMonth(year: number, month: number) { return new Date(year, month, 0).getDate(); }

  onYearSelect(y: number) {
    this.selectedYear = y || null;
    this.selectedMonth = null;
    this.selectedDay = null;
    this.days = [];

    if (this.selectedYear == null) {
      this.months = [];
    } else if (this.selectedYear === this.todayYear) {
      this.months = this.monthsAll.filter(m => m.id >= this.todayMonth);
    } else {
      this.months = this.monthsAll.slice();
    }
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
    } else {
      this.days = [];
    }
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
      this.buildHours();
    } else {
      this.eventDate = '';
      this.dateInvalid = false;
      this.buildHours();
    }
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
    if (this.selectedHour !== null && !this.hours.includes(this.selectedHour)) {
      this.selectedHour = null;
    }
  }

  // ===== Konum (İl / İlçe) =====
  private readonly cityApi = 'https://localhost:44345/api/Cities';
  private readonly districtApi = 'https://localhost:44345/api/Districts';
  cities: City[] = [];
  districts: District[] = [];
  private districtCache: Record<number, District[]> = {};
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

  private norm(s: string): string {
    return (s || '').toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  get filteredCities(): City[] {
    const q = this.norm(this.citySearch).trim();
    if (!q) return this.cities;
    return this.cities.filter(c => this.norm(c.name).startsWith(q));
  }
  get filteredDistricts(): District[] {
    if (!this.selectedCityId) return [];
    const base = this.districts.filter(d =>
      d.cityId == null ? true : d.cityId === this.selectedCityId
    );
    const q = this.norm(this.districtSearch).trim();
    if (!q) return base;
    return base.filter(d => this.norm(d.name).startsWith(q));
  }

  onCityFocus() { this.showCityDropdown = true; if (this.cities.length === 0) this.loadCities(); }
  onCityBlur() { setTimeout(() => this.showCityDropdown = false, 120); }
  onCityInputChange(e: Event) { this.citySearch = (e.target as HTMLInputElement).value; }
  selectCity(c: City) {
    this.selectedCityId = c.id;
    this.selectedCityName = c.name;
    this.citySearch = c.name;
    this.showCityDropdown = false;
    this.selectedDistrictId = null;
    this.selectedDistrictName = '';
    this.districtSearch = '';
    this.districts = [];
    this.ensureDistrictsLoaded(c.id);
  }
  onDistrictFocus() { if (!this.selectedCityId) return; this.showDistrictDropdown = true; this.ensureDistrictsLoaded(this.selectedCityId); }
  onDistrictBlur() { setTimeout(() => this.showDistrictDropdown = false, 120); }
  onDistrictInputChange(e: Event) { if (!this.selectedCityId) return; this.districtSearch = (e.target as HTMLInputElement).value; }
  selectDistrict(d: District) {
    if (!this.selectedCityId) return;
    this.selectedDistrictId = d.id;
    this.selectedDistrictName = d.name;
    this.districtSearch = d.name;
    this.showDistrictDropdown = false;
  }

  private loadCities() {
    this.loadingCities = true;
    this.http.get<City[] | { data: City[] }>(this.cityApi)
      .pipe(map(res => Array.isArray(res) ? res : (res?.data ?? [])))
      .subscribe({
        next: list => { this.cities = list ?? []; this.loadingCities = false; },
        error: () => { this.locationError = 'İller yüklenemedi.'; this.loadingCities = false; }
      });
  }
  private ensureDistrictsLoaded(cityId: number) {
    if (this.districtCache[cityId]) { this.districts = this.districtCache[cityId]; return; }
    this.loadDistricts(cityId);
  }
  private loadDistricts(cityId: number) {
    this.loadingDistricts = true;
    const params = new HttpParams().set('cityId', String(cityId));
    this.http.get<District[] | { data: District[] }>(this.districtApi, { params })
      .pipe(map(res => Array.isArray(res) ? res : (res?.data ?? [])))
      .subscribe({
        next: list => {
          let arr = (list ?? []) as District[];
          if (arr.length && typeof arr[0].cityId !== 'undefined') {
            arr = arr.filter(d => d.cityId === cityId);
          }
          this.districtCache[cityId] = arr;
          this.districts = arr;
          this.loadingDistricts = false;
        },
        error: () => { this.locationError = 'İlçeler yüklenemedi.'; this.loadingDistricts = false; }
      });
  }

  // ===== Submit =====
  submitting = false;
  submitError: string | null = null;
  createdId: number | null = null;
  private readonly createApi = 'https://localhost:44345/api/Geziler';

  get formValid(): boolean {
    const okTitle = !!this.title.trim();
    const okDesc  = !!this.description.trim() && this.description.length <= this.maxDescLen;
    const okDate  = !!this.eventDate && !this.dateInvalid;
    const okTime  = this.selectedHour !== null;
    const okCity  = this.selectedCityId !== null;
    const okDist  = this.selectedDistrictId !== null;
    return okTitle && okDesc && okDate && okTime && okCity && okDist;
  }

  // === CRITICAL: Backend Entity ile birebir uyumlu payload ===
  private buildPayload(): any {
    // date → ISO; time → "HH:mm:ss"
    const hh = this.selectedHour != null ? String(this.selectedHour).padStart(2, '0') : '00';
    const isoDateTime = this.eventDate ? `${this.eventDate}T${hh}:00:00` : null;

    const payload = {
      UserId: this.TEST_USER_ID ?? 0,                   // int (FK varsa seed user gerekli)
      Title: this.title.trim(),                         // string
      Description: this.description.trim(),             // string
      Date: this.eventDate ? `${this.eventDate}T${hh}:00:00` : null, // ISO DateTime
      Time: `${hh}:00:00`,                         // TimeSpan formatında (HH:mm:ss)
      City: this.selectedCityName,                      // string (örn: Ankara)
      District: this.selectedDistrictName               // string (örn: Çankaya)
    };

    return payload;
  }

  onSubmit() {
    if (!this.formValid || this.submitting) return;
    this.submitting = true;
    this.submitError = null;
    this.createdId = null;

    const payload = this.buildPayload();
    console.log('[POST /Geziler] payload:', payload);

    this.http.post<any>(this.createApi, payload).subscribe({
      next: (res) => {
        console.log('[POST /Geziler] success:', res);
        const id = typeof res === 'number' ? res : (res?.id ?? res?.data?.id ?? null);
        this.createdId = (typeof id === 'number') ? id : null;
        this.submitting = false;
      },
      error: (err) => {
        console.error('[POST /Geziler] error:', err);
        // ModelState validation mesajlarını topla
        const e = err?.error;
        const msgs: string[] = [];
        if (typeof e === 'string') msgs.push(e);
        if (e?.message) msgs.push(e.message);
        if (e?.title) msgs.push(e.title);
        if (e?.errors && typeof e.errors === 'object') {
          for (const key of Object.keys(e.errors)) {
            const arr = e.errors[key];
            if (Array.isArray(arr)) arr.forEach((m: any) => msgs.push(`${key}: ${m}`));
          }
        }
        this.submitError = msgs.length ? msgs.join(' | ') : 'Kayıt sırasında bir hata oluştu.';
        this.submitting = false;
      }
    });
  }

  ngOnInit(): void {
    for (let y = this.todayYear; y <= this.todayYear + this.YEAR_SPAN; y++) this.years.push(y);
    this.buildHours();
  }
}