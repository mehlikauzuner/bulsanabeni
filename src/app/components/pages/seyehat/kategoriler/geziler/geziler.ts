import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DetayModel } from '../../../../../models/detay-model';
import { GezilerService } from '../../../../../services/geziler-service';

@Component({
  selector: 'app-geziler',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './geziler.html',
  styleUrls: ['./geziler.css'],
})
export class Geziler implements OnInit {
  loading = false;
  error: string | null = null;
  ilanlar: DetayModel[] = [];

  constructor(private svc: GezilerService, private router: Router) {}

  ngOnInit(): void { this.fetch(); }

  fetch() {
    this.loading = true;
    this.error = null;
    this.svc.getAllIlanlar().subscribe({
      next: (list: any[]) => {
        this.ilanlar = (list ?? []).map(this.normalizeItem);
        this.loading = false;
      },
      error: (err) => {
        console.error('[GezilerListe] load error:', err);
        this.error = err?.error?.message || 'İlanlar alınamadı.';
        this.loading = false;
      }
    });
  }

  private normalizeItem = (raw: any): DetayModel => ({
    id: raw.id ?? raw.Id,
    userId: raw.userId ?? raw.UserId ?? 0,
    title: raw.title ?? raw.Title ?? '',
    description: raw.description ?? raw.Description ?? '',
    date: raw.date ?? raw.Date ?? '',
    time: raw.time ?? raw.Time ?? '',
    city: raw.city ?? raw.City ?? '',
    district: raw.district ?? raw.District ?? '',
  });

  goCreate() { this.router.navigate(['/seyehat/geziler/ilan']); }
  goDetail(id: number) { this.router.navigate(['/seyehat/geziler', id]); }
  trackById = (_: number, item: DetayModel) => item.id;
}
