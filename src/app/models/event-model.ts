export interface EventDto {
  id: number;
  categoryId: number;
  eventName: string;
}

export interface EventCreateDto {
  categoryId: number;
  eventName: string;
}

// İstersen kullanırsın; zorunlu değil
export interface EventUpdateDto {
  id: number;
  eventName: string;
}
export interface EventCategoryUpdateDto {
  id: number;
  categoryId: number;
  eventName: string;
}
