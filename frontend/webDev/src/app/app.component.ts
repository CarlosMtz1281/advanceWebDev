import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { NavbarComponent } from './navbar/navbar.component';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent], 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  isAuthenticated = signal(false);

  constructor(private authService: AuthService) {
    this.isAuthenticated.set(this.authService.isUserAuthenticated());
  }
}