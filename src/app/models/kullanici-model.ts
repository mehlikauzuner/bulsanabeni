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



export interface ProfilDetailDto extends UserDto {
  email: string;
  birthDate?: string | null;
  bio?: string | null;
  // avatarUrl, city, ratingAvg, ratingCount zaten UserDto'dan geliyor
}

export interface MessageDto {
  id: number;
  senderId: number;
  senderName?: string;
  receiverId: number;
  receiverName?: string;
  content: string;
  createdAt: string; // Date de olabilir
}

export interface MessageCreate {
  senderId: number;
  receiverId: number;
  content: string;
  createdAt: string;
}