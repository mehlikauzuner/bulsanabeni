import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { BadgeDto, ReviewDto, ProfilDetailDto, CommentDto, CommentCreate, UserBadgeDto } from '../../../../models/kullanici-model';
import { ProfilDetailService } from '../../../../services/kullanici-service';
import { AuthService } from '../../../../services/auth-service';

type TabKey = 'rozetler' | 'yorumlar' | 'mesaj';

interface RatingSummaryDto { avg: number; count: number; }

@Component({
  selector: 'app-kullanici',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './kullanici.html',
  styleUrls: ['./kullanici.css']
})
export class Kullanici implements OnInit {
  userId = 0;       // profil sahibinin id'si
  meId  = 0;        // giriş yapan kullanıcı id'si

  // mesaj
  messageText = '';
  isSending = false;

  // genel
  isLoading = true;
  error: string | null = null;
  activeTab: TabKey = 'rozetler';

  // kullanıcı
  user: ProfilDetailDto = {
    id: 0,
    username: '',
    email: '',
    city: '',
    avatarUrl: '',
    ratingAvg: 0,
    ratingCount: 0,
    birthDate: null,
    bio: null
  };
  
  reviews: ReviewDto[] = [];
  badges: UserBadgeDto[] = [];

isBadgesLoading = false;
badgesError: string | null = null;
private badgesLoadedOnce = false;

  sendOk = false;
  showComposer = true;
  private successTimer: any = null;

  // --- Yorumlar ---
  comments: CommentDto[] = [];
  isCommentsLoading = false;

  commentText = '';
  isCommentSending = false;
  commentSendOk = false;
  private commentTimer: any = null;

