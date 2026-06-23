import { Component, HostListener, OnDestroy, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet, RouterModule, Scroll } from '@angular/router';
import { CommonModule, ViewportScroller } from '@angular/common';
import { AuthService } from './services/auth';
import { Subscription } from 'rxjs';
import { CookieBannerComponent } from './components/cookie-banner/cookie-banner';
import { FormsModule } from '@angular/forms';
import { RoomService } from './services/room';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule, FormsModule, CookieBannerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnDestroy {
  protected readonly title = signal('hotel-frontend');
  isScrolled = false;
  isHomeRoute = true;
  isMobileMenuOpen = false;
  newsletterEmail = '';
  isNewsletterSending = false;
  private routerSubscription: Subscription;
  private scrollFrame: number | null = null;

  constructor(
    public authService: AuthService,
    private roomService: RoomService,
    private router: Router,
    private viewportScroller: ViewportScroller
  ) {
    this.viewportScroller.setOffset([0, 100]);
    this.updateNavbarMode(this.router.url);

    this.routerSubscription = this.router.events
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.updateNavbarMode(event.urlAfterRedirects);
          this.closeMobileMenu();
        }

        if (event instanceof Scroll && event.anchor) {
          setTimeout(() => {
            this.viewportScroller.scrollToAnchor(event.anchor as string);
          }, 100);
        }
      });
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (this.scrollFrame !== null) {
      return;
    }

    this.scrollFrame = window.requestAnimationFrame(() => {
      this.isScrolled = window.scrollY > 24;
      this.scrollFrame = null;
    });
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();

    if (this.scrollFrame !== null) {
      window.cancelAnimationFrame(this.scrollFrame);
    }
  }

  onLogoClick(event?: Event): void {
    event?.preventDefault();
    this.closeMobileMenu();

    const path = this.router.url.split('?')[0].split('#')[0];

    if (path === '/' || path === '') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    this.router.navigate(['/']);
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  logout(): void {
    this.closeMobileMenu();
    this.authService.logout();
  }

  submitNewsletter(): void {
    const email = this.newsletterEmail.trim();

    if (!email || this.isNewsletterSending) {
      return;
    }

    this.isNewsletterSending = true;
    this.roomService.subscribeToNewsletter(email).subscribe({
      next: async () => {
        this.isNewsletterSending = false;
        this.newsletterEmail = '';
        const Swal = await import('sweetalert2');
        Swal.default.fire({
          title: 'Witaj w newsletterze!',
          text: 'Twój adres e-mail został zapisany. Będziemy informować Cię o najlepszych ofertach Hotel Lux.',
          icon: 'success',
          confirmButtonText: 'Świetnie',
          confirmButtonColor: '#0dcaf0',
          background: 'rgba(255,255,255,0.98)',
          backdrop: 'rgba(15,23,42,0.55)',
          customClass: {
            popup: 'rounded-4 shadow-lg',
            confirmButton: 'px-4 py-2 fw-bold'
          }
        });
      },
      error: async (err: any) => {
        this.isNewsletterSending = false;
        const duplicateEmail = err.status === 422 && err.error?.errors?.email;
        const Swal = await import('sweetalert2');
        Swal.default.fire({
          title: duplicateEmail ? 'Ten adres jest już zapisany' : 'Nie udało się zapisać',
          text: duplicateEmail
            ? 'Wygląda na to, że ten e-mail już otrzymuje nasz newsletter.'
            : (err.error?.message || 'Spróbuj ponownie za chwilę.'),
          icon: duplicateEmail ? 'info' : 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: duplicateEmail ? '#0dcaf0' : '#dc3545',
          background: 'rgba(255,255,255,0.98)',
          backdrop: 'rgba(15,23,42,0.55)',
          customClass: {
            popup: 'rounded-4 shadow-lg',
            confirmButton: 'px-4 py-2 fw-bold'
          }
        });
      }
    });
  }

  private updateNavbarMode(url: string): void {
    const path = url.split('?')[0].split('#')[0];
    this.isHomeRoute = path === '/' || path === '';
  }
}
