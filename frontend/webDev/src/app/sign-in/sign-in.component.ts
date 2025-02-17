import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent {
  constructor(private authService: AuthService, private router: Router) {}

  signIn(): void {
    this.authService.login(); // Log the user in
    this.router.navigate(['/home']); // Redirect to home page
  }
}