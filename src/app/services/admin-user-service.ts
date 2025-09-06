
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UserDto, UserProfileUpdateDto, UserUpdateDto } from '../models/user-model';

@Injectable({ providedIn: 'root' })
export class AdminUserService {
  private readonly baseUser = 'https://localhost:44345/api/User';

  constructor(private http: HttpClient) {}

  /** GET /api/User/GetAll */
  getAllUsers() {
    return this.http.get<UserDto[] | { data: UserDto[] }>(`${this.baseUser}/GetAll`);
  }

   updateProfile(dto: UserProfileUpdateDto) {
    return this.http.put(`${this.baseUser}/update`, dto, {
      responseType: 'text' as 'json'
    });
  }

  // ...
updateUser(dto: UserUpdateDto) {
  // Admin endpoint: PUT /api/User/Update  (id + status kabul eder)
  return this.http.put(`${this.baseUser}/update`, dto, {
    responseType: 'text' as 'json'
  });
}

  /** DELETE — senin API’de path’te id yoksa genelde /User/Delete?id=... */
  deleteUser(id: number) {
   return this.http.delete(`${this.baseUser}/Delete`, {
    body: { id },                    // Eğer C# tarafı "Id" PascalCase istiyorsa: body: { Id: id }
    responseType: 'text' as 'json'
  });
}

}
