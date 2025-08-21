export interface UserDto {
  id: number;
  username: string;
  city?: string;
  avatarUrl?: string;
  ratingAvg?: number;
  ratingCount?: number;
}

export interface BadgeDto {
  id: number;
  name: string;
  icon?: string; // emoji ya da icon url
}

export interface ReviewDto {
  id: number;
  author: string;
  when: string;
  text: string;
}
