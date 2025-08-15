export interface DetayModel {
    id: number;
  title: string;
  description: string;
  dateTime: string;     // ISO (etkinliğin zamanı)
  city: string;
  district: string;
  createdBy: string;    // ilan sahibi adı
  createdAt: string;    // ilan oluşturulma tarihi (ISO)
  userAvatarUrl?: string; // varsa
}
