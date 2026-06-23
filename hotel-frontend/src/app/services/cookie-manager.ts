import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CookieManagerService {
  setCookie(name: string, value: string, expireDays: number): void {
    if (typeof document === 'undefined') {
      return;
    }

    const expires = new Date();
    expires.setTime(expires.getTime() + expireDays * 24 * 60 * 60 * 1000);

    document.cookie = [
      `${encodeURIComponent(name)}=${encodeURIComponent(value)}`,
      `expires=${expires.toUTCString()}`,
      'path=/',
      'SameSite=Lax'
    ].join('; ');
  }

  getCookie(name: string): string | null {
    if (typeof document === 'undefined') {
      return null;
    }

    const cookieName = `${encodeURIComponent(name)}=`;
    const cookies = document.cookie.split('; ');
    const cookie = cookies.find((item) => item.startsWith(cookieName));

    return cookie ? decodeURIComponent(cookie.substring(cookieName.length)) : null;
  }
}
