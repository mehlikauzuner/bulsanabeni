import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminBadgesService } from '../../../services/adminbadge-service';
import { BadgeCreateDto, BadgeDto } from '../../../models/badge-model';


@Component({
  selector: 'app-admin-badges',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './badges.html',
  styleUrls: ['./badges.css']
})
export class AdminBadges implements OnInit {
  rows: BadgeDto[] = [];
  loading = false;
  error = '';
  info = '';

  constructor(private api: AdminBadgesService) {}

  ngOnInit(): void { this.fetch(); }

  /** Backend camelCase/PascalCase farkı için normalize */
  private normalize(x: any): BadgeDto {
    return {
      id: x.id ?? x.Id,
      code: x.code ?? x.Code ?? '',
      badgeName: x.badgeName ?? x.BadgeName ?? '',
      description: x.description ?? x.Description ?? null,
      iconUrl: x.iconUrl ?? x.IconUrl ?? null,
      criteriaType: x.criteriaType ?? x.CriteriaType ?? '',
      threshold: x.threshold ?? x.Threshold ?? 0
    };
  }

  /** GET ALL */
  fetch() {
    this.loading = true; this.error = ''; this.info = '';
    this.api.list().subscribe({
      next: (res: any) => {
        const raw = Array.isArray(res) ? res : (res?.data ?? []);
        this.rows = raw.map((x: any) => this.normalize(x));
        this.loading = false;
      },
      error: () => { this.error = 'Liste alınamadı.'; this.loading = false; }
    });
  }

  /** ADD (prompts ile) */
  addBadge() {
    // addBadge() içinde
const code = (prompt('Code?') ?? '').trim() || ('GEN-' + Date.now());
const badgeName = (prompt('BadgeName? (zorunlu)') ?? '').trim();
if (!badgeName) { alert('BadgeName zorunlu'); return; }

const description = (prompt('Description (opsiyonel)') ?? '').trim();
const iconUrl = (prompt('IconUrl (opsiyonel)') ?? '').trim();
const criteriaType = (prompt('CriteriaType? (zorunlu, örn: EventCount)') ?? '').trim();
if (!criteriaType) { alert('CriteriaType zorunlu'); return; }

const thrStr = (prompt('Threshold (sayı, >=1)?', '1') ?? '1').trim();
const threshold = Number(thrStr);
if (!Number.isFinite(threshold) || threshold < 1) { alert('Threshold >= 1 olmalı'); return; }

const dto: BadgeCreateDto = {
  code,
  badgeName,
  description: description || null,
  iconUrl: iconUrl || null,
  criteriaType,
  threshold
};

this.info = ''; this.error = '';
this.api.add(dto).subscribe({
  next: () => { this.info = 'Rozet eklendi.'; this.fetch(); },
  error: (err) => {
    // Hata nedenini gör: 404 (/Add yanlış), 400 (validation), CORS (status 0) vb.
    console.error('ADD_ERR', err);
    this.error = 'Ekleme başarısız: ' + (err?.error?.message || err?.statusText || err?.message || '');
  }
});

  }

  /** UPDATE (prompts ile, mevcut değerleri varsayılan koy) */
  editBadge(b: BadgeDto) {
    const code = prompt('Code', b.code) ?? b.code;
    const badgeName = prompt('BadgeName (zorunlu)', b.badgeName) ?? b.badgeName;
    if (!badgeName.trim()) return;

    const description = prompt('Description (opsiyonel)', b.description ?? '') ?? (b.description ?? '');
    const iconUrl = prompt('IconUrl (opsiyonel)', b.iconUrl ?? '') ?? (b.iconUrl ?? '');
    const criteriaType = prompt('CriteriaType', b.criteriaType) ?? b.criteriaType;
    const thrStr = prompt('Threshold (sayı)', String(b.threshold)) ?? String(b.threshold);

    const dto: Partial<BadgeCreateDto> = {
      code: code.trim(),
      badgeName: badgeName.trim(),
      description: description.trim() ? description.trim() : null,
      iconUrl: iconUrl.trim() ? iconUrl.trim() : null,
      criteriaType: criteriaType.trim(),
      threshold: isNaN(Number(thrStr)) ? b.threshold : Number(thrStr)
    };

    this.info = ''; this.error = '';
    this.api.update(b.id, dto).subscribe({
      next: () => { this.info = 'Rozet güncellendi.'; this.fetch(); },
      error: () => { this.error = 'Güncelleme başarısız.'; }
    });
  }

  /** DELETE */
  deleteBadge(b: BadgeDto) {
    if (!confirm(`#${b.id} - "${b.badgeName}" silinsin mi?`)) return;
    this.info = ''; this.error = '';
    this.api.delete(b.id).subscribe({
      next: () => { this.info = 'Rozet silindi.'; this.fetch(); },
      error: () => { this.error = 'Silme başarısız.'; }
    });
  }

  /** REMOVE FROM USER */
  removeFromUser() {
    const uidStr = prompt('User ID?');
    const bidStr = prompt('Badge ID?');
    if (uidStr == null || bidStr == null) return;

    const userId = Number(uidStr);
    const badgeId = Number(bidStr);
    if (isNaN(userId) || isNaN(badgeId)) { alert('Geçersiz ID'); return; }

    this.info = ''; this.error = '';
    this.api.removeFromUser(userId, badgeId).subscribe({
      next: () => { this.info = `Kullanıcı ${userId} -> Badge ${badgeId} kaldırıldı.`; },
      error: () => { this.error = 'Kaldırma başarısız.'; }
    });
  }
}
