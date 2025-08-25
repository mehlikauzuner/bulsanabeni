import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MessageDto, MessageCreate } from '../models/kullanici-model'; // senin dosya yoluna göre düzelt

@Injectable({ providedIn: 'root' })
export class MessagesService {
  private readonly api = 'https://localhost:44345/api/Messages';

  constructor(private http: HttpClient) {}

  /** /api/Messages/inbox/{receiverId} */
  getInbox(receiverId: number): Observable<MessageDto[]> {
    return this.http.get<MessageDto[]>(`${this.api}/inbox/${receiverId}`);
  }

  /** /api/Messages/outbox/{senderId} */
  getOutbox(senderId: number): Observable<MessageDto[]> {
    return this.http.get<MessageDto[]>(`${this.api}/outbox/${senderId}`);
  }

  /** /api/Messages/conversation?senderId=..&receiverId=.. */
  getConversation(senderId: number, receiverId: number): Observable<MessageDto[]> {
    const params = new HttpParams()
      .set('senderId', String(senderId))
      .set('receiverId', String(receiverId));
    return this.http.get<MessageDto[]>(`${this.api}/conversation`, { params });
  }

  /** POST /api/Messages  (backend’in Create action’ı) */
  create(body: MessageCreate): Observable<MessageDto> {
    // Not: Backend createdAt'i kendisi set ediyorsa, body.createdAt göndermen şart değil.
    return this.http.post<MessageDto>(this.api, body);
  }
}