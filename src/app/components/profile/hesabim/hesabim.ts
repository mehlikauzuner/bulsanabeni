import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Tab = 'bildirimler' | 'mesajlar' | 'rozetler' | 'yorumlar' | 'ayarlar' | 'ara';

@Component({
  selector: 'app-hesabim',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hesabim.html',
  styleUrls: ['./hesabim.css']
})
export class Hesabim {
  // Başlangıçta sağ taraf boş kalsın
  active: Tab | null = null;

  // (Mock) Giriş yapan kullanıcı ve profil sahibi
  currentUserId = 1;
  profileOwnerId = 2; // TEST: başkasının profili gibi görmek için 2 yap → yorum kutusu açılır
  isOwnProfile = true;

  constructor() {
    this.isOwnProfile = this.currentUserId === this.profileOwnerId;
  }

  user = {
    fullName: 'Mehlika Uzuner',
    email: 'Uzunermehlika6128@gmail.com',
    sehir: 'Trabzon',
    yas: 21,
    puan: 6.1,
    rozetSayisi: 61,
    fotoUrl: ''
  };

  bildirimler = [
    { id: 1, text: 'Ayşe ilanına cevap verdi', ago: '2 saat önce' },
    { id: 2, text: 'Mehmet “seni buldum” dedi', ago: '1 gün önce' },
  ];

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
    if (this.isOwnProfile) return;
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

  // TAB: tıkla-aç, aynı tab’a tekrar tıkla-kapat
  toggleTab(t: Tab) {
    this.active = (this.active === t) ? null : t;
  }

  // (İstersen ileride logout’u buraya bağlayacağız)
  logout() {
    console.log('Logout (mock): token temizle ve /login’e yönlendir');
  }

  // --- Ara tabı (mock) ---
  q = '';
  allUsers = [
    { id: 2, name: 'Ayşe Yılmaz', city: 'İzmir' },
    { id: 3, name: 'Mehmet Kaya', city: 'Ankara' },
    { id: 4, name: 'Ali Demir', city: 'İstanbul' },
  ];
  results = this.allUsers;

  onQuery() {
    const k = this.q.trim().toLowerCase();
    this.results = !k ? this.allUsers
      : this.allUsers.filter(u =>
          u.name.toLowerCase().includes(k) || (u.city ?? '').toLowerCase().includes(k)
        );
  }

  openProfile(id:number){
    console.log('Profil aç (mock): /profil/' + id);
    // Gerçekte: this.router.navigate(['/profil', id]);
  }
}
