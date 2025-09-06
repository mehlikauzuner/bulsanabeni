export type BadgeDto = {
  id: number;
  code: string;
  badgeName: string;
  description?: string | null;
  iconUrl?: string | null;
  criteriaType: string;
  threshold: number;
};

export type BadgeCreateDto = {
  code: string;
  badgeName: string;
  description?: string | null;
  iconUrl?: string | null;
  criteriaType: string;
  threshold: number;
};

