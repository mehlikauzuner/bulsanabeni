
export default interface IlanModel {
  
  User: {
    fullName: string;
    joinedAt: Date;
  };

  
  title: string;
  maxTitleLen: number;
  description: string;
  maxDescLen: number;

  
  selectedDate: Date | null;   
  minDate: Date;              
  times: string[];             
  selectedTime: string | null;

  
  city?: string | null;
  district?: string | null;
  selectedCityId?: number | null;

  cityQuery: string;
  districtQuery: string;
  selectedCity: string | null;       
  selectedDistrict: string | null;   
  filteredCities: { id: number; name: string }[];
  filteredDistricts: { id: number; name: string }[];

  
  loading: boolean;
  errors: Partial<Record<'title' | 'description' | 'date' | 'time', string>>;


}


// IlanModel'den gerekli alanları alıp API'ye uygun hale getiriyoruz
export type CreateCruiseRequest = Pick<IlanModel, 'title' | 'description' | 'city' | 'district'> & {
  dateTime: string;
  createdBy: string;
};
