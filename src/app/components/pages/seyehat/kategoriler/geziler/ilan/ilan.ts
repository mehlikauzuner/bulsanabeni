// src/app/pages/ilan/ilan.component.ts
import { Component, LOCALE_ID, ViewEncapsulation } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';


import IlanModel from '../../../../../../models/ilan-model';
import { CruiseService } from '../../../../../../services/cruise-service';
import { CityService } from '../../../../../../services/city-service';


@Component({
  selector: 'app-ilan',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatDatepickerModule, MatFormFieldModule, MatInputModule,
    MatNativeDateModule, MatAutocompleteModule
  ],
  templateUrl: './ilan.html',
  styleUrls: ['./ilan.css'],
  providers:[],
})
export class Ilan {
  
  ilan: IlanModel[] = [this.createEmpty()];

  locationReady = false;

  constructor(
    private dateAdapter: DateAdapter<Date>,
    private listing: CruiseService,
    private cityApi: CityService, 
  ) {
    this.dateAdapter.setLocale('tr-TR');
  }


  ngOnInit() {
    this.locationReady = true;   
    this.loadCities('');        
  }

  private today00(): Date { const d = new Date(); d.setHours(0,0,0,0); return d; }

  private buildTimes(): string[] {
    const out: string[] = [];
    for (let h = 0; h < 24; h++) out.push(`${h.toString().padStart(2,'0')}:00`);
    return out;

  }
  private createEmpty(): IlanModel {
    return {
      User: { fullName: '', joinedAt: new Date() },
      title: '', maxTitleLen: 60,
      description: '', maxDescLen: 500,
      selectedDate: null, minDate: this.today00(),
      times: this.buildTimes(), selectedTime: null,
      city: null, district: null,
      cityQuery: '', districtQuery: '',
      selectedCity: null, selectedDistrict: null,
      filteredCities: [], filteredDistricts: [],
      loading: false, errors: {},
      selectedCityId: null
    };
  }

  //Şehir / İlçe 
  onCityQueryInput(q: string) {
    if (!this.locationReady) return;           // devre dışı
    this.ilan[0].cityQuery = q;
    this.loadCities(q);
  }
 private loadCities(q: string) {
  if (!this.locationReady) { this.ilan[0].filteredCities = []; return; }

  this.cityApi.getAllCities().subscribe({
    next: (list) => {
      // İstersen burada client-side filtre yaparız (q varsa):
      const qnorm = (q || '').trim().toLowerCase();
      this.ilan[0].filteredCities = qnorm
        ? list.filter(c => c.name.toLowerCase().includes(qnorm))
        : list;
    },
    error: () => this.ilan[0].filteredCities = []
  });
}

  onCitySelected(opt: { id:number; name:string }) {
    if (!this.locationReady) return;           // devre dışı
    const m = this.ilan[0];
    
    m.selectedCityId = opt.id;
    m.selectedCity   = opt.name;
    m.city           = opt.name;

    m.cityQuery = opt.name;

    m.selectedDistrict = null; m.district = null; m.districtQuery = '';
    this.loadDistricts('');
  }

  onDistrictQueryInput(q: string) {
    if (!this.locationReady) return;           // devre dışı
    this.ilan[0].districtQuery = q;
    this.loadDistricts(q);
  }
  private loadDistricts(q: string) {
  const m = this.ilan[0];
  if (!this.locationReady) { m.filteredDistricts = []; return; }
  if (!m.selectedCityId)   { m.filteredDistricts = []; return; }

  this.cityApi.getDistrictsByCity(m.selectedCityId).subscribe({
    next: (list) => {
      const qnorm = (q || '').trim().toLowerCase();
      m.filteredDistricts = qnorm
        ? list.filter(d => d.name.toLowerCase().includes(qnorm))
        : list;
    },
    error: () => m.filteredDistricts = []
  });
}

  onDistrictSelected(opt: { id:number; name:string }) {
    if (!this.locationReady) return;           // devre dışı
    const m = this.ilan[0];
    m.selectedDistrict = opt.name;
    m.district         = opt.name;
    m.districtQuery = opt.name;
  }

  // Saat: bugün seçiliyken geçmiş saatleri kapat
  isPastTimeOnSelectedDate(time: string): boolean {
    const s = this.ilan[0];
    if (!s.selectedDate) return false;
    const now = new Date();
    if (s.selectedDate.toDateString() !== now.toDateString()) return false;
    const [hh, mm] = time.split(':').map(Number);
    const dt = new Date(s.selectedDate); dt.setHours(hh, mm || 0, 0, 0);
    return dt.getTime() <= now.getTime();
  }

  // Validasyon & Submit 
  isValid(): boolean {
    const s = this.ilan[0];
    // Konum zorunlu: backend bağlanana kadar buton pasif kalır
    return !!(s.title?.trim() && s.description?.trim()
      && s.selectedDate && s.selectedTime && s.selectedCity && s.selectedDistrict);
  }
  private buildPayload() {
    const s = this.ilan[0];
    const [hh, mm] = (s.selectedTime || '00:00').split(':').map(Number);
    const when = new Date(s.selectedDate!); when.setHours(hh, mm || 0, 0, 0);
    return {
      title: s.title.trim(),
      description: s.description.trim(),
      dateTime: when.toISOString(),
      city: s.selectedCity!, district: s.selectedDistrict!,
      createdBy: s.User.fullName || 'Anonim'
    };
  }
  createListing() {
    const s = this.ilan[0];
    if (!this.isValid() || s.loading) return;
    s.loading = true;
    this.listing.create(this.buildPayload()).subscribe({
      next: () => { this.ilan[0] = this.createEmpty(); s.loading = false; alert('İlan oluşturuldu!'); },
      error: () => { s.loading = false; alert('İlan oluşturulamadı.'); }
    });
  }
}
