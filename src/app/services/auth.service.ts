import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private user: any = null;

  constructor(private router: Router) {}

  login(username: string, password: string): boolean {
    if (username === '123' && password === '123') {
      this.isAuthenticated = true;
      this.user = { name: 'User' };
      this.router.navigate(['/characters']);
      return true;
    }
    return false;
  }

  logout(): void {
    this.isAuthenticated = false;
    this.user = null;
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  getUser(): any {
    return this.user;
  }
}
