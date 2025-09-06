// src/app/components/admin/users/admin-users.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDto, UserUpdateDto } from '../../../models/user-model';
import { UserService } from '../../../services/user-service';
import { AdminUserService } from '../../../services/admin-user-service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.html',
  styleUrls: ['./users.css']
})
export class AdminUsers implements OnInit {
  rows: UserDto[] = [];
  loading = false;
  error = '';
  info = '';

  constructor(private api: AdminUserService) {}

  ngOnInit(): void { this.fetch(); }

  /** Id/PascalCase farkını normalize et */
  private normalize(x: any): UserDto {
    const raw = x.birthDate ?? x.BirthDate ?? '';
    const iso = raw ? new Date(raw).toISOString() : '';
    return {
      id: x.id ?? x.Id,
      userName: x.userName ?? x.UserName ?? '',
      email: x.email ?? x.Email ?? '',
      city: x.city ?? x.City ?? '',
      birthDate: iso,
      status: (x.status ?? x.Status) === true,
      firstName: x.firstName ?? x.FirstName ?? '',
      lastName: x.lastName ?? x.LastName ?? ''
    };
  }


  /** Listele */
  fetch() {
    this.loading = true; this.error = ''; this.info = '';
    this.api.getAllUsers().subscribe({
      next: (res: any) => {
        const raw = Array.isArray(res) ? res : (res?.data ?? []);
        this.rows = raw.map((x: any) => this.normalize(x));
        this.loading = false;
      },
      error: (err) => {
        console.error('USERS_LIST_ERR', err);
        this.error = 'Liste alınamadı.';
        this.loading = false;
      }
    });
  }

  editUser(u: UserDto) {
  const userName = (prompt('UserName', u.userName) ?? u.userName).trim(); if (!userName) return;
  const email    = (prompt('Email',    u.email)    ?? u.email   ).trim(); if (!email)    return;
  const city     = (prompt('City',     u.city)     ?? u.city    ).trim();

  const cur = u.birthDate ? u.birthDate.slice(0, 10) : '';
  const bd  = (prompt('BirthDate (YYYY-MM-DD)', cur) ?? cur).trim();
  if (bd && isNaN(Date.parse(bd))) { alert('Tarih formatı: YYYY-MM-DD'); return; }
  const birthDateIso = bd ? new Date(bd).toISOString() : u.birthDate;

  const firstName = (prompt('FirstName', u.firstName) ?? u.firstName).trim();
  const lastName  = (prompt('LastName',  u.lastName ) ?? u.lastName ).trim();

  const statusStr = (prompt('Status (true/false)', String(!!u.status)) ?? String(!!u.status)).toLowerCase();
  const status = ['true','1','evet','yes'].includes(statusStr);

  const dto: UserUpdateDto = {
    id: u.id,
    userName, email, city,
    birthDate: birthDateIso,
    firstName, lastName,
    status
  };

  this.info = ''; this.error = '';
  this.api.updateUser(dto).subscribe({
    next: () => { this.info = 'Kullanıcı güncellendi.'; this.fetch(); },
    error: (err) => { console.error('USER_UPD_ERR', err); this.error = 'Güncelleme başarısız.'; }
  });
}


  /** Sil */
  deleteUser(u: UserDto) {
    if (!confirm(`#${u.id} - ${u.userName} silinsin mi?`)) return;
    this.info = ''; this.error = '';
    this.api.deleteUser(u.id).subscribe({
      next: () => { this.info = 'Kullanıcı silindi.'; this.fetch(); },
      error: (err) => { console.error('USER_DEL_ERR', err); this.error = 'Silme başarısız.'; }
    });
  }

  /** Görünüm için YYYY-MM-DD kısaltma */
  shortDate(iso: string) { return iso ? iso.slice(0, 10) : ''; }
}
