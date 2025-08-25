import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth-service';
import { NotificationService } from '../../../services/notification-service';
import { UserService } from '../../../services/user-service';
import { MessageDto } from '../../../models/kullanici-model';
import { MessagesService } from '../../../services/message-service';
import { UserSearch } from '../../../models/auth-model';

type Tab = 'bildirimler' | 'mesajlar' | 'rozetler' | 'yorumlar' | 'ayarlar' | 'ara';

@Component({
  selector: 'app-hesabim',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './hesabim.html',
  styleUrls: ['./hesabim.css']
})
export class Hesabim {
  active: Tab | null = null;

  isLoggedIn = signal(false);
  currentUserId = signal<number | null>(null);
  profileOwnerId = signal<number | null>(null);

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
    });

    // /profil/:id değişince profili yeniden yükle
    this.route.paramMap.subscribe(map => {
      const idStr = map.get('id');
      const id = idStr ? Number(idStr) : this.auth.currentUserId();
      if (!id || Number.isNaN(id)) return;

      if (this.profileOwnerId() !== id) {
        this.profileOwnerId.set(id);
        // yeni profile geçerken eski veriyi temizle + spinner
        this.user = null;
        this.userLoading = true;
        this.userLoaded = false;
        this.loadProfile();

        if (this.active === 'mesajlar') {
          this.msgLoaded = false;
          this.loadInbox();
        }
      }
    });
  }

  private mapProfile(d: any) {
    return {
      fullName: d.username ?? d.userName ?? '',
      email: d.email ?? d.Email ?? '',
      sehir: d.city ?? d.City ?? '',
      yas: this.calcAge(d.birthDate ?? d.BirthDate) ?? 0,
      puan: d.ratingAvg ?? d.RatingAvg ?? 0,
      rozetSayisi: d.ratingCount ?? d.RatingCount ?? 0,
      fotoUrl: d.avatarUrl ?? d.AvatarUrl ?? ''
    };
  }

  private loadProfile() {
    const ownerId = this.profileOwnerId();
    if (!ownerId) return;

    this.userLoading = true;
    this.userService.getProfileDetail(ownerId).subscribe({
      next: (d: any) => {
        this.user = this.mapProfile(d);
        this.userLoading = false;
        this.userLoaded = true;
      },
      error: (err) => {
        console.error('profile error:', err);
        this.user = null;
        this.userLoading = false;
        this.userLoaded = true;
      }
    });
  }

  notifications: any[] = [];
  notiLoading = false;
  notiLoaded = false;

  private loadNotifications() {
    const uid = this.currentUserId();
    if (!uid) return;
    this.notiLoading = true;
    this.noti.getMyNotification(uid).subscribe({
      next: (res) => {
        this.notifications = res?.data ?? res ?? [];
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

  userLoading = false;
  userLoaded  = false;

  user: {
    fullName: string;
    email: string;
    sehir: string;
    yas: number;
    puan: number;
    rozetSayisi: number;
    fotoUrl: string;
  } | null = null;

  private calcAge(birth?: string | null): number | null {
    if (!birth) return null;
    const b = new Date(birth);
    if (Number.isNaN(b.getTime())) return null;
    const now = new Date();
    let age = now.getFullYear() - b.getFullYear();
    const m = now.getMonth() - b.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age--;
    return age;
  }

  messages: MessageDto[] = [];
  msgLoading = false;
  msgLoaded = false;

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

  toggleTab(t: Tab) {
    this.active = (this.active === t) ? null : t;

    if (this.active === 'bildirimler' && !this.notiLoaded) {
      this.loadNotifications();
    }
    if (this.active === 'mesajlar' && !this.msgLoaded) {
      this.loadInbox();
    }
  }

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

  newComment = '';
  newRating = 5;
  addComment() {
    if (this.isOwnProfile()) return;
    const txt = this.newComment.trim();
    if (!txt) return;
    this.yorumlar.unshift({
      yazar: 'Bir Kullanıcı',
      puan: this.newRating,
      metin: txt,
      tarih: 'şimdi'
    });
    this.newComment = '';
    this.newRating = 5;
  }

  q = '';
  results: UserSearch[] = [];

  onQuery() {
    const k = (this.q ?? '').trim();
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

  logout() {
  this.auth.logout();
  this.router.navigateByUrl('/profil');
}

}
