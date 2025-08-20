import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IlanModel } from '../models/ilan-model';


@Injectable({ providedIn: 'root' })
export class CruiseService {
private readonly postapi= "https://localhost:44345/api/Cruise"

  constructor(private http: HttpClient) {}

  /** Yeni ilan oluşturma */
 createIlan(payload: IlanModel): Observable<any> {
  return this.http.post<any>(this.postapi, payload);
}


  /** İlanları listeleme (opsiyonel) */
  getAllIlanlar(params?: { page?: number; pageSize?: number }): Observable<any[]> {
    let httpParams = new HttpParams();
    if (params?.page) httpParams = httpParams.set('page', params.page);
    if (params?.pageSize) httpParams = httpParams.set('pageSize', params.pageSize);
    return this.http.get<any[]>(this.postapi, { params: httpParams });
  }

  /** Tek ilan getir (opsiyonel) */
  getIlanById(id: number): Observable<any> {
    return this.http.get<any>(`${this.postapi}/${id}`);
  }
}
