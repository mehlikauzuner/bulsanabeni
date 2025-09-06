import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GezilerCreateDto, GezilerDto, GezilerUpdateDto } from '../models/geziler-model';

@Injectable({ providedIn: 'root' })
export class AdminGezilerService {
  private base = 'https://localhost:44345/api/Geziler';

  constructor(private http: HttpClient) {}

  // GET ALL (çoğu projede GetAll olur; 404 alırsan this.base yap)
  list() {
  return this.http.get<GezilerDto[] | { data: GezilerDto[] }>(this.base);
}


  // UPDATE (genelde PUT /Geziler/Update)
  update(dto: GezilerUpdateDto) {
    return this.http.put(`${this.base}/Update`, dto, {
      responseType: 'text' as 'json'
    });
  }

  // DELETE (genelde DELETE /Geziler/{id})
  delete(id: number) {
    return this.http.delete(`${this.base}/${id}`, {
      responseType: 'text' as 'json'
    });
  }

  add(dto: GezilerCreateDto) {
  // .NET çoğunlukla "Add" kullanır; sende küçük harfse "add" yaz.
  return this.http.post(`${this.base}/Add`, dto, {
    responseType: 'text' as 'json'
  });
}
}