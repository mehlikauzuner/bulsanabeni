// src/app/services/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ApiError, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../models/auth-model';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  private baseUrl = 'https://localhost:44345/api/Auth';

  // localStorage keys
  private readonly TOKEN_KEY = 'token';
  private readonly UID_KEY   = 'userId';

  // Oturum durumu
  private token$  = new BehaviorSubject<string | null>(this.readToken());
  private userId$ = new BehaviorSubject<number | null>(this.readUserId());

  // Dışa açık akışlar / yardımcılar
  isLoggedIn$ = this.token$.pipe(map(Boolean));
  getToken(): string | null { return this.token$.value; }
  currentUserId(): number | null { return this.userId$.value; }
  isLoggedInSync(): boolean { return !!this.token$.value; }

  constructor() {
    // Tek seferlik eşitleme/migrasyon
    const tok = this.token$.value ?? localStorage.getItem('access_token');
    if (tok && !localStorage.getItem(this.TOKEN_KEY)) {
      localStorage.setItem(this.TOKEN_KEY, tok);
    }
    if (tok && this.userId$.value == null) {
      const uid = this.extractUserIdFromToken(tok);
      if (uid != null) {
        localStorage.setItem(this.UID_KEY, String(uid));
        this.userId$.next(uid);
      }
    }
  }

  // ==== API Çağrıları ====
  login(body: LoginRequest): Observable<LoginResponse> {
    const payload = {
      email: (body.email ?? '').trim().toLowerCase(),
      password: body.password
    };
   return this.http.post<LoginResponse>(`${this.baseUrl}/login`, payload).pipe(
  tap(res => { console.log('LOGIN RAW RESPONSE', res); this.setSession(res); }),
  catchError(this.handle)
);

  }

  register(body: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.baseUrl}/register`, body)
      .pipe(catchError(this.handle));
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem('access_token'); // uyumluluk
    localStorage.removeItem(this.UID_KEY);
    this.token$.next(null);
    this.userId$.next(null);
  }

  // ==== Dahili yardımcılar ====
  private setSession(res: LoginResponse | any) {
    const token = this.pickToken(res);
    if (!token) {
      console.warn('Token bulunamadı. Login cevabı:', res);
      return;
    }
    // 1) token'ı iki anahtar adıyla da yaz (uyumluluk)
    localStorage.setItem(this.TOKEN_KEY, token);      // "token"
    localStorage.setItem('access_token', token);      // "access_token"
    this.token$.next(token);

    // 2) userId (JWT'den)
    const uid = this.extractUserIdFromToken(token);
    if (uid != null) {
      localStorage.setItem(this.UID_KEY, String(uid));
      this.userId$.next(uid);
    }
  }

  /** Cevaptaki olası token alanlarını tek tek dener */
  private pickToken(res: any): string | null {
    if (!res) return null;
    if (typeof res.token === 'string') return res.token;
    if (typeof res.accessToken === 'string') return res.accessToken;
    if (typeof res.access_token === 'string') return res.access_token;

    const bag = res.data ?? res.result ?? res.payload ?? res.auth ?? null;
    if (bag) {
      if (typeof bag.token === 'string') return bag.token;
      if (typeof bag.accessToken === 'string') return bag.accessToken;
      if (typeof bag.access_token === 'string') return bag.access_token;
      if (typeof bag.jwt === 'string') return bag.jwt;
    }
    if (typeof res.jwt === 'string') return res.jwt;
    return null;
  }

  private readToken(): string | null {
    // Önce "token", yoksa "access_token"
    return localStorage.getItem(this.TOKEN_KEY) ?? localStorage.getItem('access_token');
  }

  private readUserId(): number | null {
    const v = localStorage.getItem(this.UID_KEY);
    const n = v != null ? Number(v) : NaN;
    return Number.isNaN(n) ? null : n;
  }

  /** JWT payload'ı base64url → JSON */
  private decodeJwtPayload(token: string): any {
    const payload = token.split('.')[1] ?? '';
    const b64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = b64.padEnd(b64.length + (4 - (b64.length % 4)) % 4, '=');
    const json = (globalThis as any).atob(padded);
    return JSON.parse(json);
  }

  /** Yaygın claim isimlerinden userId çek (.NET default + alternatifler) */
  private extractUserIdFromToken(token: string): number | null {
    try {
      const p = this.decodeJwtPayload(token) as any;
      const raw = p['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
               ?? p['sub'] ?? p['uid'];
      const n = Number(raw);
      return Number.isNaN(n) ? null : n;
    } catch { return null; }
  }

  /** Token içinden kullanıcı adını çek (.NET 'name' veya alternatif) */
  private extractNameFromToken(token: string): string | null {
    try {
      const p = this.decodeJwtPayload(token) as any;
      return p['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
          ?? p['name']
          ?? null;
    } catch { return null; }
  }

  /** Dışarıdan çağır: mevcut kullanıcının adı */
  public currentUserName(): string | null {
    const t = this.getToken();
    return t ? this.extractNameFromToken(t) : null;
    }

  // ---- Hata eşlemesi
  private handle = (err: HttpErrorResponse) => {
    let msg = 'Beklenmeyen bir hata oluştu.';
    if (err.status === 0) msg = 'Sunucuya ulaşılamıyor (CORS/Network).';
    else if (err.status === 400) msg = this.extract(err) || 'Geçersiz istek.';
    else if (err.status === 401) msg = 'Kullanıcı adı veya şifre hatalı.';
    else if (err.status === 409) msg = 'Bu e-posta veya kullanıcı adı zaten kayıtlı.';
    else if (err.error) msg = this.extract(err) || msg;
    return throwError(() => new Error(msg));
  };

  private extract(err: HttpErrorResponse): string | null {
    const e: ApiError | string = err.error;
    if (typeof e === 'string') return e;
    if (!e) return null;
    const parts: string[] = [];
    const anyErr: any = e as any;
    if (anyErr.message) parts.push(anyErr.message);
    if (anyErr.title)   parts.push(anyErr.title);
    if (anyErr.errors) {
      Object.keys(anyErr.errors).forEach(k => {
        const arr = anyErr.errors[k];
        if (Array.isArray(arr)) arr.forEach((m: string) => parts.push(`${k}: ${m}`));
      });
    }
    return parts.length ? parts.join(' | ') : null;
  }
}