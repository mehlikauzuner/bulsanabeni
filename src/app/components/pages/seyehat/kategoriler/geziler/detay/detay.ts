// components/pages/seyehat/kategoriler/geziler/detay/detay.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DetayModel } from '../../../../../../models/detay-model';
import { GezilerService } from '../../../../../../services/geziler-service';
import { ProfilDetailService } from '../../../../../../services/kullanici-service';
import { AuthService } from '../../../../../../services/auth-service';
import { BadgeAwardResultDto, EventAttendanceCreateDto, UserBadgeDto } from '../../../../../../models/kullanici-model';

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
    private geziler: GezilerService,
    private profile: ProfilDetailService,
  private auth: AuthService

  ) {}


  ilan: DetayModel | null = null;
  loading = false;
  error: string | null = null;

  
  sending = false;
  sendOk = false;
  sendErr: string | null = null;

  newlyAwarded: UserBadgeDto[] = [];


  get hasNewBadges(): boolean {
  return (this.newlyAwarded?.length ?? 0) > 0;
}


  private getCurrentUserId(): number | null {
  const v = (this.auth as any).currentUserId?.() ?? (this.auth as any).currentUserId ?? null;
  if (v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : null;
}
  
  get ownerName(): string {
    return this.ilan ? (this.ilan.userName ?? '—') : 'Kullanıcı';
  }

  get ownerInitial(): string {
    const name = this.ownerName?.trim() || '👻';
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


  ngOnInit(): void {
    const raw = this.route.snapshot.paramMap.get('id');
    const id = raw ? parseInt(raw, 10) : NaN;
    if (Number.isNaN(id) || id <= 0) {
      this.error = 'Geçersiz ilan numarası.';
      return;
    }
    this.fetch(id);
  }

  
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

  
  onSeniBuldum() {
    if (!this.ilan?.id) return;

    this.sending = true;
    this.sendOk = false;
    this.sendErr = null;

  
    this.geziler.notifyFound(this.ilan.id).subscribe({
      next: () => {
        this.sending = false;
        this.sendOk = true;
      },
      error: (err) => {
        console.error('[GezilerDetay] Bildirim hatası:', err);
        this.sending = false;
        this.sendErr = err?.error?.message || `Bildirim gönderilemedi (HTTP ${err?.status ?? '??'}).`;
      }
    });

     this.newlyAwarded = [];          
  this.geziler.notifyFound(this.ilan.id).subscribe({
    next: () => {
      const userId = this.getCurrentUserId();  
      if (!userId) { this.sending=false; this.sendErr='Kullanıcı kimliği bulunamadı (giriş yapınız).'; return; }

      const body: EventAttendanceCreateDto = { userId, eventId: this.ilan!.id }; 

      this.profile.attendAndAward(body).subscribe({   
        next: (res: BadgeAwardResultDto) => {
          this.newlyAwarded = res?.newlyAwarded || [];
          this.sending = false;
          this.sendOk = true;
        },
        error: (err) => {
          this.sending = false;
          this.sendErr = err?.error?.message || `Rozet ödüllendirme başarısız (HTTP ${err?.status ?? '??'}).`;
        }
      });
    },
  
  });
  }}
