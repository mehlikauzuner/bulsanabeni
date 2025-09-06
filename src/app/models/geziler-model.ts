export interface GezilerDto {
  id?: number;              
  userName: string;
  title: string;
  description: string;
  date: string;             
  cityName: string;
  district: string;
  createdBy?: string;
}

export interface GezilerUpdateDto {
  id: number;
  title: string;
  description: string;
  date: string;         
  cityName: string;
  district: string;
}

export interface GezilerCreateDto {
  title: string;
  description: string;
  date: string;      // ISO: "2025-09-06T00:00:00.000Z" veya "YYYY-MM-DD"
  cityName: string;
  district: string;
  userId?: number;   // backend isterse
  userName?: string; // backend isterse
  time?: string;     // backend isterse (örn. "14:30")
}
