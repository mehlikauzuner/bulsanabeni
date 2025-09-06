import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventDto } from '../../../models/event-model';
import { AdminEventsService } from '../../../services/event-service';

@Component({
  selector: 'app-admin-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './etkinliks.html',
  styleUrls: ['./etkinliks.css']
})
export class AdminEvents implements OnInit {
  rows: EventDto[] = [];
  loading = false;
  error = '';
  info = '';
  selectedCategoryId: number | null = null;

  constructor(private api: AdminEventsService) {}

  ngOnInit(): void { this.fetch(); }

 private normalize(x: any): EventDto {
    return {
      id: x.id ?? x.Id,
      categoryId: x.categoryId ?? x.CategoryId ?? 0,
      eventName: x.eventName ?? x.EventName ?? ''
    };
  }

  chooseCategory() {
    const s = prompt('CategoryId (listelemek için zorunlu)');
    if (s == null) return; // iptal
    const id = Number(s);
    if (!Number.isFinite(id)) { alert('Geçersiz CategoryId'); return; }
    this.selectedCategoryId = id;
    this.fetch();
  }

  fetch() {
    if (this.selectedCategoryId == null) return;
    this.loading = true; this.error = ''; this.info = '';
    this.api.listByCategory(this.selectedCategoryId).subscribe({
      next: (res: any) => {
        const raw = Array.isArray(res) ? res : (res?.data ?? []);
        this.rows = raw.map((x: any) => this.normalize(x));
        this.loading = false;
      },
      error: (err) => { console.error('EVENTS_LIST_ERR', err); this.error = 'Liste alınamadı.'; this.loading = false; }
    });
  }

  addEvent() {
    // varsayılan olarak seçili kategoriye ekleyelim
    let categoryId = this.selectedCategoryId ?? NaN;
    if (!Number.isFinite(categoryId)) {
      const s = prompt('CategoryId (zorunlu)') ?? '';
      categoryId = Number(s);
      if (!Number.isFinite(categoryId)) { alert('Geçersiz CategoryId'); return; }
    }
    const eventName = (prompt('EventName (zorunlu)') ?? '').trim();
    if (!eventName) return;

    this.info = ''; this.error = '';
    this.api.add({ categoryId, eventName }).subscribe({
      next: () => { this.info = 'Event eklendi.'; this.fetch(); },
      error: (err) => { console.error('EVENT_ADD_ERR', err); this.error = 'Ekleme başarısız.'; }
    });
  }

  editEventName(e: EventDto) {
    const name = prompt('Yeni EventName', e.eventName) ?? e.eventName;
    if (!name.trim()) return;
    this.info = ''; this.error = '';
    this.api.updateName(e.id, name.trim()).subscribe({
      next: () => { this.info = 'Event adı güncellendi.'; this.fetch(); },
      error: (err) => { console.error('EVENT_UPDATE_ERR', err); this.error = 'Güncelleme başarısız.'; }
    });
  }

  changeCategory(e: EventDto) {
    const s = prompt('Yeni CategoryId', String(e.categoryId)) ?? String(e.categoryId);
    const categoryId = Number(s);
    if (!Number.isFinite(categoryId)) { alert('Geçersiz CategoryId'); return; }
    this.info = ''; this.error = '';
    this.api.updateCategory(e.id, categoryId, e.eventName).subscribe({
      next: () => { this.info = 'Event kategorisi güncellendi.'; this.fetch(); },
      error: (err) => { console.error('EVENT_UPDCAT_ERR', err); this.error = 'Kategori güncelleme başarısız.'; }
    });
  }

  deleteEvent(e: EventDto) {
    if (!confirm(`#${e.id} - "${e.eventName}" silinsin mi?`)) return;
    this.info = ''; this.error = '';
    this.api.delete(e.id).subscribe({
      next: () => { this.info = 'Event silindi.'; this.fetch(); },
      error: (err) => { console.error('EVENT_DEL_ERR', err); this.error = 'Silme başarısız.'; }
    });
  }
}