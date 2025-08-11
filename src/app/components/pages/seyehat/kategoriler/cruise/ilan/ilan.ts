import { Component, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ilan',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ilan.html',
  styleUrls: ['./ilan.css'],
  providers: [{ provide: LOCALE_ID, useValue: 'tr-TR' }],
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

  // tarih dropdown verileri
  days: number[] = [];
  months: string[] = [
    'Ocak','Şubat','Mart','Nisan','Mayıs','Haziran',
    'Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'
  ];
  years: number[] = [];

  // saat slotları (60 dk)
  times: string[] = [];

  // Seçili değerler → placeholder görünsün diye null
  selectedDay: number | null = null;
  selectedMonth: string | null = null;
  selectedYear: number | null = null;
  selectedTime: string | null = null;

  today = new Date();

  ngOnInit() {
    // Gün: 1-31
    this.days = Array.from({ length: 31 }, (_, i) => i + 1);

    // Yıl: bu yıl ve +1
    const thisYear = this.today.getFullYear();
    this.years = [thisYear, thisYear + 1];

    // Saat: 06:00 - 22:00 (60 dk)
    for (let hour = 6; hour <= 24; hour++) {
      this.times.push(`${hour.toString().padStart(2, '0')}:00`);
    }

    // Not: placeholder için varsayılan seçim YAPMIYORUZ.
  }

  // null güvenli geçmiş kontrolü
  isPastOption(
    day?: number | null,
    month?: string | null,
    year?: number | null,
    time?: string | null
  ): boolean {
    if (day == null || month == null || year == null || time == null) return false; // seçim tamamlanmadı
    const monthIndex = this.months.indexOf(month);
    if (monthIndex < 0) return false;

    const [h, m] = time.split(':').map(Number);
    const optionDateTime = new Date(year, monthIndex, day, h, m || 0);

    const now = new Date();
    now.setSeconds(0, 0);

    return optionDateTime.getTime() <= now.getTime();
  }
}
