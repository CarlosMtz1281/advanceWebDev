import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = false; 

  constructor() {}

  login(): void {
    this.isAuthenticated = true;
    localStorage.setItem('auth', 'true'); 
  }

  logout(): void {
    this.isAuthenticated = false;
    localStorage.removeItem('auth');
  }

  isUserAuthenticated(): boolean {
    return localStorage.getItem('auth') === 'true';
  }
}