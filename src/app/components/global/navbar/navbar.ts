import { Component, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth-service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnDestroy {
  // 1) İlk an: localStorage'dan senkron oku → “geçtim ve uçtu” hissini keser
  isLoggedIn = signal<boolean>(!!localStorage.getItem('token'));

  private subs = new Subscription();

  constructor(private auth: AuthService, private router: Router) {
    // 2) Servis akışını dinle (login/logout anında güncellen)
    this.subs.add(this.auth.isLoggedIn$.subscribe(v => this.isLoggedIn.set(v)));

    // 3) Sayfa değişince tekrar senkronize ol (bazı yapılarda ilk render false görünüp sonra true olabilir)
    this.subs.add(
      this.router.events.pipe(filter(e => e instanceof NavigationEnd))
        .subscribe(() => this.isLoggedIn.set(!!this.auth.getToken()))
    );

    // 4) Diğer sekme/developer tools'tan storage değişirse yakala
    window.addEventListener('storage', this.onStorage);
  }

  private onStorage = (e: StorageEvent) => {
    if (e.key === 'token' || e.key === null) {
      this.isLoggedIn.set(!!localStorage.getItem('token'));
    }
  };

  logout() { this.auth.logout(); }

  ngOnDestroy() {
    this.subs.unsubscribe();
    window.removeEventListener('storage', this.onStorage);
  }
}
