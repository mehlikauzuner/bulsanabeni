// components/pages/seyehat/kategoriler/geziler/detay/detay.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DetayModel } from '../../../../../../models/detay-model';
import { GezilerService } from '../../../../../../services/geziler-service';

@Component({
  selector: 'app-geziler-detay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detay.html',
  styleUrls: ['./detay.css'],
})
export class GezilerDetay implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private geziler: GezilerService
  ) {}

  // ---- State ----
  ilan: DetayModel | null = null;
  loading = false;
  error: string | null = null;

  // Bildirim bayrakları
  sending = false;
  sendOk = false;
  sendErr: string | null = null;

  // ---- Görünüm yardımcıları ----
  get ownerName(): string {
    return this.ilan ? (this.ilan.userName ?? '—') : 'Kullanıcı';
  }
  get ownerInitial(): string {
    const name = this.ownerName?.trim() || 'U';
    return name.charAt(0).toUpperCase();
  }
  get dateText(): string {
    if (!this.ilan?.date) return '—';
    const d = new Date(this.ilan.date);
    return isNaN(d.getTime())
      ? this.ilan.date
      : d.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' });
  }
  get timeText(): string {
    const t = this.ilan?.time ?? '';
    if (!t) return '—';
    return t.slice(0, 5);
  }
  get locationText(): string {
    const c = this.ilan?.city || '';
    const d = this.ilan?.district || '';
    if (!c && !d) return '—';
    if (c && d) return `${c} / ${d}`;
    return c || d;
  }

  // ---- Lifecycle ----
  ngOnInit(): void {
    const raw = this.route.snapshot.paramMap.get('id');
    const id = raw ? parseInt(raw, 10) : NaN;
    if (Number.isNaN(id) || id <= 0) {
      this.error = 'Geçersiz ilan numarası.';
      return;
    }
    this.fetch(id);
  }

  // ---- Data ----
  private fetch(id: number) {
    this.loading = true;
    this.error = null;
    this.ilan = null;

    this.geziler.getIlanById(id).subscribe({
      next: (res) => { this.ilan = res; this.loading = false; },
      error: (err) => {
        console.error('[GezilerDetay] GET error:', err);
        this.error = err?.error?.message || 'İlan bilgileri alınamadı.';
        this.loading = false;
      }
    });
  }

  // ---- “Seni buldum” ----
  onSeniBuldum() {
    if (!this.ilan?.id) return;

    this.sending = true;
    this.sendOk = false;
    this.sendErr = null;

    // Önerilen: sadece ilanId gönder (receiver backend'de ilan sahibinden bulunur)
    this.geziler.notifyFound(this.ilan.id).subscribe({
      next: () => {
        this.sending = false;
        this.sendOk = true;
        console.log('[GezilerDetay] Bildirim gönderildi.');
      },
      error: (err) => {
        console.error('[GezilerDetay] Bildirim hatası:', err);
        this.sending = false;
        this.sendErr = err?.error?.message || `Bildirim gönderilemedi (HTTP ${err?.status ?? '??'}).`;
      }
    });

    /* Eğer backend explicitly { ilanId, receiverUserId } bekliyorsa, üstteki yerine:
    const payload = { ilanId: this.ilan.id, receiverUserId: this.ilan.userId };
    this.geziler.notifyFound(payload).subscribe({ ...aynı next/error... });
    */
  }
}
