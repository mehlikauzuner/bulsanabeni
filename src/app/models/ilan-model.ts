export interface IlanModel {
  title: string;
  description: string;
  eventDate: string;
  district: string;
  cityName: string;      
  districtName?: string;  
  userName?: string
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