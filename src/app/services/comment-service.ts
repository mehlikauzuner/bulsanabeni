import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommentModel } from '../models/comment-model';


@Injectable({ providedIn: 'root' })
export class AdminCommentsService {
  private base = 'https://localhost:44345/api/Comment'; 

  constructor(private http: HttpClient) {}

  
  listByTargetUserId(targetUserId: number) {
    const params = new HttpParams().set('targetUserId', String(targetUserId));
    return this.http.get<CommentModel[] | { data: CommentModel[] }>(`${this.base}/GetByTargetUserId`, { params });
  }

  
  getById(id: number) {
    const params = new HttpParams().set('id', String(id));
    return this.http.get<CommentModel | { data: CommentModel }>(`${this.base}/GetById`, { params });
  }

 delete(id: number) { return this.http.delete(`${this.base}/Delete`, { params:{ id }, responseType:'text' as 'json' }); }


}