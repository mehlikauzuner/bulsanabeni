import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, map, catchError } from 'rxjs';
import { City, District, IlanModel } from '../models/ilan-model';
import { DetayModel } from '../models/detay-model';

@Injectable({ providedIn: 'root' })
export class GezilerService {

  private readonly gezilerApi  = 'https://localhost:44345/api/Geziler';
  private readonly citiesApi   = 'https://localhost:44345/api/Cities/Get';
  private readonly districtsApi= 'https://localhost:44345/api/Districts';
  private readonly notificationApi = 'https://localhost:44345/api/Notification'; 
  



  constructor(private http: HttpClient) {}

  notifyFound(ilanId: number) {
    const url = `${this.notificationApi}/add`;
    return this.http.post<any>(url, { ilanId }); // backend diğer alanları kendisi set etmeli
  }

  /** 2) Alıcının bildirimlerini çek */
  getMyNotifications(userId: number) {
    const url = `${this.notificationApi}/GetMyNotifications`;
    const params = new HttpParams().set('userId', String(userId));
    return this.http.get<any>(url, { params });
  }


createIlan(payload: any) {
  return this.http.post<any>(this.gezilerApi, payload);
}



  /** Tüm ilanları listeleme */
  getAllIlanlar(): Observable<DetayModel[]> {
    return this.http.get<any>(this.gezilerApi).pipe(
      map(raw => {
        const arr: any[] =
          Array.isArray(raw) ? raw
          : (raw?.data ?? raw?.items ?? raw?.results ?? raw?.value ?? []);

        return arr.map(r => ({
          id:         r.id ?? r.Id,
          userId:     r.userId ?? r.UserId ?? 0,
          userName:   r.userName ?? r.UserName ?? '',
          title:      r.title ?? r.Title ?? '',
          description:r.description ?? r.Description ?? '',
          date:       r.date ?? r.Date ?? '',
          time:       r.time ?? r.Time ?? '',
          city:       r.city ?? r.City ?? '',
          district:   r.district ?? r.District ?? '',
        })) as DetayModel[];
      })
    );
  }

  /** Tek ilan getirme */
  getIlanById(id: number): Observable<DetayModel> {
    const toStr = (v: any) => (v ?? '') + '';
    const toNum = (v: any) => Number.isFinite(Number(v)) ? Number(v) : 0;
    const toHHmmss = (v: any) => {
      const s = toStr(v);
      if (/^\d{2}:\d{2}:\d{2}/.test(s)) return s.slice(0, 8);
      if (/^\d{2}:\d{2}$/.test(s)) return s + ':00';
      return '';
    };
    const mapOne = (raw: any): DetayModel => {
      const r = raw?.data ?? raw?.item ?? raw?.result ?? raw;
      return {
        id:       toNum(r?.id ?? r?.Id),
        userId:   toNum(r?.userId ?? r?.UserId),
        title:    toStr(r?.title ?? r?.Title),
        userName: toStr(r?.userName ?? r?.UserName),
        description: toStr(r?.description ?? r?.Description),
        date:     toStr(r?.date ?? r?.Date),
        time:     toHHmmss(r?.time ?? r?.Time),
        city:     toStr(r?.city ?? r?.City),
        district: toStr(r?.district ?? r?.District),
      };
    };

    const url = `${this.gezilerApi}/${id}`;
    return this.http.get<any>(url).pipe(map(mapOne));
  }


  getIlan(id: number): Observable<DetayModel> {
    return this.getIlanById(id);
  }

  
  getCities(q?: string): Observable<City[]> {
    let params = new HttpParams();
    if (q) params = params.set('q', q);
    return this.http.get<City[] | { data: City[] }>(this.citiesApi, { params }).pipe(
      map(res => Array.isArray(res) ? res : (res?.data ?? []))
    );
  }

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