import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IlanModel } from '../models/ilan-model';

@Injectable({ providedIn: 'root' })
export class GezilerService {
  [x: string]: any;
  private readonly baseUrl = 'https://localhost:44345/api/Geziler';

  constructor(private http: HttpClient) {}

  /** Yeni ilan oluşturma */
  createIlan(payload: IlanModel): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.baseUrl, payload, { headers });
  }

  /** İlanları listeleme (opsiyonel) */
  getAllIlanlar(params?: { page?: number; pageSize?: number }): Observable<any[]> {
    let httpParams = new HttpParams();
    if (params?.page) httpParams = httpParams.set('page', params.page);
    if (params?.pageSize) httpParams = httpParams.set('pageSize', params.pageSize);
    return this.http.get<any[]>(this.baseUrl, { params: httpParams });
  }

  /** Tek ilan getir (opsiyonel) */
  getIlanById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }
}
