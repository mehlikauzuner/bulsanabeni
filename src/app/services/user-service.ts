import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSearchApiUrl="https://localhost:44345/api/UserSearch/UserSearch?page=1&pageSize=20"
   constructor(private http:HttpClient) {}

   SearchUser(query: string, page =1,pageSize=20){
    const params= new HttpParams()
    .set("query",query ?? '')
    .set('page', page)
    .set('pageSize', pageSize);
    
    return this.http.get<any[]>('https://localhost:44345/api/UserSearch/UserSearch', { params });
   }
}