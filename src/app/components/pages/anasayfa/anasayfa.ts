import { Component } from '@angular/core';
import { LottieComponent } from 'ngx-lottie';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LottieComponent],
  template: `
    <div class="hero">
      <ng-lottie [options]="options"></ng-lottie>
      <h1>Gezginler Voyage</h1>
    </div>
  `
})
export class Anasayfa {
  options: AnimationOptions = {
    path: 'assets/lottie/earth.json',
    loop: true,
    autoplay: true
  };
}
