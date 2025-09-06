export interface RatingDto {
  targetUserId: number;
  raterId: number;
  score: number; // 1..5 gibi
}

export interface RatingCreateDto {
  targetUserId: number;
  raterId: number;
  score: number;
}

export interface RatingSummaryDto {
  avg: number;
  count: number;
}
