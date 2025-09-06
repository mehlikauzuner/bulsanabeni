// src/app/services/admin-ratings.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RatingDto, RatingCreateDto, RatingSummaryDto } from '../models/rating-model';

@Injectable({ providedIn: 'root' })
export class AdminRatingsService {
  private base = 'https://localhost:44345/api/Rating';

  constructor(private http: HttpClient) {}

  // LIST: GET /Rating/GetByTargetUser?targetUserId=...
  listByTarget(targetUserId: number) {
    const params = new HttpParams().set('targetUserId', targetUserId);
    return this.http.get<RatingDto[] | { data: RatingDto[] }>(`${this.base}/GetByTargetUser`, { params });
  }

  // ADD: POST /Rating/Create
  add(dto: RatingCreateDto) {
    return this.http.post(`${this.base}/Create`, dto, { responseType: 'text' as 'json' });
  }

  // SUMMARY: GET /Rating/GetSummary?targetUserId=...
  summary(targetUserId: number) {
    const params = new HttpParams().set('targetUserId', targetUserId);
    return this.http.get<RatingSummaryDto>(`${this.base}/GetSummary`, { params });
  }

  // DELETE-BY-USER: (sen demiştin) DELETE /Rating/{targetUserId}/{raterId}
  deleteByUser(targetUserId: number, raterId: number) {
    return this.http.delete(`${this.base}/${targetUserId}/${raterId}`, { responseType: 'text' as 'json' });
  }
}
