export interface IlanModel {
  title: string;
  description: string;
  eventDate: string;
  cityId?: number;
  districtId?: number;
  cityName?: string;      
  districtName?: string;  
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