  // --- Puanlama ---
  myScore = 0;
  isRatingSending = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private profil: ProfilDetailService,
    private auth: AuthService,
    private commentsService: ProfilDetailService
  ) {}

  ngOnInit(): void {
    this.meId = this.auth.currentUserId() ?? Number(localStorage.getItem('userId') || 0);

    this.route.paramMap.subscribe(p => {
      const id = Number(p.get('id')) || 0;
      if (id && id !== this.userId) {
        this.userId = id;
        this.loadUser(id);
        if (this.activeTab === 'yorumlar') {
          this.loadComments(id);
          this.loadSummary(id);
        }
      }
    });

    this.route.queryParamMap.subscribe(qm => {
      const tab = (qm.get('tab') || '').toLowerCase();
      if (tab === 'mesaj') this.setTab('mesaj');
    });
  }

  private loadUser(id: number): void {
    this.isLoading = true;
    this.error = null;

    this.profil.getById(id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (u: ProfilDetailDto) => {
          this.user = u;
          if (this.activeTab === 'yorumlar') {
            this.loadComments(id);
            this.loadSummary(id); // ⭐ üst bandı güncelle
          }
        },
        error: (err) => {
          console.error('getById error', err);
          this.error = 'Kullanıcı bulunamadı.';
        }
      });
  }

  // Görsel ad
  get displayName(): string {
    const u: any = this.user as any;
    return (u.username || u.userName || '').trim();
  }
  get initialLetter(): string { return '😎'; }

  setTab(tab: 'rozetler'|'yorumlar'|'mesaj') {
  this.activeTab = tab;
  if (tab === 'yorumlar') {
    this.loadComments(this.userId);
    this.loadSummary(this.userId);
    this.loadBadges(this.userId);
  }
}


  // --- Mesaj ---
  onMessageInput(ev: Event): void {
    this.messageText = (ev.target as HTMLTextAreaElement).value ?? '';
  }
 sendMessage(): void {
  if (this.meId === this.userId) return;   // ✅ kendine mesajı engelle

  const text = (this.messageText || '').trim();
  if (!text || !this.meId || !this.userId) return;

  this.isSending = true;
  this.profil.send({
    senderId: this.meId,
    receiverId: this.userId,
    content: text,
    createdAt: new Date().toISOString()
  })
  .pipe(finalize(() => (this.isSending = false)))
  .subscribe({
    next: () => {
      this.messageText = '';
      this.showComposer = false;
      this.sendOk = true;
      if (this.successTimer) clearTimeout(this.successTimer);
      this.successTimer = setTimeout(() => (this.sendOk = false), 3000);
    },
    error: (err) => console.error('POST ERROR', err)
  });
}
  newMessage(): void {
    this.sendOk = false;
    this.showComposer = true;
    this.messageText = '';
  }
  onEnter(ev: KeyboardEvent): void {
    if (ev.ctrlKey || ev.metaKey) {
      ev.preventDefault();
      this.sendMessage();
    }
  }

  // --- Yorumlar ---
 private loadComments(userId: number): void {
  this.isCommentsLoading = true;
  this.profil.getByTargetUserId(userId)   // ✅ commentsService yerine profil
    .pipe(finalize(() => this.isCommentsLoading = false))
    .subscribe({
      next: (list) => this.comments = list,
      error: (err) => console.error('comments load error', err)
    });
}

  onCommentInput(ev: Event): void {
    this.commentText = (ev.target as HTMLTextAreaElement).value ?? '';
  }
 
  sendComment(): void {
  if (this.meId === this.userId) return;   // ✅ kendine yorum engelle

  const text = (this.commentText || '').trim();
  if (!text || !this.meId || !this.userId) return;

  const body: CommentCreate = {
    targetUserId: this.userId,
    authorUserId: this.meId,
    authorName: this.displayName || 'Kullanıcı',
    content: text
  };

  this.isCommentSending = true;
  this.profil.createComment(body)
    .pipe(finalize(() => this.isCommentSending = false))
    .subscribe({
      next: (created: any) => {
        if (created && typeof created === 'object' && 'id' in created) {
          this.comments.unshift(created as CommentDto);
        } else {
          this.loadComments(this.userId);
        }
        this.commentText = '';
        this.commentSendOk = true;
        if (this.commentTimer) clearTimeout(this.commentTimer);
        this.commentTimer = setTimeout(() => (this.commentSendOk = false), 2500);
      },
      error: (err) => console.error('comment post error', err)
    });
  }

  onCommentEnter(ev: KeyboardEvent): void {
    if (ev.ctrlKey || ev.metaKey) {
      ev.preventDefault();
      this.sendComment();
    }
  }

  // --- Puanlama ---
  setScore(n: number) { this.myScore = n; }

  private loadSummary(userId: number): void {
    this.profil.getRatingSummary(userId).subscribe({
      next: (s: RatingSummaryDto) => {
        this.user.ratingAvg = s.avg ?? 0;
        this.user.ratingCount = s.count ?? 0;
      },
      error: (e) => console.warn('rating summary error', e)
    });
  }

 sendRating(): void {
  if (!this.myScore || !this.userId || !this.meId) return;

  const body = {
    targetUserId: this.userId,
    score: this.myScore,
    raterId: this.meId            
  };

  this.isRatingSending = true;
  this.profil.createRating(body)
    .pipe(finalize(() => this.isRatingSending = false))
    .subscribe({
      next: () => this.loadSummary(this.userId),
      error: (err) => console.error('rating post error', err)
    });
}

private loadBadges(userId: number) {
  this.isBadgesLoading = true;
  this.badgesError = null;

  this.profil.getUserBadges(userId).subscribe({
    next: (res) => { this.badges = res || []; this.isBadgesLoading = false; },
    error: (err) => {
      console.error('[Profil] getUserBadges hata:', err);
      this.badgesError = err?.error?.message || 'Rozetler alınamadı.';
      this.isBadgesLoading = false;
    }
  });
}



  goBack(): void {
    if (history.length > 1) history.back();
    else this.router.navigateByUrl('/hesabim');
  }
}
