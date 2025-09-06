import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EventDto, EventCreateDto, EventUpdateDto } from '../models/event-model';
import { catchError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminEventsService {
  private base = 'https://localhost:44345/api/Event'; 

  constructor(private http: HttpClient) {}


  listByCategory(categoryId: number) {
    // İki yaygın rota: /GetByCategory/{id} veya /GetByCategory?categoryId=
    const url1 = `${this.base}/GetByCategory/${categoryId}`;
    const url2 = `${this.base}/GetByCategory?categoryId=${categoryId}`;
    return this.http.get<EventDto[] | { data: EventDto[] }>(url1).pipe(
      catchError(() => this.http.get<EventDto[] | { data: EventDto[] }>(url2))
    );
  }

  add(dto: EventCreateDto) {
    return this.http.post(`${this.base}/Add`, dto, { responseType: 'text' as 'json' });
  }


updateName(id: number, eventName: string) {
  // Backend: [HttpPut("Update")] => body'de { id, eventName }
  const dto: EventUpdateDto = { id, eventName };
  return this.http.put(
    `${this.base}/Update`,
    dto,
    { responseType: 'text' as 'json' }
  );
}
  


  updateCategory(id: number, categoryId: number, eventName: string) {

    return this.http.put(
      `${this.base}/update-category`,            // Eğer route /{id} tarzında ise değiştir
      { id, categoryId, eventName },
      { responseType: 'text' as 'json' }
    );
  }


  delete(id: number) {
    return this.http.delete(`${this.base}/${id}`, { responseType: 'text' as 'json' });
  }
}
