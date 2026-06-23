import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response.token && this.hasBrowserStorage()) {
          window.localStorage.setItem('auth_token', response.token);
          window.localStorage.setItem('user', JSON.stringify(response.user));
        }
      })
    );
  }

  register(payload: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, payload);
  }

  isLoggedIn(): boolean {
    const token = this.getStoredToken();
    return !!token;
  }

  isAdmin(): boolean {
    if (!this.hasBrowserStorage()) return false;

    const userData = window.localStorage.getItem('user');
    if (!userData) return false;

    try {
      const user = JSON.parse(userData);
      return user.role === 'admin';
    } catch {
      return false;
    }
  }

  validateSession(): Observable<any> {
    const token = this.getStoredToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(`${this.apiUrl}/user`, { headers }).pipe(
      tap((user: any) => {
        if (this.hasBrowserStorage()) {
          window.localStorage.setItem('user', JSON.stringify(user));
        }
      })
    );
  }

  clearSession(): void {
    if (!this.hasBrowserStorage()) return;

    window.localStorage.removeItem('auth_token');
    window.localStorage.removeItem('user');
    window.localStorage.removeItem('user_name');
  }

  logout() {
    this.clearSession();
    window.location.href = '/'; 
  }

  getUserName(): string {
    if (!this.hasBrowserStorage()) return '';

    const user = window.localStorage.getItem('user');
    if (!user) return '';

    try {
      return JSON.parse(user).name;
    } catch {
      return '';
    }
  }

  private getStoredToken(): string {
    if (!this.hasBrowserStorage()) return '';

    const token = window.localStorage.getItem('auth_token');
    const normalizedToken = typeof token === 'string' ? token.trim() : '';

    if (!normalizedToken || normalizedToken === 'undefined' || normalizedToken === 'null') {
      return '';
    }

    return normalizedToken;
  }

  private hasBrowserStorage(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }
}
