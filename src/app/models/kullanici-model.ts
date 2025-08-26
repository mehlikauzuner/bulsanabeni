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
  createdAt: string; 
}

export interface MessageCreate {
  senderId: number;
  receiverId: number;
  content: string;
  createdAt: string;
}

export interface CommentCreate {
  targetUserId: number;
  authorUserId: number;
  authorName: string;
  content: string;
}

export interface CommentDto {
  id: number;
  targetUserId: number;
  authorUserId: number;
  authorName: string;
  content: string;
  createdAt: string; 
}

export interface RatingSummaryDto { avg: number; count: number; }
export interface RatingCreate { targetUserId: number; score: number;
  raterId : number;
 }
export interface RatingDto {
  id: number;
  targetUserId: number;
  raterId: number;
  score: number;
  createdAt?: string;
}
