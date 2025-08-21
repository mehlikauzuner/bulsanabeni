import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProfilDetailDto } from '../models/kullanici-model';


@Injectable({ providedIn: 'root' })
export class ProfilDetailService {
  private http = inject(HttpClient);
  private readonly API = 'https://localhost:44345/api/ProfilDetail';

  getById(id: number): Observable<ProfilDetailDto> {
    return this.http.get<ProfilDetailDto>(`${this.API}/${id}`);
  }
}
