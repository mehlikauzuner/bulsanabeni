// src/app/services/admin-badges.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BadgeDto, BadgeCreateDto } from '../models/badge-model';

@Injectable({ providedIn: 'root' })
export class AdminBadgesService {
  private base = 'https://localhost:44345/api/Badge';

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<BadgeDto[] | { data: BadgeDto[] }>(this.base);
  }


  add(dto: BadgeCreateDto) {
    return this.http.post(
      `${this.base}/Add`,          
      dto,
      { responseType: 'text' as 'json' }
    );
  }

  update(id: number, dto: Partial<BadgeCreateDto>) {
    return this.http.put(
      `${this.base}/${id}`,
      dto,
      { responseType: 'text' as 'json' }
    );
  }

  delete(id: number) {
    return this.http.delete(
      `${this.base}/${id}`,
      { responseType: 'text' as 'json' }
    );
  }

  removeFromUser(userId: number, badgeId: number) {
    return this.http.delete(
      `${this.base}/${badgeId}/user/${userId}`,
      { responseType: 'text' as 'json' }
    );
  }
}
