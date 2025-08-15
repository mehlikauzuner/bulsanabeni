import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface City { id: number; name: string; }
export interface District { id: number; name: string; cityId: number; }

const CITIES_URL = 'https://localhost:44345/api/Cities';
const DISTRICTS_URL = 'https://localhost:44345/api/Districts';

@Injectable({ providedIn: 'root' })
export class CityService {
  private http = inject(HttpClient);


  getAllCities(): Observable<City[]> {
    return this.http.get<{ data: City[] }>(CITIES_URL).pipe(
      map(res => res?.data ?? [])
    );
  }


  getDistrictsByCity(cityId: number): Observable<District[]> {
    return this.http.get<{ data: District[] }>(`${DISTRICTS_URL}?cityId=${cityId}`).pipe(
      map(res => res?.data ?? [])
    );
  }
}
