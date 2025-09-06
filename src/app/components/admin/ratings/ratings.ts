import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingDto } from '../../../models/rating-model';
import { AdminRatingsService } from '../../../services/rating-service';

@Component({
  selector: 'app-admin-ratings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ratings.html',
  styleUrls: ['./ratings.css']
})
export class AdminRatings implements OnInit {
  rows: RatingDto[] = [];
  loading = false;
  error = '';
  info = '';
  selectedTargetId: number | null = null;

  // opsiyonel özet
  avg: number | null = null;
  count: number | null = null;

  constructor(private api: AdminRatingsService) {}

  ngOnInit(): void {
    this.pickTarget();
  }

private normalize(x: any): RatingDto {
  return {
    targetUserId: Number(x.targetUserId ?? x.TargetUserId ?? 0),
    raterId:      Number(x.raterId      ?? x.RaterId      ?? 0),
    score:        Number(x.score        ?? x.Score        ?? 0),
  };
}




  pickTarget() {
    const s = prompt('Hedef (Target) User ID?');
    if (s == null) return;
    const id = Number(s);
    if (!Number.isFinite(id)) { alert('Geçersiz ID'); return; }
    this.selectedTargetId = id;
    this.fetch();
  }

  fetch() {
    if (this.selectedTargetId == null) return;
    this.loading = true; this.error = ''; this.info = '';

   this.api.listByTarget(this.selectedTargetId!).subscribe({
  next: (res: any) => {
    const raw = Array.isArray(res) ? res : (res?.data ?? []);
    console.log('RAW_SAMPLE', raw?.[0]);
    console.log('RAW_KEYS', raw?.[0] ? Object.keys(raw[0]) : []);
    this.rows = raw.map((x: any) => this.normalize(x));
    this.loading = false;
  },
  error: (err) => { /* aynı */ }
});


    // özet (isteğe bağlı)
    this.api.summary(this.selectedTargetId).subscribe({
      next: (s) => { this.avg = s?.avg ?? null; this.count = s?.count ?? null; },
      error: () => { this.avg = this.count = null; }
    });
  }

  add() {
    if (this.selectedTargetId == null) { alert('Önce target seç'); return; }
    const raterStr = (prompt('RaterId (puan veren kullanıcı)') ?? '').trim();
    const scoreStr = (prompt('Score (1..5)') ?? '').trim();
    const raterId = Number(raterStr);
    const score = Number(scoreStr);
    if (!Number.isFinite(raterId)) { alert('Geçersiz RaterId'); return; }
    if (!Number.isFinite(score) || score < 1 || score > 5) { alert('Score 1..5 olmalı'); return; }

    this.info = ''; this.error = '';
    this.api.add({ targetUserId: this.selectedTargetId, raterId, score }).subscribe({
      next: () => { this.info = 'Rating eklendi.'; this.fetch(); },
      error: (err) => { console.error('RATING_ADD_ERR', err); this.error = 'Ekleme başarısız.'; }
    });
  }

 deleteByUser(row?: RatingDto) {
  const targetId = this.selectedTargetId!;
  const raterId  = row ? row.raterId : Number(prompt('RaterId?'));
  if (!Number.isFinite(targetId) || !Number.isFinite(raterId)) { alert('Geçersiz ID'); return; }

  this.info = ''; this.error = '';
  this.api.deleteByUser(targetId, raterId).subscribe({
    next: () => { this.info = `Target ${targetId} için Rater ${raterId} silindi.`; this.fetch(); },
    error: (err) => { console.error('RATING_DELUSER_ERR', err); this.error = 'Silme başarısız.'; }
  });
}

}
