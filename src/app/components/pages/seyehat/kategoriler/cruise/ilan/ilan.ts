import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ilan',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './ilan.html',
  styleUrl: './ilan.css'
})
export class Ilan {
ilanBaslik: string = '';
}
