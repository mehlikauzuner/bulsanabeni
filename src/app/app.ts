import { Component, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Navbar } from './components/global/navbar/navbar';
import { Footer } from './components/global/footer/footer';
import { filter } from 'rxjs';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('bulbeni');
  

}
