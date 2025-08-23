import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth-service';
import { NotificationService } from '../../../services/notification-service';
import { UserService } from '../../../services/user-service';
import { UserSearch } from '../../../models/auth-model.ts';
import { MessageDto } from '../../../models/kullanici-model';
import { MessagesService } from '../../../services/message-service';




type Tab = 'bildirimler' | 'mesajlar' | 'rozetler' | 'yorumlar' | 'ayarlar' | 'ara';

@Component({
  selector: 'app-hesabim',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './hesabim.html',
  styleUrls: ['./hesabim.css']
})
export class Hesabim {
  /** Sağ panel sekmesi */
  active: Tab | null = null;

  /** Auth durumu (servisten) */
  isLoggedIn = signal(false);
  currentUserId = signal<number | null>(null);

  /** Görüntülenen profilin sahibi (route param /profil/:id varsa oradan, yoksa currentUser) */
  profileOwnerId = signal<number | null>(null);

  /** Bu sayfa kendi profilim mi? */
  isOwnProfile = computed(() => {
    const me = this.currentUserId();
    const owner = this.profileOwnerId();
    return me != null && owner != null && me === owner;
  });

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private noti: NotificationService, 
    private userService: UserService,
    private messagesService: MessagesService
  ) {}

  ngOnInit() {
    this.auth.isLoggedIn$.subscribe(v => {
      this.isLoggedIn.set(v);
      this.currentUserId.set(this.auth.currentUserId());
      if (!this.route.snapshot.paramMap.get('id') && v) {
        this.profileOwnerId.set(this.auth.currentUserId());
      }
    });

    // 2) /profil/:id parametresi varsa, onu profil sahibi yap
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const n = Number(idParam);
      if (!Number.isNaN(n)) this.profileOwnerId.set(n);
    } else {
      // İlk yüklemede (login hâlihazırda varsa) kendini ata
      const uid = this.auth.currentUserId();
      if (uid != null) this.profileOwnerId.set(uid);
    }
  }

 

  /** Logout: servisten temizle + profil sayfasına dön */
  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/profil');
  }



   // ====== BACKEND'DEN BİLDİRİM ÇEKME (BASIC) ======
  notifications: any[] = [];
notiLoading = false;
notiLoaded = false;

private loadNotifications() {
  const uid = this.currentUserId();
  if (!uid) return;

  this.notiLoading = true;
  this.noti.getMyNotification(uid).subscribe({
    next: (res) => {
      console.log('noti res:', res);              // ← ŞEKLİNİ GÖR
      this.notifications = res?.data ?? res ?? []; // data varsa data, yoksa direkt res
      this.notiLoading = false;
      this.notiLoaded = true;
    },
    error: (err) => {
      console.error('noti err:', err);
      this.notifications = [];
      this.notiLoading = false;
      this.notiLoaded = true;
    }
  });
}


  // --- AŞAĞIDAKİLER şimdilik MOCK; backend bağlayınca bunları API'den dolduracağız ---

  user = {
    fullName: 'Mehlika Uzuner',
    email: 'Uzunermehlika6128@gmail.com',
    sehir: 'Trabzon',
    yas: 21,
    puan: 6.1,
    rozetSayisi: 61,
    fotoUrl: ''
  };

  

    messages: MessageDto[] = [];
  msgLoading = false;
  msgLoaded = false;

  // [ADD] Mesajları (Inbox) yükle
  private loadInbox() {
    const uid = this.currentUserId();
    if (!uid) return;

    this.msgLoading = true;
    this.messagesService.getInbox(uid).subscribe({
      next: (res) => {
        this.messages = res ?? [];
        this.msgLoading = false;
        this.msgLoaded = true;
      },
      error: (err) => {
        console.error('inbox error:', err);
        this.messages = [];
        this.msgLoading = false;
        this.msgLoaded = true;
      }
    });
  }

  

  // [MODIFY] Sekme aç-kapa: mesajlar açılırken inbox’ı bir kez yükle
  toggleTab(t: Tab) {
    this.active = (this.active === t) ? null : t;

    if (this.active === 'bildirimler' && !this.notiLoaded) {
      this.loadNotifications();
    }
    if (this.active === 'mesajlar' && !this.msgLoaded) {
      this.loadInbox();
    }
  }


  // [ADD - opsiyonel] Zamanı “5 dk / 3 saat / dün” gibi göster
  fromNow(iso: string): string {
    const d = new Date(iso);
    const diff = Math.max(0, Date.now() - d.getTime());
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'şimdi';
    if (m < 60) return `${m} dk`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} saat`;
    const days = Math.floor(h / 24);
    if (days === 1) return 'dün';
    return `${days} gün`;
  }



  rozetler = [
    { ad: 'İlk Etkinlik', aciklama: 'İlk etkinliğini tamamladın' },
    { ad: 'Organizatör', aciklama: '5 ilan açtın' },
  ];

  yorumlar = [
    { yazar: 'Ayşe', puan: 5, metin: 'Harikaydı, tavsiye ederim!', tarih: '3 gün önce' },
  ];

  // Yorum yaz (sadece başkasının profilinde)
  newComment = '';
  newRating = 5;
  addComment() {
    if (this.isOwnProfile()) return;
    const txt = this.newComment.trim();
    if (!txt) return;
    this.yorumlar.unshift({
      yazar: 'Bir Kullanıcı', // mock
      puan: this.newRating,
      metin: txt,
      tarih: 'şimdi'
    });
    this.newComment = '';
    this.newRating = 5;
  }

  // --- Ara tabı 
 q = '';
  results: UserSearch[] = [];

  onQuery() {
    const k = (this.q ?? '').trim();
    // Metod adın 'SearchUser' ise alttaki satırı ona göre değiştir:
    this.userService.SearchUser(k, 1, 20).subscribe({
      next: (users) => this.results = users ?? [],
      error: () => this.results = []
    });
  }


openProfile(id:number){
  this.router.navigate(['/profil/hesabim/kullanici', id]);
}
goReply(id:number){
  this.router.navigate(['/profil/hesabim/kullanici', id], { queryParams: { tab:'mesaj' }});
}



  // (İleride: profileOwnerId değişince API'den profil bilgisi çek → this.user = ...)
}
