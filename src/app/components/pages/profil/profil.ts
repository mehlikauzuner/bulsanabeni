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

  // UI durumları
  isSubmitting = signal(false);
  errorMsg = signal<string | null>(null);
  isLoggedIn = signal(false);
  userId = signal<number | null>(null);

  // Login form
  loginModel = { email: '', password: '' };

  // Register form (city küçük harf!)
  registerModel = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    birthDate: '',
    city: ''
  };

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit() {
    this.auth.isLoggedIn$.subscribe(v => {
      this.isLoggedIn.set(v);
      this.userId.set(this.auth.currentUserId());
    });
  }

  switchTo(mode: Mode) {
    this.errorMsg.set(null);
    this.mode.set(mode);
  }

  // ====== LOGIN ======
  onLogin() {
    this.errorMsg.set(null);

    const email = (this.loginModel.email || '').trim().toLowerCase();
    const password = this.loginModel.password;

    if (!email || !password) {
      this.errorMsg.set('E-posta ve şifre zorunlu.');
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

    this.isSubmitting.set(true);

    this.auth.login({ email, password }).subscribe({
      next: (res) => {
        console.log('LOGIN SUCCESS, response:', res);
        this.isSubmitting.set(false);
        this.router.navigateByUrl('/profil/hesabim');
      },
      error: (err: Error) => {
        console.error('LOGIN ERROR', err);
        this.isSubmitting.set(false);
        this.errorMsg.set(err.message || 'Giriş başarısız.');
      }
    });
  }


  
  // ====== REGISTER ======
  onRegister() {
    console.log('MODEL:', this.registerModel);

    this.errorMsg.set(null);
    const { firstName, lastName, username, email, password, birthDate, city } = this.registerModel;

    const firstNameTrim = (firstName || '').trim();
    const lastNameTrim  = (lastName  || '').trim();
    const userNameTrim  = (username  || '').trim();
    const emailTrim     = (email     || '').trim().toLowerCase();
    const cityTrim      = (city      || '').trim();

    if (!firstNameTrim || !lastNameTrim || !userNameTrim || !emailTrim || !password || !birthDate || !cityTrim) {
      this.errorMsg.set('Tüm alanlar zorunlu.');
      return;
    }
    if (!this.isValidUsername(userNameTrim)) {
      this.errorMsg.set('Kullanıcı adı 3–20 karakter olmalı (harf, rakam, _ . -).');
      return;
    }
    if (!this.isValidEmail(emailTrim)) {
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
    if (!this.isValidCity(cityTrim)) {
      this.errorMsg.set('Bulunduğunuz şehri girmek zorunlu.');
      return;
    }

    this.isSubmitting.set(true);

    // .NET default camelCase: City -> "city", UserName -> "userName"
    this.auth.register({
      firstName: firstNameTrim,
      lastName:  lastNameTrim,
      username:  userNameTrim,
      email:     emailTrim,
      password,
      birthDate,        // YYYY-MM-DD
      city:      cityTrim
    }).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.mode.set('login');
        this.errorMsg.set('Kayıt başarılı, şimdi giriş yapabilirsin.');
      },
      error: (err: Error) => {
        this.isSubmitting.set(false);
        this.errorMsg.set(err.message || 'Kayıt başarısız.');
      }
    });
  }

  // ====== LOGOUT ======
  onLogout() {
    this.auth.logout();
    // this.router.navigateByUrl('/profil');
  }

  // === helpers ===
  private isValidEmail(e: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e || '');
  }
  private isValidUsername(u: string) {
    return /^[a-zA-Z0-9_.-]{3,20}$/.test(u || '');
  }
  private isValidPassword(pw: string) {
    return !!pw && pw.length >= 8 && pw.length <= 15;
  }
  private isValidBirthDate(d: string) {
    if (!d) return false;
    const today = new Date();
    const bd = new Date(d + 'T00:00:00');
    if (isNaN(bd.getTime())) return false;
    if (bd > today) return false;
    const age = today.getFullYear() - bd.getFullYear()
      - ((today.getMonth() < bd.getMonth() || (today.getMonth() === bd.getMonth() && today.getDate() < bd.getDate())) ? 1 : 0);
    return age >= 13;
  }
  private isValidCity(c: string) {
    return c.length >= 2 && c.length <= 50;
    // İstersen: return /^[a-zA-ZçğıöşüÇĞİÖŞÜ\s.-]{2,50}$/.test(c);
  }
}
