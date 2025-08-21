import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BadgeDto, ReviewDto, UserDto, ProfilDetailDto } from '../../../../models/kullanici-model';
import { ProfilDetailService } from '../../../../services/kullanici-service';


type TabKey = 'rozetler' | 'yorumlar' | 'mesaj';

@Component({
  selector: 'app-kullanici',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './kullanici.html',
  styleUrls: ['./kullanici.css']   // <-- düzeltildi
})
export class Kullanici {
  userId = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private profil: ProfilDetailService       // <-- servis eklendi
  ) {}

  ngOnInit() {
    // ❌ this.bootstrapLoad();  // kaldır
    this.route.paramMap.subscribe(p => {
      const id = Number(p.get('id')) || 0;
      if (id && id !== this.userId) {
        this.userId = id;
        this.loadUser(id);
      }
    });
  }

  private loadUser(id: number) {
    this.isLoading = true;
    this.error = null;

    this.profil.getById(id).subscribe({
      next: (u) => {
        this.user = u;                  // backend’den gelen gerçek veri
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Kullanıcı bulunamadı.';
        this.isLoading = false;
      }
    });
  }

  // UI state
  isLoading = true;
  error: string | null = null;
  activeTab: TabKey = 'rozetler';

  // View model (ProfilDetailDto'ya yükselttik)
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

// kullanici.ts
get displayName(): string {
  // API userName gönderdiyse de yakala
  const u: any = this.user as any;
  return (u.username || u.userName || '').trim();
}

get initialLetter(): string {
  const n = this.displayName;
  return n ? n.charAt(0).toUpperCase() : 'U';
}



  // Mesaj kutusu
  messageText = '';
  isSending = false;

  setTab(tab: TabKey) { this.activeTab = tab; }

  onMessageInput(ev: Event) {
    this.messageText = (ev.target as HTMLTextAreaElement).value ?? '';
  }

  async sendMessage() {
    const text = (this.messageText || '').trim();
    if (!text) return;
    try {
      this.isSending = true;
      console.log('Mesaj gönder:', { to: this.userId, text });
      this.messageText = '';
    } finally {
      this.isSending = false;
    }
  }

  goBack() {
    if (history.length > 1) history.back();
    else this.router.navigateByUrl('/hesabim');
  }

}
