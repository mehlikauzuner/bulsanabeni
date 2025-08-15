import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CreateCruiseRequest } from '../models/ilan-model';
import { DetayModel } from '../models/detay-model';



@Injectable({ providedIn: 'root' })
export class CruiseService {
  private readonly base = 'https://localhost:44345/api/Cruise';

  constructor(private http: HttpClient) {}

  create(body: CreateCruiseRequest): Observable<any> {
    return this.http.post<any>(this.base, body);
  }


getById(id: number): Observable<DetayModel> {
  return this.http.get<DetayModel>(this.base, { params: { id } as any });
}

list(params?: { page?: number; pageSize?: number }): Observable<DetayModel[]> {
  return this.http
    .get<DetayModel[] | { data: DetayModel[] }>(this.base, { params })
    .pipe(map(res => Array.isArray(res) ? res : (res?.data ?? [])));
}

}
