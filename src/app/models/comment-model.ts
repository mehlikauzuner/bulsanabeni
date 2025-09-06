export interface CommentModel {
  id: number;
  targetUserId: number;
  authorUserId: number;
  authorName: string;
  content: string;
  createdAt: string;
}