import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BadgeAwardResultDto, CommentCreate, CommentDto, EventAttendanceCreateDto, EventModel, MessageCreate, MessageDto, ProfilDetailDto, RatingCreate, RatingDto, RatingSummaryDto, UserBadgeDto } from '../models/kullanici-model';


@Injectable({ providedIn: 'root' })
export class ProfilDetailService {
  private http = inject(HttpClient);
  private readonly profilApi = 'https://localhost:44345/api/ProfilDetail';
  private readonly MessageApi = 'https://localhost:44345/api/Messages';
  private readonly CommentApi = 'https://localhost:44345/api/Comment';
  private readonly RatingApi = "https://localhost:44345/api/Rating"
  private readonly RozetApi = 'https://localhost:44345/api';
  

  getById(id: number): Observable<ProfilDetailDto> {
    return this.http.get<ProfilDetailDto>(`${this.profilApi}/${id}`);
  }

  send(body: MessageCreate): Observable<string> {
     return this.http.post(this.MessageApi, body, { responseType: 'text' as const });
}

 getByTargetUserId(targetUserId: number): Observable<CommentDto[]> {
    const params = new HttpParams().set('targetUserId', targetUserId);
    return this.http.get<CommentDto[]>(`${this.CommentApi}/GetByTargetUserId`, { params });
  }
 createComment(body: CommentCreate): Observable<CommentDto> {
    return this.http.post<CommentDto>(`${this.CommentApi}/Create`, body);
}

 // --- Rating ---
  getRatingSummary(targetUserId: number): Observable<RatingSummaryDto> {
    const params = new HttpParams().set('targetUserId', String(targetUserId));
    return this.http.get<RatingSummaryDto>(`${this.RatingApi}/GetSummary`, { params });
  }

  createRating(body: RatingCreate): Observable<RatingDto> {
    return this.http.post<RatingDto>(`${this.RatingApi}/Create`, body);
  }


   getUserBadges(userId: number): Observable<UserBadgeDto[]> {
  return this.http.get<UserBadgeDto[]>(`${this.RozetApi}/Badge/user/${userId}`);
}


  getEventsByCategory(categoryId: number): Observable<EventModel[]> {
    const params = new HttpParams().set('categoryId', String(categoryId));
    return this.http.get<EventModel[]>(`${this.RozetApi}/Event`, { params });
  }
  
}