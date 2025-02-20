import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authenticated = signal(false); 

  login() {
    this.authenticated.set(true);
  }

  logout() {
    this.authenticated.set(false);
  }

  isUserAuthenticated(): boolean {
    return this.authenticated(); 
  }
}