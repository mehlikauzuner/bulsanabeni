import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface CategoryDto { id: number; categoryName: string; }
export interface CategoryCreateDto { categoryName: string; }

@Injectable({ providedIn: 'root' })
export class AdminCategoriesService {
  constructor(private http: HttpClient) {}

  private GET_ALL_URL   = 'https://localhost:44345/api/Categories/GetAll';
  private ADD_URL       = 'https://localhost:44345/api/Categories/Add';  
  private UPDATE_URL    = 'https://localhost:44345/api/Categories/Update'; 
  private DELETE_URL    = 'https://localhost:44345/api/Categories';            

  list() {
    return this.http.get<CategoryDto[]>(this.GET_ALL_URL);
  }

  add(dto: CategoryCreateDto) {
    return this.http.post(this.ADD_URL, dto, { responseType: 'text' as 'json' });
  }

  update(id: number, dto: { categoryName: string }) {
    const body = { Id: id, CategoryName: dto.categoryName }; // PascalCase şart
    return this.http.put(this.UPDATE_URL, body, { responseType: 'text' as 'json' });
  }

  delete(id: number) {
    return this.http.delete(`${this.DELETE_URL}/${id}`, { responseType: 'text' as 'json' });
  }
}
