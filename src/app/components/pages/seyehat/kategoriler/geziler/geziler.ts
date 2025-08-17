import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { GezilerService } from '../../../../../services/geziler-service';
import { DetayModel } from '../../../../../models/detay-model';


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

  // 5 sütun x 2 satır = 10 kart; ilk kart sabit olduğundan 9 ilan göster
  readonly perPage = 9;
  page = 1;

  constructor(private svc: GezilerService, private router: Router) {}

  ngOnInit(): void { this.fetch(); }

  fetch() {
    this.loading = true;
    this.error = null;
    this.svc.getAllIlanlar().subscribe({
      next: (list) => { this.ilanlar = list ?? []; this.loading = false; },
      error: (err) => { this.error = err?.error?.message || 'İlanlar alınamadı.'; this.loading = false; }
    });
  }

  get visibleIlanlar(): DetayModel[] {
    const start = (this.page - 1) * this.perPage;
    return this.ilanlar.slice(start, start + this.perPage);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil((this.ilanlar?.length || 0) / this.perPage));
  }

  prev() { if (this.page > 1) this.page--; }
  next() { if (this.page < this.totalPages) this.page++; }

  goCreate() { this.router.navigate(['/seyehat/geziler/ilan']); }
  // goDetail kaldırıldı
}
