// components/pages/seyehat/kategoriler/cruise/ilan/ilan.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject, Subscription, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators';
import { IlanModel } from '../../../../../../models/ilan-model';
import { CruiseService } from '../../../../../../services/cruise-service';


@Component({
  selector: 'app-cruise-ilan',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ilan.html',
  styleUrls: ['./ilan.css'],
})
export class CruiseIlan {
  constructor(private http: HttpClient, private cruiseService: CruiseService) {
    // şehir ve ilçe arama akışları
    const s1 = this.cityQuery$.pipe(
      map(q => q?.trim() ?? ''),
      debounceTime(250),
      distinctUntilChanged(),
      switchMap(q => {
        if (!q) { this.cityOptions = []; return of<any[]>([]); }
        const params = new HttpParams().set('q', q);
        return this.http.get<any[]>(this.cityApi, { params });
      }),
      tap(list => { this.cityOptions = list ?? []; })
    ).subscribe();

    const s2 = this.districtQuery$.pipe(
      map(q => q?.trim() ?? ''),
      debounceTime(250),
      distinctUntilChanged(),
      filter(() => !!this.selectedCityId),
      switchMap(q => {
        const params = new HttpParams()
          .set('cityId', String(this.selectedCityId))
          .set('q', q);
        return this.http.get<any[]>(this.districtApi, { params });
      }),
      tap(list => { this.districtOptions = list ?? []; })
    ).subscribe();

    this.subs.push(s1, s2);

    // yılları doldur (geçmiş yok)
    const now = new Date();
    for (let y = now.getFullYear(); y <= now.getFullYear() + this.YEAR_SPAN; y++) {
      this.years.push(y);
    }
  }

  // ========== Title ==========
  maxTitleLen = 200;
  title = '';
  titleTouched = false;
  get titleLen() { return this.title.length; }
  get titleInvalid() { return this.titleTouched && !this.title.trim(); }
  onTitleChange(e: Event) { this.title = (e.target as HTMLInputElement).value; }

  // ========= Description =========
  maxDescLen = 500;
  description = '';
  descriptionTouched = false;
  get descLen() { return this.description.length; }
  get descInvalid() { return this.descriptionTouched && !this.description.trim(); }
  onDescChange(e: Event) { this.description = (e.target as HTMLTextAreaElement).value; }

  // ========= Şehir / İlçe (input + dropdown + search) =========
  cityInput = '';
  cityOptions: Array<{ id: number; name: string }> = [];
  selectedCityId: number | null = null;

  districtInput = '';
  districtOptions: Array<{ id: number; name: string; cityId: number }> = [];
  selectedDistrictId: number | null = null;

  private cityQuery$ = new Subject<string>();
  private districtQuery$ = new Subject<string>();
  private subs: Subscription[] = [];

  // .NET API uçları — kendi projene göre güncelle
  private readonly cityApi = 'https://localhost:44345/api/Sehirler/search';
  private readonly districtApi = 'https://localhost:44345/api/Ilceler/search';
  private readonly createApi = 'https://localhost:44345/api/Geziler';

  onCityInputChange(e: Event) {
    const v = (e.target as HTMLInputElement).value;
    this.cityInput = v;
    this.selectedCityId = null;
    // ilçe temizle
    this.selectedDistrictId = null;
    this.districtInput = '';
    this.districtOptions = [];
    this.districtQuery$.next(''); // önerileri kapat
    this.cityQuery$.next(v);      // şehir önerileri
  }
  selectCity(c: { id: number; name: string }) {
    this.selectedCityId = c.id;
    this.cityInput = c.name;
    this.cityOptions = [];
    // ilçe reset
    this.selectedDistrictId = null;
    this.districtInput = '';
    this.districtOptions = [];
  }
  clearCity() {
    this.cityInput = '';
    this.selectedCityId = null;
    this.cityOptions = [];
    this.clearDistrict();
  }

  onDistrictInputChange(e: Event) {
    const v = (e.target as HTMLInputElement).value;
    this.districtInput = v;
    this.selectedDistrictId = null;
    if (this.selectedCityId) {
      this.districtQuery$.next(v);
    } else {
      this.districtOptions = [];
    }
  }
  selectDistrict(d: { id: number; name: string }) {
    this.selectedDistrictId = d.id;
    this.districtInput = d.name;
    this.districtOptions = [];
  }
  clearDistrict() {
    this.districtInput = '';
    this.selectedDistrictId = null;
    this.districtOptions = [];
  }

