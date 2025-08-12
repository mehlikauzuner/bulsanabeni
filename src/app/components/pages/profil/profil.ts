import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
    username: '',
    password: '',
  };

  // Register form modeli (şifre tekrarı YOK, doğum tarihi VAR)
  registerModel = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    birthDate: '', // yyyy-mm-dd
  };

  isSubmitting = signal(false);
  errorMsg = signal<string | null>(null);

  constructor(private router: Router) {}

  switchTo(mode: Mode) {
    this.errorMsg.set(null);
    this.mode.set(mode);
  }

  onLogin() {
    this.errorMsg.set(null);
    const { username, password } = this.loginModel;
    if (!username || !password) {
      this.errorMsg.set('Kullanıcı adı ve şifre zorunlu.');
      return;
    }
    this.isSubmitting.set(true);
    // Şimdilik fake akış:
    setTimeout(() => {
      this.isSubmitting.set(false);
      console.log('LOGIN OK:', this.loginModel);
      // TODO: gerçek backend bağlanınca token kaydet
      this.router.navigateByUrl('/profil/hesabim'); // sonra ayarlarız
    }, 600);
  }

  onRegister() {
    this.errorMsg.set(null);
    const { firstName, lastName, email, password, birthDate } = this.registerModel;
    if (!firstName || !lastName || !email || !password || !birthDate) {
      this.errorMsg.set('Tüm alanlar zorunlu.');
      return;
    }
    // basit email kontrolü
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      this.errorMsg.set('Lütfen geçerli bir e-posta gir.');
      return;
    }
    if (password.length < 6) {
      this.errorMsg.set('Şifre en az 6 karakter olmalı.');
      return;
    }

    this.isSubmitting.set(true);
    // Şimdilik fake akış:
    setTimeout(() => {
      this.isSubmitting.set(false);
      console.log('REGISTER OK:', this.registerModel);
      this.router.navigateByUrl('/profil/hesabim'); // sonra ayarlarız
    }, 800);
  }
}
