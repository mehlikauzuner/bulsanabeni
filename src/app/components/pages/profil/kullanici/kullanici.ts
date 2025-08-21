import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BadgeDto, ReviewDto, UserDto } from '../../../../models/kullanici-model';



type TabKey = 'rozetler' | 'yorumlar' | 'mesaj';

@Component({
  selector: 'app-kullanici',
  standalone:true,
  imports: [CommonModule,RouterModule],
  templateUrl: './kullanici.html',
  styleUrl: './kullanici.css'
})
export class Kullanici {
 userId: number = 0;

constructor(private route: ActivatedRoute, private router: Router) {}

ngOnInit() {
  this.bootstrapLoad();
  this.route.paramMap.subscribe(p => {
    const id = Number(p.get('id')) || 0;

    // Aynı sayfada arka arkaya farklı profillere tıklayınca burası her seferinde çalışır
    if (id && id !== this.userId) {
      this.userId = id;
      this.loadUser(id);   // ↓ bkz. 3. adım
    }
  });
}

private loadUser(id: number) {
  this.isLoading = true;
  this.error = null;

  // TODO: backend entegrasyonu
  // this.users.getById(id).subscribe({
  //   next: (u) => { this.user = u; this.isLoading = false; },
  //   error: (err) => { this.error = 'Kullanıcı bulunamadı.'; this.isLoading = false; }
  // });

  // Şimdilik placeholder:
  this.user = {
    id, username: 'Geçici', city: '—', avatarUrl: '', ratingAvg: 0, ratingCount: 0
  };
  this.isLoading = false;
}


  // UI state
  isLoading = true;
  error: string | null = null;
  activeTab: TabKey = 'rozetler';

  // View model
  user: UserDto = {
    id: 0,
    username: '',
    city: '',
    avatarUrl: '',
    ratingAvg: 0,
    ratingCount: 0,
  };

  badges: BadgeDto[] = [];
  reviews: ReviewDto[] = [];

  // Mesaj kutusu
  messageText = '';
  isSending = false;

 

  /** İlk verileri yükle */
  async bootstrapLoad() {
    try {
      this.isLoading = true;
      this.error = null;

      // 👉 Burayı kendi servis çağrılarınla değiştir
      this.user = {
        id: this.userId,
        username: 'Yaman',
        city: 'İstanbul',
        avatarUrl: '',
        ratingAvg: 4.5,
        ratingCount: 36,
      };

      this.badges = [
        { id: 1, name: 'Başlangıç', icon: '🏅' },
        { id: 2, name: 'İyi İş', icon: '👍' },
        { id: 3, name: 'Üst Düzey', icon: '⭐' },
        { id: 4, name: 'Güvenilir', icon: '✅' },
      ];

      this.reviews = [
        { id: 1, author: 'Ali',    when: '2 hafta önce', text: 'Sorunsuz bir alışverişti.' },
        { id: 2, author: 'Zeynep', when: '3 hafta önce', text: 'Çok kibar ve güvenilir.' },
        { id: 3, author: 'Ahmet',  when: '1 ay önce',    text: 'Ürün anlatıldığı gibiydi.' },
      ];
    } catch (e) {
      console.error(e);
      this.error = 'Veriler yüklenemedi.';
    } finally {
      this.isLoading = false;
    }
  }

  setTab(tab: TabKey) {
    this.activeTab = tab;
  }

  /** Mesaj metnini FormsModule olmadan yakala */
  onMessageInput(ev: Event) {
    this.messageText = (ev.target as HTMLTextAreaElement).value ?? '';
  }

  async sendMessage() {
    const text = (this.messageText || '').trim();
    if (!text) return;

    try {
      this.isSending = true;
      // 👉 Burayı kendi Message/Notification servisinle değiştir
      console.log('Mesaj gönder:', { to: this.userId, text });
      this.messageText = '';
    } catch (e) {
      console.error(e);
    } finally {
      this.isSending = false;
    }
  }

  goBack() {
    if (history.length > 1) history.back();
    else this.router.navigateByUrl('/hesabim');
  }
}