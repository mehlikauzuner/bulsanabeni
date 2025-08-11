import { Component, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats, MatNativeDateModule } from '@angular/material/core';
import { LocalizedString } from '@angular/compiler';
import localeTr from '@angular/common/locales/tr';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { HttpClient } from '@angular/common/http';





registerLocaleData(localeTr); // <-- local**e**Tr

const TR_DATE_FORMATS: MatDateFormats = {
  parse:   { dateInput: 'l' },
  display: {
    dateInput: 'd MMMM y',     // 11 Ağustos 2025
    monthYearLabel: 'MMMM y',
    dateA11yLabel: 'd MMMM y',
    monthYearA11yLabel: 'MMMM y'
  }
};


@Component({
  selector: 'app-ilan',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule, MatAutocompleteModule],
  templateUrl: './ilan.html',
  styleUrls: ['./ilan.css'],
  providers: [{ provide: LOCALE_ID, useValue: 'tr-TR' }, { provide: MAT_DATE_LOCALE, useValue: 'tr-TR' },
    { provide: MAT_DATE_FORMATS, useValue: TR_DATE_FORMATS },],
})
export class Ilan {
  // kullanıcı bilgisi mock
  user = { fullName: 'Mehmet Yılmaz', joinedAt: new Date(2024, 3, 24) };

  // başlık
  title = '';
  maxTitleLen = 60;

  // açıklama
  description = '';
  maxDescLen = 500;

  // === YENİ: Takvim tarihi ===
  selectedDate: Date | null = null;
  minDate = (() => { const d = new Date(); d.setHours(0,0,0,0); return d; })();

  // Saat slotları (60 dk)
  times: string[] = [];
  selectedTime: string | null = null;

  constructor(private dateAdapter: DateAdapter<Date>, private http: HttpClient) {
  this.dateAdapter.setLocale('tr-TR');
}




  cities: string[] = [
  'Adana','Adıyaman','Afyonkarahisar','Ağrı','Aksaray','Amasya','Ankara','Antalya','Artvin','Aydın',
  'Balıkesir','Bartın','Batman','Bayburt','Bilecik','Bingöl','Bitlis','Bolu','Burdur','Bursa',
  'Çanakkale','Çankırı','Çorum','Denizli','Diyarbakır','Düzce','Edirne','Elazığ','Erzincan','Erzurum',
  'Eskişehir','Gaziantep','Giresun','Gümüşhane','Hakkari','Hatay','Iğdır','Isparta','İstanbul','İzmir',
  'Kahramanmaraş','Karabük','Karaman','Kars','Kastamonu','Kayseri','Kırıkkale','Kırklareli','Kırşehir',
  'Kilis','Kocaeli','Konya','Kütahya','Malatya','Manisa','Mardin','Mersin','Muğla','Muş','Nevşehir',
  'Niğde','Ordu','Osmaniye','Rize','Sakarya','Samsun','Siirt','Sinop','Sivas','Şanlıurfa','Şırnak',
  'Tekirdağ','Tokat','Trabzon','Tunceli','Uşak','Van','Yalova','Yozgat','Zonguldak'
];

// İl → ilçe haritası (örnek; backend’e bağlandığında burayı API ile dolduracağız)
districtMap: Record<string, string[]> = {
  Ankara: ['Çankaya','Keçiören','Mamak','Sincan','Yenimahalle'],
  İstanbul: ['Kadıköy','Beşiktaş','Üsküdar','Bakırköy','Şişli'],
  İzmir: ['Konak','Karşıyaka','Bornova','Buca','Gaziemir'],
  Antalya: ['Muratpaşa','Kepez','Alanya','Konyaaltı'],
  Adana: ['Seyhan','Yüreğir','Çukurova'],
};

// Arama inputları + seçili değerler
cityQuery: string = '';
districtQuery: string = '';
selectedCity: string | null = null;
selectedDistrict: string | null = null;

// Filtrelenmiş listeler
filteredCities: string[] = [];
filteredDistricts: string[] = [];



  ngOnInit() {

  this.filteredCities = [...this.cities];
  this.filteredDistricts = [];
    // 06:00–22:00 slotları
    for (let h = 6; h <= 22; h++) this.times.push(`${h.toString().padStart(2,'0')}:00`);
  }

  // Bugün seçiliyken geçmiş saatleri devre dışı bırak
  isPastTimeOnSelectedDate(time: string): boolean {
    if (!this.selectedDate) return false;
    const today = new Date();
    if (this.selectedDate.toDateString() !== today.toDateString()) return false;

    const [hh, mm] = time.split(':').map(Number);
    const dt = new Date(this.selectedDate);
    dt.setHours(hh, mm || 0, 0, 0);
    return dt.getTime() <= today.getTime();
  }
  


  filterCities() {
  const q = this.cityQuery.trim().toLowerCase();
  this.filteredCities = this.cities.filter(c => c.toLowerCase().includes(q));
}

onCitySelected(city: string) {
  this.selectedCity = city;
  this.cityQuery = city;           // input’ta seçilen değeri göster
  this.selectedDistrict = null;
  this.districtQuery = '';
  this.filteredDistricts = this.districtMap[city] ? [...this.districtMap[city]] : [];
}

filterDistricts() {
  if (!this.selectedCity) { this.filteredDistricts = []; return; }
  const q = this.districtQuery.trim().toLowerCase();
  const list = this.districtMap[this.selectedCity] || [];
  this.filteredDistricts = list.filter(d => d.toLowerCase().includes(q));
}

onDistrictSelected(d: string) {
  this.selectedDistrict = d;
  this.districtQuery = d;
}


loading = false;

isValid(): boolean {
  return !!(
    this.title?.trim() &&
    this.description?.trim() &&
    this.selectedDate &&
    this.selectedTime &&
    this.selectedCity &&
    this.selectedDistrict
  );
}

private buildPayload() {
  // selectedDate + selectedTime => ISO
  const [hh, mm] = (this.selectedTime || '00:00').split(':').map(Number);
  const when = new Date(this.selectedDate!);
  when.setHours(hh, mm || 0, 0, 0);

  return {
    title: this.title.trim(),
    description: this.description.trim(),
    dateTime: when.toISOString(),
    city: this.selectedCity,
    district: this.selectedDistrict,
    createdBy: this.user.fullName,
  };
}

createListing() {
  if (!this.isValid() || this.loading) return;
  this.loading = true;

  const payload = this.buildPayload();

  // API endpointini kendine göre değiştir
  this.http.post('/api/listings', payload).subscribe({
    next: () => {
      this.loading = false;
      // basit reset
      this.title = '';
      this.description = '';
      this.selectedDate = null;
      this.selectedTime = null;
      this.cityQuery = '';
      this.districtQuery = '';
      this.selectedCity = null;
      this.selectedDistrict = null;
      this.filteredCities = [...this.cities];
      this.filteredDistricts = [];
      alert('İlan oluşturuldu!');
    },
    error: (err) => {
      this.loading = false;
      console.error(err);
      alert('İlan oluşturulamadı. Lütfen tekrar deneyin.');
    }
  });
}



}