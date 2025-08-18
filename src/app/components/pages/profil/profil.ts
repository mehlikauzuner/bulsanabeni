import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth-service';



type Mode = 'login' | 'register';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profil.html',
  styleUrls: ['./profil.css'],
})
export class Profil {
  mode = signal<Mode>('login');
  maxDate = new Date().toISOString().split('T')[0];

  // Login form modeli
  loginModel = {
    email: "",
    password: '',
  };

  // Register form modeli (şifre tekrarı YOK, doğum tarihi VAR)
  registerModel = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    birthDate: '', // yyyy-mm-dd
    City: ""
  };

  isSubmitting = signal(false);
  errorMsg = signal<string | null>(null);

  constructor(private router: Router, private auth: AuthService) {}

  // --- helpers (isim ekliyoruz ama mevcut isimleri değiştirmiyoruz)
  private isValidEmail(e: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }
  private isValidPassword(p: string) {
    // İSTENEN: min 8, max 15 — harf/rakam şartı koymadım ama istersen ekleriz
    return typeof p === 'string' && p.length >= 8 && p.length <= 15;
  }
  private isValidUsername(u: string) {
    // 3–20 arası, harf-rakam-altçizgi-nokta-tire
    return /^[a-zA-Z0-9_.-]{3,20}$/.test(u || '');
  }
  private isValidBirthDate(d: string) {
    if (!d) return false;
    const today = new Date();
    const bd = new Date(d + 'T00:00:00');
    if (isNaN(bd.getTime())) return false;
    if (bd > today) return false; // gelecek tarih olamaz
    // 13+ yaş opsiyonel kural (gerekli gördüğüm ek): istiyorsan kaldırabilirsin
    const age =
      today.getFullYear() - bd.getFullYear() -
      ((today.getMonth() < bd.getMonth() || (today.getMonth() === bd.getMonth() && today.getDate() < bd.getDate())) ? 1 : 0);
    return age >= 13;
  }

  switchTo(mode: Mode) {
    this.errorMsg.set(null);
    this.mode.set(mode);
  }

  // ===== LOGIN =====
  onLogin() {
  this.errorMsg.set(null);

  // username alanını e-posta olarak kullan
  const email = (this.loginModel.email || '').trim().toLowerCase();
  const password = this.loginModel.password;

  if (!email || !password) {
    this.errorMsg.set('E-posta ve şifre zorunlu.');
    return;
  }
  // e-posta formatı
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    this.errorMsg.set('Lütfen geçerli bir e-posta gir.');
    return;
  }
  // 8–15 kuralı
  if (!this.isValidPassword(password)) {
    this.errorMsg.set('Şifre 8–15 karakter olmalı.');
    return;
  }

  this.isSubmitting.set(true);
  // BACKEND { email, password } bekliyor
  this.auth.login({ email, password }).subscribe({
    next: (res) => {
      const anyRes = res as any;
      const token =
        anyRes?.token ??
        anyRes?.accessToken ??
        anyRes?.data?.token ??
        anyRes?.data?.accessToken ??
        anyRes?.data?.access_token ?? null;

      if (!token) {
        this.isSubmitting.set(false);
        this.errorMsg.set('Sunucudan token alınamadı.');
        console.log('Login response:', res);
        return;
      }

      localStorage.setItem('token', token);
      this.isSubmitting.set(false);
      this.router.navigateByUrl('/profil/hesabim');
    },
    error: (err: Error) => {
      this.isSubmitting.set(false);
      this.errorMsg.set(err.message || 'Giriş başarısız.');
    }
  });
}


  // ===== REGISTER =====
  onRegister() {
    this.errorMsg.set(null);
    const { firstName, lastName, username, email, password, birthDate } = this.registerModel;

    if (!firstName || !lastName || !username || !email || !password || !birthDate) {
      this.errorMsg.set('Tüm alanlar zorunlu.');
      return;
    }
    if (!this.isValidUsername(username)) {
      this.errorMsg.set('Kullanıcı adı 3–20 karakter, harf-rakam-_ . - içerebilir.');
      return;
    }
    if (!this.isValidEmail(email)) {
      this.errorMsg.set('Lütfen geçerli bir e-posta gir.');
      return;
    }
    if (!this.isValidPassword(password)) {
      this.errorMsg.set('Şifre 8–15 karakter olmalı.');
      return;
    }
    if (!this.isValidBirthDate(birthDate)) {
      this.errorMsg.set('Doğum tarihi geçersiz (gelecek tarih olamaz, 13+ olmalı).');
      return;
    }

    this.isSubmitting.set(true);
    this.auth.register({ firstName, lastName, username, email, password, birthDate }).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        // Kayıttan sonra direkt giriş ekranına döndürmeyi tercih ettim;
        // istersen otomatik login de yapılabilir (backend token döndürürse).
        this.mode.set('login');
        this.errorMsg.set('Kayıt başarılı, şimdi giriş yapabilirsin.');
      },
      error: (err: Error) => {
        this.isSubmitting.set(false);
        this.errorMsg.set(err.message || 'Kayıt başarısız.');
      }
    });
  }
}
