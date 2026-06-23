import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CookieManagerService } from '../../services/cookie-manager';

@Component({
  selector: 'app-cookie-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cookie-banner.html',
  styleUrl: './cookie-banner.css'
})
export class CookieBannerComponent implements OnInit {
  isVisible = true;

  constructor(private cookieManager: CookieManagerService) {}

  ngOnInit(): void {
    this.isVisible = this.cookieManager.getCookie('hotel_lux_cookie_consent') !== 'accepted';
  }

  acceptCookies(): void {
    this.cookieManager.setCookie('hotel_lux_cookie_consent', 'accepted', 365);
    this.isVisible = false;
  }
}
