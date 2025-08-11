import { Component, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats, MatNativeDateModule } from '@angular/material/core';
import { LocalizedString } from '@angular/compiler';
import localeTr from '@angular/common/locales/tr';




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
    MatNativeDateModule],
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

  constructor(private dateAdapter: DateAdapter<Date>) {
    // Material DateAdapter locale
    this.dateAdapter.setLocale('tr-TR');
  }


  ngOnInit() {
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
}