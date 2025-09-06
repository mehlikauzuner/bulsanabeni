import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GezilerDto, GezilerUpdateDto } from '../../../models/geziler-model';
import { AdminGezilerService } from '../../../services/admin-geziler-service';

@Component({
  selector: 'app-admin-geziler',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gezilers.html',
  styleUrls: ['./gezilers.css']
})
export class AdminGeziler implements OnInit {
  rows: GezilerDto[] = [];
  loading = false;
  error = '';
  info = '';

  constructor(private api: AdminGezilerService) {}

  ngOnInit(): void { this.fetch(); }

  private normalize(x: any): GezilerDto {
    const rawDate = x.date ?? x.Date ?? '';
    const iso = rawDate ? new Date(rawDate).toISOString() : '';
    return {
      id: x.id ?? x.Id ?? x.geziId ?? 0,
      userName: x.userName ?? x.UserName ?? '',
      title: x.title ?? x.Title ?? '',
      description: x.description ?? x.Description ?? '',
      date: iso,
      cityName: x.cityName ?? x.CityName ?? '',
      district: x.district ?? x.District ?? '',
      createdBy: x.createdBy ?? x.CreatedBy ?? undefined
    };
  }

  fetch() {
    this.loading = true; this.error = ''; this.info = '';
    this.api.list().subscribe({
      next: (res: any) => {
        const raw = Array.isArray(res) ? res : (res?.data ?? []);
        this.rows = raw.map((x: any) => this.normalize(x));
        this.loading = false;
      },
      error: (err) => {
        console.error('GEZILER_LIST_ERR', err);
        this.error = 'Liste alınamadı.';
        this.loading = false;
      }
    });
  }

  edit(row: GezilerDto) {
    if (!row.id) { alert('Bu kaydın Id değeri yok, güncellenemez.'); return; }

    const title = (prompt('Title', row.title) ?? row.title).trim();
    if (!title) return;

    const description = (prompt('Description', row.description) ?? row.description).trim();

    const cur = row.date ? row.date.slice(0,10) : '';
    const dStr = (prompt('Date (YYYY-MM-DD)', cur) ?? cur).trim();
    if (dStr && isNaN(Date.parse(dStr))) { alert('Tarih formatı: YYYY-MM-DD'); return; }
    const dateIso = dStr ? new Date(dStr).toISOString() : row.date;

    const cityName = (prompt('CityName', row.cityName) ?? row.cityName).trim();
    const district = (prompt('District', row.district) ?? row.district).trim();

    const dto: GezilerUpdateDto = {
      id: row.id,
      title,
      description,
      date: dateIso,
      cityName,
      district
    };

    this.info = ''; this.error = '';
    this.api.update(dto).subscribe({
      next: () => { this.info = 'Kayıt güncellendi.'; this.fetch(); },
      error: (err) => { console.error('GEZI_UPD_ERR', err); this.error = 'Güncelleme başarısız.'; }
    });
  }

  remove(row: GezilerDto) {
    if (!row.id) { alert('Bu kaydın Id değeri yok, silinemez.'); return; }
    if (!confirm(`#${row.id} - "${row.title}" silinsin mi?`)) return;

    this.info = ''; this.error = '';
    this.api.delete(row.id).subscribe({
      next: () => { this.info = 'Kayıt silindi.'; this.fetch(); },
      error: (err) => { console.error('GEZI_DEL_ERR', err); this.error = 'Silme başarısız.'; }
    });
  }

  shortDate(iso: string) { return iso ? iso.slice(0,10) : ''; }
}

