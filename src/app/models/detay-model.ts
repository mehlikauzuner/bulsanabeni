// src/app/models/ilan-detail.model.ts
export interface DetayModel {
  id: number;
  userId: number;
  title: string;
  description: string;
  date: string;   // ISO datetime string
  time: string;   // "HH:mm:ss" (veya DB’de string)
  city: string;
  district: string;
}
