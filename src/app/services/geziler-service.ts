import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { IlanModel } from '../models/ilan-model';         // (create payload için kullanıyorsan)
import { DetayModel } from '../models/detay-model';        // detay sayfası modeli

// İstersen bunları ayrı bir dosyada da tutabilirsin
export type City = { id: number; name: string };
export type District = { id: number; name: string; cityId?: number };

@Injectable({ providedIn: 'root' })
export class GezilerService {
  // Base API’ler
  private readonly gezilerApi  = 'https://localhost:44345/api/Geziler';
  private readonly citiesApi   = 'https://localhost:44345/api/Cities';
  private readonly districtsApi= 'https://localhost:44345/api/Districts';

  constructor(private http: HttpClient) {}

  /** Yeni ilan oluşturma (payload: IlanModel veya API’nin beklediği PascalCase obje) */
  createIlan(payload: IlanModel | any): Observable<any> {
    // Angular zaten JSON gönderiyor; header eklemek şart değil ama istersen bırakabiliriz
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.gezilerApi, payload, { headers });
  }

  /** İlanları listeleme (opsiyonel) */
  getAllIlanlar(params?: { page?: number; pageSize?: number }): Observable<any[]> {
    let httpParams = new HttpParams();
    if (params?.page != null) httpParams = httpParams.set('page', String(params.page));
    if (params?.pageSize != null) httpParams = httpParams.set('pageSize', String(params.pageSize));
    return this.http.get<any[]>(this.gezilerApi, { params: httpParams });
  }

  /** Tek ilan getir (Detay sayfası) */
  getIlanById(id: number): Observable<DetayModel> {
    return this.http.get<DetayModel>(`${this.gezilerApi}/${id}`);
  }

  /** Alias: getIlan (istersen component’te bunu çağır) */
  getIlan(id: number): Observable<DetayModel> {
    return this.getIlanById(id);
  }

  /** İller – q param destekli (endpoint {data: City[]} veya City[] dönerse ikisini de handle eder) */
  getCities(q?: string): Observable<City[]> {
    let params = new HttpParams();
    if (q) params = params.set('q', q);
    return this.http.get<City[] | { data: City[] }>(this.citiesApi, { params }).pipe(
      map(res => Array.isArray(res) ? res : (res?.data ?? []))
    );
  }

  /**
   * İlçeler – cityId zorunlu, q opsiyonel.
   * Endpoint tüm ilçeleri döndürürse güvenlik için burada cityId’ye göre filtreliyoruz.
   */
  getDistricts(cityId: number, q?: string): Observable<District[]> {
    let params = new HttpParams().set('cityId', String(cityId));
    if (q) params = params.set('q', q);

    return this.http.get<District[] | { data: District[] }>(this.districtsApi, { params }).pipe(
      map(res => {
        const arr = (Array.isArray(res) ? res : (res?.data ?? [])) as District[];
        return (arr.length && typeof arr[0].cityId !== 'undefined')
          ? arr.filter(d => d.cityId === cityId)
          : arr;
      })
    );
  }
}
