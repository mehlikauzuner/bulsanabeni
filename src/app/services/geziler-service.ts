import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';

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
 createIlan(payload: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.gezilerApi, payload, { headers });
  }

  /** İlanları listeleme (opsiyonel) */
 getAllIlanlar(params?: { page?: number; pageSize?: number }): Observable<DetayModel[]> {
  let httpParams = new HttpParams();
  if (params?.page != null) httpParams = httpParams.set('page', String(params.page));
  if (params?.pageSize != null) httpParams = httpParams.set('pageSize', String(params.pageSize));

  return this.http.get<any>(this.gezilerApi, { params: httpParams }).pipe(
    map(raw => {
      // 1) Dizi mi? direkt al
      let arr: any[] =
        Array.isArray(raw) ? raw
        // 2) { data: [...] } veya { items: [...] } vb?
        : (raw?.data ?? raw?.items ?? raw?.results ?? raw?.value ?? []);

      // 3) Güvenli map → DetayModel
      return (arr as any[]).map(r => ({
        id:        r.id ?? r.Id,
        userId:    r.userId ?? r.UserId ?? 0,
        title:     r.title ?? r.Title ?? '',
        description: r.description ?? r.Description ?? '',
        date:      r.date ?? r.Date ?? '',
        time:      r.time ?? r.Time ?? '',
        city:      r.city ?? r.City ?? '',
        district:  r.district ?? r.District ?? '',
      })) as DetayModel[];
    })
  );
}


  /** Tek ilan getir (Detay sayfası) – camelCase normalize */
getIlanById(id: number): Observable<DetayModel> {
  const toStr = (v: any) => (v ?? '') + '';
  const toNum = (v: any) => Number.isFinite(Number(v)) ? Number(v) : 0;
  const toHHmmss = (v: any) => {
    const s = toStr(v);
    if (/^\d{2}:\d{2}:\d{2}/.test(s)) return s.slice(0, 8); // "HH:mm:ss" veya "HH:mm:ss.fff"
    if (/^\d{2}:\d{2}$/.test(s)) return s + ':00';          // "HH:mm" -> "HH:mm:ss"
    return '';
  };
  const mapOne = (raw: any): DetayModel => {
    const r = raw?.data ?? raw?.item ?? raw?.result ?? raw;
    return {
      id:        toNum(r?.id ?? r?.Id),
      userId:    toNum(r?.userId ?? r?.UserId),
      title:     toStr(r?.title ?? r?.Title),
      description: toStr(r?.description ?? r?.Description),
      date:      toStr(r?.date ?? r?.Date),    // ISO datetime
      time:      toHHmmss(r?.time ?? r?.Time), // "HH:mm:ss"
      city:      toStr(r?.city ?? r?.City),
      district:  toStr(r?.district ?? r?.District),
    };
  };

  const url1 = `${this.gezilerApi}/${id}`;   // /Geziler/123
  const url2 = `${this.gezilerApi}/GetById`; // /Geziler/GetById?id=123
  const url3 = `${this.gezilerApi}/getbyid`; // /Geziler/getbyid?id=123
  const params = new HttpParams().set('id', String(id));

  return this.http.get<any>(url1).pipe(
    map(mapOne),
    // 1. deneme hata verirse 2. rotaya düş
    catchError(() => this.http.get<any>(url2, { params }).pipe(
      map(mapOne),
      // 2. de hata verirse 3. rotaya düş
      catchError(() => this.http.get<any>(url3, { params }).pipe(
        map(mapOne)
      ))
    ))
  );
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
