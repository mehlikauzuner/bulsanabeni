// src/app/models/model.ts
export interface IlanModel {
  title: string;
  description: string;
  // ISO "YYYY-MM-DD" olarak saklayacağız
  eventDate: string;
  // ŞEHİR/İLÇE tercihen ID ile gönder (en doğrusu)
  cityId?: number;
  districtId?: number;

  // Serbest metin girilecekse backend tarafında tolere etmek istersen:
  cityName?: string;      // kullanıcı serbest yazarsa
  districtName?: string;  // kullanıcı serbest yazarsa
}

/** Backend’ten beklenen tipler (listeleme için) */
export interface City {
  id: number;
  name: string;
}

export interface District {
  id: number;
  cityId: number;
  name: string;
}

