// src/app/components/pages/seyehat/kategoriler/geziler/geziler.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DetayModel } from '../../../../../models/detay-model';
import { CruiseService } from '../../../../../services/cruise-service';

@Component({
  selector: 'app-geziler-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './geziler.html',
  styleUrls: ['./geziler.css']
})
export class Geziler {
  loading = true;
  error: string | null = null;

  // Kartlarda döneceğimiz liste
  items: DetayModel[] = [];

  // *ngFor performansı için
  trackById = (i: number, nesne: DetayModel) => nesne.id ?? i;

  constructor(private api: CruiseService) {}

  ngOnInit() {
    // Backend’den listeyi çek
    this.api.list().subscribe({
      next: (data) => { this.items = data; this.loading = false; },
      error: () => { this.error = 'İlanlar yüklenemedi.'; this.loading = false; }
    });


  }
}
