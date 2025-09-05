import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly api = 'https://localhost:44345/api/Notification';

  constructor(private http: HttpClient) {}

  getMyNotification(userId: number) {
    const params = new HttpParams().set('userId', String(userId));
    return this.http.get<any>(`${this.api}/GetMyNotifications`, { params });
  }

   add(dto: { ilanId: number; message?: string }) {
    return this.http.post(`${this.api}/add`, dto);
  }
  
}