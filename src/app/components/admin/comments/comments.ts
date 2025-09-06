import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentModel } from '../../../models/comment-model';
import { AdminCommentsService } from '../../../services/comment-service';


@Component({
  selector: 'app-admin-comments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comments.html',
  styleUrls: ['./comments.css']
})
export class AdminComments {
  rows: CommentModel[] = [];
  loading = false;
  error = '';
  info = '';

  // basit inputlar (FormsModule yok)
  targetUserIdInput = '';
  lastTargetUserId: number | null = null; // Yenile için

  constructor(private api: AdminCommentsService) {}

 private normalize(x: any) {
  return {
    id: x.id ?? x.Id ?? x.commentId ?? x.CommentId, // tüm olasılıkları dene
    targetUserId: x.targetUserId ?? x.TargetUserId,
    authorUserId: x.authorUserId ?? x.AuthorUserId,
    authorName: x.authorName ?? x.AuthorName ?? '',
    content: x.content ?? x.Content ?? '',
    createdAt: (x.createdAt ?? x.CreatedAt ?? '').toString()
  };
}

deleteComment(c: any) {
  const id = c.id ?? c.Id ?? c.commentId ?? c.CommentId;
  if (!Number.isInteger(id) || id <= 0) {
    alert('Bu satırda geçerli Id yok (Id>0). Lütfen backend listesinin Id gönderdiğini doğrula.');
    console.log('ROW_WITHOUT_VALID_ID', c);
    return;
  }

  this.info = ''; this.error = '';
  this.api.delete(id).subscribe({
    next: () => { this.info = 'Yorum silindi.'; this.refresh(); },
    error: (err) => { console.error('COMMENT_DEL_ERR', err); this.error = 'Silme başarısız.'; }
  });
}




  searchByTarget() {
    const n = Number(this.targetUserIdInput);
    if (!Number.isFinite(n)) { this.error = 'Geçerli TargetUserId gir.'; return; }

    this.loading = true; this.error = ''; this.info = '';
    this.api.listByTargetUserId(n).subscribe({
      next: (res: any) => {
        const raw = Array.isArray(res) ? res : (res?.data ?? []);
        this.rows = raw.map((x: any) => this.normalize(x));
        this.lastTargetUserId = n;
        this.loading = false;
      },
      error: (err) => { console.error('COMMENTS_LIST_ERR', err); this.error = 'Liste alınamadı.'; this.loading = false; }
    });
  }

  refresh() {
    if (this.lastTargetUserId != null) {
      this.targetUserIdInput = String(this.lastTargetUserId);
      this.searchByTarget();
    }
  }


}
