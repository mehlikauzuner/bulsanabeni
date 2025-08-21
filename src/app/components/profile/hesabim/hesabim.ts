import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth-service';
import { NotificationService } from '../../../services/notification-service';
import { UserService } from '../../../services/user-service';
import { UserSearch } from '../../../models/auth-model.ts';




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

toggleTab(t: Tab) {
  this.active = (this.active === t) ? null : t;
  if (this.active === 'bildirimler' && !this.notiLoaded) {
    this.loadNotifications();
  }
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

  

  mesajKisileri = [
    { id: 10, ad: 'Ayşe Yılmaz', son: 'Yarın buluşalım mı?', ago: '5 dk' },
    { id: 11, ad: 'Mehmet Kaya', son: 'Konumu paylaştım', ago: '3 saat' },
  ];

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
  this.router.navigate(['/profil', id]);
}


  // (İleride: profileOwnerId değişince API'den profil bilgisi çek → this.user = ...)
}
