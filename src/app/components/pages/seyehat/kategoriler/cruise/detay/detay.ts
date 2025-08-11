import { Component, OnInit, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-ilan-detay',
  standalone: true,
  imports: [CommonModule,],
  templateUrl: './detay.html',
  styleUrls: ['./detay.css']
})
export class Detay implements OnInit {
  private _ilan: any = null;      // istersen sonra interface’e çeviririz
  ilan = computed(() => this._ilan);

  ngOnInit() {
    const st = window.history.state as { ilan?: any };
    if (st?.ilan) {
      this._ilan = st.ilan;
      localStorage.setItem('lastIlan', JSON.stringify(this._ilan));
      return;
    }
    const raw = localStorage.getItem('lastIlan');
    if (raw) this._ilan = JSON.parse(raw);
  }
}
