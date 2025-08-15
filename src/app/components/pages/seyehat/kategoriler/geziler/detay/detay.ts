// src/app/components/pages/ilan-detay/ilan-detay.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CruiseService } from '../../../../../../services/cruise-service';
import { DetayModel } from '../../../../../../models/detay-model';

@Component({
  selector: 'app-ilan-detay',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detay.html',
  styleUrls: ['./detay.css'],
})
export class Detay implements OnInit {
  loading = true;
  error: string | null = null;
  ilan: DetayModel | null = null;
  notifying = false;

  constructor(
    private route: ActivatedRoute,
    private api: CruiseService
  ) {}

  ngOnInit() {
    // URL'den :id al ve doğrula
    const raw = this.route.snapshot.paramMap.get('id');
    const id = raw ? Number(raw) : NaN;
    if (Number.isNaN(id)) {
      this.error = 'Geçersiz ilan numarası';
      this.loading = false;
      return;
    }

    // Sadece DB'den çek
    this.api.getById(id).subscribe({
      next: (d) => { this.ilan = d; this.loading = false; },
      error: () => { this.error = 'İlan bulunamadı'; this.loading = false; }
    });
  }

  onBulBeniClick() {
    if (!this.ilan || this.notifying) return;
    this.notifying = true;
    // TODO: bildirim endpoint'ine bağla
    alert('Bul Beni tıklandı!');
    this.notifying = false;
  }
}
