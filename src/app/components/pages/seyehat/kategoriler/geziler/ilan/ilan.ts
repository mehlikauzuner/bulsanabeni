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

  // ===== Başlık / Açıklama =====
  readonly maxTitleLen = 200;
  readonly maxDescLen = 500;
  title = '';
  description = '';

  // ===== Tarih & Saat (PrimeNG) =====
  eventDate: Date | null = null; // tarih + saat tek yerde
  minDate = new Date();
  maxDate = new Date(new Date().setFullYear(new Date().getFullYear() + 30));
  eventTime: Date = new Date();
  selectedTime: string | null = null; // "HH:mm" (ör: "14:30")


  timeOptions = Array.from({length: 24*4}, (_,i)=>{
    const h = String(Math.floor(i/4)).padStart(2,'0');
    const m = String((i%4)*15).padStart(2,'0');
    return `${h}:${m}`;
  });

  // ISO birleştirme örneği (gönderirken kullan)
  get combinedIso(): string | null {
    if (!this.eventDate || !this.selectedTime) return null;
    const [hh, mm] = this.selectedTime.split(':').map(Number);
    const d = new Date(this.eventDate);
    d.setHours(hh, mm, 0, 0);
    return d.toISOString();
  }

  // PrimeNG locale (TR)
  tr = {
    firstDayOfWeek: 1,
    dayNames: ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'],
    dayNamesShort: ['Paz','Pts','Sal','Çar','Per','Cum','Cts'],
    dayNamesMin: ['Pz','Pt','Sa','Ça','Pe','Cu','Ct'],
    monthNames: ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'],
    monthNamesShort: ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'],
    today: 'Bugün',
    clear: 'Temizle',
    dateFormat: 'yy-mm-dd'
  };

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
    const d = this.eventDate;

    const dateStr = d
      ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
      : null;

    const hh = d ? String(d.getHours()).padStart(2, '0') : '00';
    const isoDateTime = this.combinedIso;
    const timeString  = this.selectedTime ? this.selectedTime + ':00' : null;

    const userName = this.auth.currentUserName() ?? 'Kullanıcı';
    const userId = this.auth.currentUserId() ?? 0;

    return {
      title: this.title.trim(),
      description: this.description.trim(),
      date: isoDateTime,
      time: `${hh}:00:00`, // backend bekliyorsa kalsın

      // NOT NULL alanlar
      cityName: this.selectedCityName,
      district: this.selectedDistrictName,
      userName,

      // opsiyoneller
      userId,
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
      this.eventDate instanceof Date
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
