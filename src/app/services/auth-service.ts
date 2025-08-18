// src/app/services/auth-service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiError, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../models/auth-model.ts';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  // .NET tarafında tipik örnekler:
  //  /api/auth/login   /api/auth/register
  // Gerekirse environment’tan oku.
  private baseUrl = 'https://localhost:44345/api/Auth';


// auth-service.ts
// login imzasını LoginRequest ile yap ve body'yi { email, password }'a çevir
login(body: LoginRequest) {
  const email = (body.email ?? '').trim().toLowerCase();
  const payload = { email, password: body.password };
  return this.http.post<LoginResponse>(`${this.baseUrl}/login`, payload);
}


  register(body: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.baseUrl}/register`, body)
      .pipe(catchError(this.handle));
  }

  // ---- Hata eşlemesi
  private handle = (err: HttpErrorResponse) => {
    let msg = 'Beklenmeyen bir hata oluştu.';
    if (err.status === 0) {
      msg = 'Sunucuya ulaşılamıyor (CORS/Network).';
    } else if (err.status === 400) {
      msg = this.extract(err) || 'Geçersiz istek.';
    } else if (err.status === 401) {
      msg = 'Kullanıcı adı veya şifre hatalı.';
    } else if (err.status === 409) {
      msg = 'Bu e-posta veya kullanıcı adı zaten kayıtlı.';
    } else if (err.error) {
      msg = this.extract(err) || msg;
    }
    return throwError(() => new Error(msg));
  };

  private extract(err: HttpErrorResponse): string | null {
    const e: ApiError | string = err.error;
    const parts: string[] = [];
    if (typeof e === 'string') return e;
    if (!e) return null;
    if (e.message) parts.push(e.message);
    if (e.title) parts.push(e.title);
    if (e.errors) {
      Object.keys(e.errors).forEach(k => {
        const arr = e.errors![k];
        if (Array.isArray(arr)) arr.forEach(m => parts.push(`${k}: ${m}`));
      });
    }
    return parts.length ? parts.join(' | ') : null;
  }
}