  // ========= Tarih (native date veya yıl→ay→gün dropdown) =========
  readonly YEAR_SPAN = 5;
  years: number[] = [];
  months = [
    { id: 1,  name: 'Ocak' }, { id: 2,  name: 'Şubat' }, { id: 3,  name: 'Mart' },
    { id: 4,  name: 'Nisan'},{ id: 5,  name: 'Mayıs' }, { id: 6,  name: 'Haziran' },
    { id: 7,  name: 'Temmuz'},{ id: 8,  name: 'Ağustos'},{ id: 9,  name: 'Eylül' },
    { id: 10, name: 'Ekim' }, { id: 11, name: 'Kasım' }, { id: 12, name: 'Aralık' },
  ];
  days: number[] = [];

  readonly today = this.toISODate(new Date());
  minDate = this.today; // geçmiş kapalı
  eventDate = '';       // ISO "YYYY-MM-DD"

  selectedYear: number | null = null;
  selectedMonth: number | null = null;
  selectedDay: number | null = null;

  onDateInputChange(e: Event) {
    const v = (e.target as HTMLInputElement).value;
    this.eventDate = (v && v >= this.minDate) ? v : '';
  }
  get dateInvalid() { return !this.eventDate || this.eventDate < this.minDate; }

  onYearSelect(y: number) {
    this.selectedYear = y; this.selectedMonth = null; this.selectedDay = null; this.days = [];
    this.syncEventDateFromYMD();
  }
  onMonthSelect(m: number) {
    this.selectedMonth = m; this.selectedDay = null;
    this.days = this.computeDayOptions(this.selectedYear!, this.selectedMonth!);
    this.syncEventDateFromYMD();
  }
  onDaySelect(d: number) { this.selectedDay = d; this.syncEventDateFromYMD(); }

  private toISODate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
  private daysInMonth(year: number, month: number) { return new Date(year, month, 0).getDate(); }
  private isPastYMD(y: number, m: number, d: number) {
    const iso = `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    return iso < this.minDate;
  }
  private computeDayOptions(year: number, month: number): number[] {
    const max = this.daysInMonth(year, month), out: number[] = [];
    for (let d = 1; d <= max; d++) if (!this.isPastYMD(year, month, d)) out.push(d);
    return out;
  }
  private syncEventDateFromYMD() {
    if (this.selectedYear && this.selectedMonth && this.selectedDay) {
      const iso = `${this.selectedYear}-${String(this.selectedMonth).padStart(2,'0')}-${String(this.selectedDay).padStart(2,'0')}`;
      this.eventDate = (iso >= this.minDate) ? iso : '';
    } else {
      this.eventDate = '';
    }
  }

  // ========= Submit ("Bul Beni" butonu) =========
  submitting = false;
  submitError: string | null = null;
  createdId: number | null = null;

  get formValid(): boolean {
    const okTitle = !!this.title.trim();
    const okDesc  = !!this.description.trim() && this.description.length <= this.maxDescLen;
    const okDate  = !!this.eventDate && !this.dateInvalid;
    // şehir/ilçe isteğe bağlı; ID ya da isim gidebilir
    return okTitle && okDesc && okDate;
  }

  buildPayload(): IlanModel {
    const p: IlanModel = {
      title: this.title.trim(),
      description: this.description.trim(),
      eventDate: this.eventDate,
    };
    if (this.selectedCityId) p.cityId = this.selectedCityId;
    else if (this.cityInput.trim()) p.cityName = this.cityInput.trim();

    if (this.selectedDistrictId) p.districtId = this.selectedDistrictId;
    else if (this.districtInput.trim()) p.districtName = this.districtInput.trim();

    return p;
  }

  onSubmit() {
    if (!this.formValid || this.submitting) return;
    this.submitting = true;
    this.submitError = null;
    this.createdId = null;

    const payload = this.buildPayload();

    this.http.post<CruiseService>(this.createApi, payload).subscribe({
      next: (res) => {
        // Muhtemel yanıt türlerini normalize et
        const id =
          typeof res === 'number' ? res :
          (res as any)?.id ?? (res as any)?.data?.id ?? null;

        this.createdId = (typeof id === 'number') ? id : null;
        this.submitting = false;
      },
      error: (err) => {
        this.submitError = (err?.error?.message) || 'Kayıt sırasında bir hata oluştu.';
        this.submitting = false;
      }
    });
  }
}
