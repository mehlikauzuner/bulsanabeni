

@Component({
  selector: 'app-detay',
  imports: [],
  templateUrl: './detay.html',
  styleUrl: './detay.css'
})
export class CruiseDetay {

}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

type DetayIlan = {
  title: string;
  description: string;
  dateISO: string | null;
  time: string | null;
  city: string | null;
  district: string | null;
  user: { fullName: string; joinedAt?: string | Date; avatarUrl?: string };
};

@Component({
  selector: 'app-detay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detay.html',
  styleUrls: ['./detay.css']
})
export class Detay implements OnInit {
  ilan: DetayIlan | null = null;

  ngOnInit() {
    const raw = localStorage.getItem('detaySonIlan');
    this.ilan = raw ? JSON.parse(raw) : null;
  }

  get prettyDate(): string {
    if (!this.ilan?.dateISO) return '-';
    const d = new Date(this.ilan.dateISO);
    return d.toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });
  }

  get prettyPlace(): string {
    const c = this.ilan?.city || '';
    const d = this.ilan?.district || '';
    return [c, d].filter(Boolean).join(' • ');
  }
}