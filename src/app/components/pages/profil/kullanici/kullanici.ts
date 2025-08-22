import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { BadgeDto, ReviewDto, ProfilDetailDto } from '../../../../models/kullanici-model';
import { ProfilDetailService } from '../../../../services/kullanici-service';
import { AuthService } from '../../../../services/auth-service';

type TabKey = 'rozetler' | 'yorumlar' | 'mesaj';

@Component({
  selector: 'app-kullanici',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './kullanici.html',
  styleUrls: ['./kullanici.css']
})
export class Kullanici implements OnInit {
  userId = 0;  // profil sahibinin id'si
  meId  = 0;   // giriş yapan kullanıcı id'si

  // mesaj alanı
  messageText = '';
  isSending = false;

  // sayfa durumu
  isLoading = true;
  error: string | null = null;
  activeTab: TabKey = 'rozetler';

  // View model
  user: ProfilDetailDto = {
    id: 0,
    username: '',
    email: '',
    city: '',
    avatarUrl: '',
    ratingAvg: 0,
    ratingCount: 0,
    birthDate: null,
    bio: null
  };
  badges: BadgeDto[] = [];
  reviews: ReviewDto[] = [];

  // UI durumları
  sendOk = false;          // başarı bildirimi
  showComposer = true;     // yazma kutusu görünür mü
  private successTimer: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private profil: ProfilDetailService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.meId = this.auth.currentUserId() ?? Number(localStorage.getItem('userId') || 0);

    this.route.paramMap.subscribe(p => {
      const id = Number(p.get('id')) || 0;
      if (id && id !== this.userId) {
        this.userId = id;
        this.loadUser(id);
      }
    });
  }

  private loadUser(id: number): void {
    this.isLoading = true;
    this.error = null;

    this.profil.getById(id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (u: ProfilDetailDto) => { this.user = u; },
        error: (err) => {
          console.error('getById error', err);
          this.error = 'Kullanıcı bulunamadı.';
        }
      });
  }

  get displayName(): string {
    const u: any = this.user as any;
    return (u.username || u.userName || '').trim();
  }

  get initialLetter(): string { return '😎'; }

  setTab(tab: TabKey): void {
    this.activeTab = tab;
    if (tab === 'mesaj') {
      this.showComposer = true;  // Mesaj sekmesine dönünce kutu açılsın
      this.sendOk = false;       // eski başarı tostu kapansın
    }
  }

  onMessageInput(ev: Event): void {
    this.messageText = (ev.target as HTMLTextAreaElement).value ?? '';
  }

  sendMessage(): void {
    const text = (this.messageText || '').trim();
    if (!text || !this.meId || !this.userId) return;

    this.isSending = true;

    this.profil.send({
      senderId: this.meId,
      receiverId: this.userId,
      content: text,
      createdAt: new Date().toISOString()
    })
    .pipe(finalize(() => (this.isSending = false)))
    .subscribe({
      next: () => {
        this.messageText = '';
        this.showComposer = false;   // kutuyu kapat
        this.sendOk = true;          // 🎉 göster
        if (this.successTimer) clearTimeout(this.successTimer);
        this.successTimer = setTimeout(() => (this.sendOk = false), 3000);
      },
      error: (err) => {
        console.error('POST ERROR', err);
      }
    });
  }

  newMessage(): void {
    this.sendOk = false;
    this.showComposer = true;
    this.messageText = '';
  }

  onEnter(ev: KeyboardEvent): void {
    if (ev.ctrlKey || ev.metaKey) {
      ev.preventDefault();
      this.sendMessage();
    }
  }

  goBack(): void {
    if (history.length > 1) history.back();
    else this.router.navigateByUrl('/hesabim');
  }
}
