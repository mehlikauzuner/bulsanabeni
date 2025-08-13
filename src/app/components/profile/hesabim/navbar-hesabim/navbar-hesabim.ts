import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar-hesabim',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar-hesabim.html',
  styleUrls: ['./navbar-hesabim.css']
})
export class NavbarHesabim {

}
