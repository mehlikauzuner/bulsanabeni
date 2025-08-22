import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MessageCreate, MessageDto, ProfilDetailDto } from '../models/kullanici-model';


@Injectable({ providedIn: 'root' })
export class ProfilDetailService {
  private http = inject(HttpClient);
  private readonly profilApi = 'https://localhost:44345/api/ProfilDetail';
  private readonly PostApi = 'https://localhost:44345/api/Messages';
  private readonly MessageApi = 'https://localhost:44345/api/Messages';

  getById(id: number): Observable<ProfilDetailDto> {
    return this.http.get<ProfilDetailDto>(`${this.profilApi}/${id}`);
  }

send(body: MessageCreate): Observable<string> {
  return this.http.post(this.MessageApi, body, { responseType: 'text' as const });
}
}
