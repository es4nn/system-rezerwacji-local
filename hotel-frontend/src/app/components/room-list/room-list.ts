import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { RoomService } from '../../services/room'; 
import { FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule], 
  templateUrl: './room-list.html', 
  styleUrl: './room-list.css'      
})
export class RoomList implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('slider') slider!: ElementRef;
  @ViewChild('bookingFormElement') bookingFormElement?: ElementRef<HTMLFormElement>;

  rooms: any[] = [];
  readonly roomSkeletons = Array.from({ length: 4 });
  selectedRoom: any = null;
  occupiedDates: any[] = [];
  scrollInterval: any;
  heroInterval: any;
  private reviewScrollFrame: number | null = null;
  private heroPreloadLink: HTMLLinkElement | null = null;
  currentHeroIndex = 0;
  loadedHeroSlides = new Set([0]);
  isBookingSaving = false;
  isRoomsLoading = true;
  isSearchingRooms = false;
  isContactSending = false;
  contactFormError = '';
  contactFieldErrors: Record<string, string> = {};
  bookingFormSubmitted = false;
  bookingFormError = '';
  bookingFieldErrors: Record<string, string> = {};
  heroSlides = [
    {
      alt: 'Hotel Lux nad jeziorem',
      fallback: '/assets/hero-hotel-lake-1920.webp',
      webpSrcset: '/assets/hero-hotel-lake-768.webp 768w, /assets/hero-hotel-lake-1280.webp 1280w, /assets/hero-hotel-lake-1920.webp 1920w',
      avifSrcset: '/assets/hero-hotel-lake-768.avif 768w, /assets/hero-hotel-lake-1280.avif 1280w, /assets/hero-hotel-lake-1920.avif 1920w'
    },
    {
      alt: 'Basen i resort Hotel Lux',
      fallback: '/assets/hero-resort-pool-1920.webp',
      webpSrcset: '/assets/hero-resort-pool-768.webp 768w, /assets/hero-resort-pool-1280.webp 1280w, /assets/hero-resort-pool-1920.webp 1920w',
      avifSrcset: '/assets/hero-resort-pool-768.avif 768w, /assets/hero-resort-pool-1280.avif 1280w, /assets/hero-resort-pool-1920.avif 1920w'
    },
    {
      alt: 'Restauracja Hotel Lux',
      fallback: '/assets/hero-restaurant-1920.webp',
      webpSrcset: '/assets/hero-restaurant-768.webp 768w, /assets/hero-restaurant-1280.webp 1280w, /assets/hero-restaurant-1920.webp 1920w',
      avifSrcset: '/assets/hero-restaurant-768.avif 768w, /assets/hero-restaurant-1280.avif 1280w, /assets/hero-restaurant-1920.avif 1920w'
    }
  ];
  roomVisuals = [
    {
      title: 'Pokój Deluxe',
      image: '/assets/room-deluxe-320.webp',
      detailImage: '/assets/room-deluxe-1200.webp',
      srcset: '/assets/room-deluxe-320.webp 320w, /assets/room-deluxe-640.webp 640w, /assets/room-deluxe-1200.webp 1200w',
      description: 'Elegancki pokój z miękkim światłem, dużym łóżkiem i spokojną atmosferą idealną na krótki wypoczynek.'
    },
    {
      title: 'Apartament z widokiem na jezioro',
      image: '/assets/room-lake-suite-320.webp',
      detailImage: '/assets/room-lake-suite-1200.webp',
      srcset: '/assets/room-lake-suite-320.webp 320w, /assets/room-lake-suite-640.webp 640w, /assets/room-lake-suite-1200.webp 1200w',
      description: 'Przestronny apartament z częścią wypoczynkową i panoramicznym widokiem na wodę oraz otaczającą naturę.'
    },
    {
      title: 'Pokój rodzinny',
      image: '/assets/room-family-320.webp',
      detailImage: '/assets/room-family-1200.webp',
      srcset: '/assets/room-family-320.webp 320w, /assets/room-family-640.webp 640w, /assets/room-family-1200.webp 1200w',
      description: 'Komfortowy pokój dla rodziny, zaprojektowany z myślą o wygodzie, przestrzeni i wspólnym odpoczynku.'
    },
    {
      title: 'Apartament Premium z wanną',
      image: '/assets/room-premium-bath-320.webp',
      detailImage: '/assets/room-premium-bath-1200.webp',
      srcset: '/assets/room-premium-bath-320.webp 320w, /assets/room-premium-bath-640.webp 640w, /assets/room-premium-bath-1200.webp 1200w',
      description: 'Najbardziej luksusowa propozycja z elegancką łazienką, wanną i detalami klasy premium.'
    }
  ];
  availabilitySearch = {
    check_in: '',
    check_out: ''
  };

  newBooking = {
    room_id: null as number | null,
    customer_name: '',
    check_in: '',
    check_out: '',
    total_price: 0
  };
  contactForm = new FormGroup({
    fullName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(255)]
    }),
    phone: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(30),
        Validators.pattern(/^\+?[0-9\s-]{9,30}$/)
      ]
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    }),
    message: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(1000)]
    })
  });

  constructor(
    private roomService: RoomService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.addHeroPreload();
    this.startHeroSlider();
    this.deferRemainingHeroSlides();

    this.roomService.getRooms().subscribe({
      next: (data: any) => {
        this.rooms = data;
        this.isRoomsLoading = false;
      },
      error: (err: any) => {
        this.isRoomsLoading = false;
        console.error('Błąd połączenia:', err);
      }
    });
  }

  ngAfterViewInit(): void {
    this.startAutoScroll();
  }

  ngOnDestroy(): void {
    this.stopAutoScroll();
    this.stopHeroSlider();
    this.removeHeroPreload();

    if (this.reviewScrollFrame !== null) {
      window.cancelAnimationFrame(this.reviewScrollFrame);
    }
  }

  getImageUrl(room: any): string {
    return this.getPremiumRoomImage(room);
  }

  startHeroSlider(): void {
    this.stopHeroSlider();
    this.heroInterval = setInterval(() => {
      const nextIndex = (this.currentHeroIndex + 1) % this.heroSlides.length;
      this.loadedHeroSlides.add(nextIndex);
      this.currentHeroIndex = nextIndex;
    }, 4500);
  }

  stopHeroSlider(): void {
    if (this.heroInterval) {
      clearInterval(this.heroInterval);
    }
  }

  setHeroSlide(index: number): void {
    this.loadedHeroSlides.add(index);
    this.currentHeroIndex = index;
    this.startHeroSlider();
  }

  shouldRenderHeroSlide(index: number): boolean {
    return this.loadedHeroSlides.has(index);
  }

  scrollToRooms(): void {
    document.getElementById('rooms')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  getRoomVisual(room: any): any {
    const source = Number(room?.id) || this.rooms.findIndex((item) => item === room) + 1 || 1;
    const index = Math.abs(source - 1) % this.roomVisuals.length;
    return this.roomVisuals[index];
  }

  getPremiumRoomImage(room: any): string {
    if (room?.main_image_url) {
      return this.normalizeRoomImageUrl(String(room.main_image_url));
    }

    if (room?.main_image) {
      return this.normalizeRoomImageUrl(String(room.main_image));
    }

    return this.getRoomVisual(room).image;
  }

  getRoomCardImageUrl(room: any): string {
    if (room?.main_image_thumb_url) {
      return this.normalizeRoomImageUrl(String(room.main_image_thumb_url));
    }

    return this.getImageUrl(room);
  }

  getRoomDetailImageUrl(room: any): string {
    if (room?.main_image_detail_url) {
      return this.normalizeRoomImageUrl(String(room.main_image_detail_url));
    }

    return this.getRoomVisual(room).detailImage || this.getImageUrl(room);
  }

  getRoomImageSrcset(room: any): string | null {
    if (room?.main_image_srcset) {
      return String(room.main_image_srcset);
    }

    if (room?.main_image_thumb_url && room?.main_image_detail_url) {
      return `${this.normalizeRoomImageUrl(String(room.main_image_thumb_url))} 320w, ${this.normalizeRoomImageUrl(String(room.main_image_card_url || room.main_image_thumb_url))} 640w, ${this.normalizeRoomImageUrl(String(room.main_image_detail_url))} 1200w`;
    }

    return this.getRoomVisual(room).srcset || null;
  }

  private normalizeRoomImageUrl(imagePath: string): string {
    if (/^https?:\/\//i.test(imagePath)) {
      try {
        const url = new URL(imagePath);

        if (url.pathname.startsWith('/storage/')) {
          return `${environment.storageUrl}/${url.pathname.replace(/^\/storage\//, '')}`;
        }
      } catch {
        return imagePath;
      }

      return imagePath;
    }

    return `${environment.storageUrl}/${imagePath.replace(/^\/?storage\//, '')}`;
  }

  private async showAlert(options: any): Promise<void> {
    const form = this.bookingFormElement?.nativeElement;
    const activeElement = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const focusReturnTarget = activeElement && form?.contains(activeElement)
      ? activeElement
      : form?.querySelector<HTMLElement>('input:not([disabled]), button:not([disabled])') ?? null;
    const Swal = await import('sweetalert2');
    await Swal.default.fire({
      ...options,
      target: document.body,
      focusConfirm: true,
      returnFocus: false
    });

    if (this.selectedRoom && focusReturnTarget?.isConnected) {
      window.requestAnimationFrame(() => focusReturnTarget.focus());
    }
  }

  private deferRemainingHeroSlides(): void {
    const loadSlides = () => {
      this.heroSlides.forEach((_, index) => this.loadedHeroSlides.add(index));
    };

    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(loadSlides, { timeout: 2500 });
      return;
    }

    globalThis.setTimeout(loadSlides, 1800);
  }

  private addHeroPreload(): void {
    if (this.heroPreloadLink) {
      return;
    }

    const link = this.document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = '/assets/hero-hotel-lake-1920.avif';
    link.type = 'image/avif';
    link.setAttribute('imagesrcset', '/assets/hero-hotel-lake-768.avif 768w, /assets/hero-hotel-lake-1280.avif 1280w, /assets/hero-hotel-lake-1920.avif 1920w');
    link.setAttribute('imagesizes', '100vw');
    link.setAttribute('fetchpriority', 'high');

    this.document.head.appendChild(link);
    this.heroPreloadLink = link;
  }

  private removeHeroPreload(): void {
    this.heroPreloadLink?.remove();
    this.heroPreloadLink = null;
  }

  getRoomTitle(room: any): string {
    return room?.name || this.getRoomVisual(room).title;
  }

  getRoomDescription(room: any): string {
    return room?.description || this.getRoomVisual(room).description;
  }

  startAutoScroll(): void {
    this.stopAutoScroll();
    this.scrollInterval = setInterval(() => {
      this.moveNext();
    }, 5000);
  }

  stopAutoScroll(): void {
    if (this.scrollInterval) {
      clearInterval(this.scrollInterval);
    }
  }

  moveNext(): void {
    this.scheduleReviewScroll(1);
  }

  movePrev(): void {
    this.scheduleReviewScroll(-1);
  }

  private scheduleReviewScroll(direction: 1 | -1): void {
    if (!this.slider || this.reviewScrollFrame !== null) return;

    this.reviewScrollFrame = window.requestAnimationFrame(() => {
      const el = this.slider.nativeElement as HTMLElement;
      const item = el.querySelector<HTMLElement>('.review-item');

      if (!item) {
        this.reviewScrollFrame = null;
        return;
      }

      // Wszystkie odczyty geometrii wykonujemy przed operacją przewijania.
      const itemWidth = item.offsetWidth + 24;
      const scrollLeft = el.scrollLeft;
      const viewportWidth = el.clientWidth;
      const scrollWidth = el.scrollWidth;
      const reachedEnd = scrollLeft + viewportWidth >= scrollWidth - 10;

      if (direction === 1 && reachedEnd) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: direction * itemWidth, behavior: 'smooth' });
      }

      this.reviewScrollFrame = null;
    });
  }

  getToday(): string {
    return new Date().toISOString().split('T')[0];
  }

  searchAvailableRooms(): void {
    if (this.isSearchingRooms) {
      return;
    }

    if (!this.availabilitySearch.check_in || !this.availabilitySearch.check_out) {
      void this.showAlert({
        title: 'Wybierz daty',
        text: 'Podaj datę przyjazdu i datę wyjazdu.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#0d6efd',
        background: 'rgba(255,255,255,0.96)',
        backdrop: 'rgba(15,23,42,0.55)',
        customClass: {
          popup: 'rounded-4 shadow-lg',
          confirmButton: 'px-4 py-2 fw-bold'
        }
      });
      return;
    }

    if (new Date(this.availabilitySearch.check_out) <= new Date(this.availabilitySearch.check_in)) {
      void this.showAlert({
        title: 'Niepoprawny zakres dat',
        text: 'Data wyjazdu musi być późniejsza niż data przyjazdu.',
        icon: 'error',
        confirmButtonText: 'Rozumiem',
        confirmButtonColor: '#dc3545',
        background: 'rgba(255,255,255,0.96)',
        backdrop: 'rgba(15,23,42,0.55)',
        customClass: {
          popup: 'rounded-4 shadow-lg',
          confirmButton: 'px-4 py-2 fw-bold'
        }
      });
      return;
    }

    this.isSearchingRooms = true;

    this.roomService.searchAvailableRooms(this.availabilitySearch.check_in, this.availabilitySearch.check_out).subscribe({
      next: (data: any) => {
        this.rooms = data;
        this.selectedRoom = null;
        this.isSearchingRooms = false;
      },
      error: (err: any) => {
        this.isSearchingRooms = false;
        void this.showAlert({
          title: 'Nie udało się wyszukać pokoi',
          text: err.error?.message || 'Spróbuj ponownie za chwilę.',
          icon: 'error',
          confirmButtonText: 'Rozumiem',
          confirmButtonColor: '#dc3545',
          background: 'rgba(255,255,255,0.96)',
          backdrop: 'rgba(15,23,42,0.55)',
          customClass: {
            popup: 'rounded-4 shadow-lg',
            confirmButton: 'px-4 py-2 fw-bold'
          }
        });
      }
    });
  }

  resetRoomSearch(): void {
    this.availabilitySearch.check_in = '';
    this.availabilitySearch.check_out = '';
    this.selectedRoom = null;
    this.isRoomsLoading = true;
    this.roomService.getRooms().subscribe({
      next: (data: any) => {
        this.rooms = data;
        this.isRoomsLoading = false;
      },
      error: (err: any) => {
        this.isRoomsLoading = false;
        console.error('Błąd połączenia:', err);
      }
    });
  }

  selectRoom(room: any): void {
    this.bookingFormSubmitted = false;
    this.bookingFormError = '';
    this.bookingFieldErrors = {};
    this.selectedRoom = room;
    this.newBooking.room_id = room.id;
    this.newBooking.check_in = '';
    this.newBooking.check_out = '';
    this.newBooking.total_price = 0;
    this.occupiedDates = []; 

    const savedName = localStorage.getItem('user_name');
    if (savedName) {
      this.newBooking.customer_name = savedName;
    }

    this.roomService.getRoomAvailability(room.id).subscribe({
      next: (data: any) => this.occupiedDates = data,
      error: () => {
        this.bookingFormError = 'Nie udało się pobrać zajętych terminów. Dostępność zostanie ponownie sprawdzona przy zapisie rezerwacji.';
      }
    });
  }

  closeRoomModal(): void {
    this.selectedRoom = null;
  }

  submitContactForm(): void {
    if (this.contactForm.invalid || this.isContactSending) {
      this.contactForm.markAllAsTouched();
      this.contactFormError = 'Nie udało się wysłać formularza. Sprawdź zaznaczone pola.';
      this.focusFirstInvalid('.lux-contact-card');
      return;
    }

    const formValue = this.contactForm.getRawValue();
    this.isContactSending = true;

    this.roomService.submitContactMessage({
      name: formValue.fullName,
      email: formValue.email,
      phone: formValue.phone || null,
      message: formValue.message
    }).subscribe({
      next: () => {
        this.isContactSending = false;
        void this.showAlert({
          title: 'Wiadomość wysłana',
          text: 'Dziękujemy! Twoje zapytanie zostało wysłane. Skontaktujemy się z Tobą najszybciej, jak to możliwe.',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#0dcaf0',
          background: 'rgba(255,255,255,0.98)',
          backdrop: 'rgba(15,23,42,0.45)',
          customClass: {
            popup: 'rounded-4 shadow-lg',
            confirmButton: 'px-4 py-2 fw-bold'
          }
        });

        this.contactForm.reset();
        this.contactFormError = '';
        this.contactFieldErrors = {};
      },
      error: (err: any) => {
        this.isContactSending = false;
        if (err.status === 422 && err.error?.errors) {
          const fieldMap: Record<string, string> = { name: 'fullName', email: 'email', phone: 'phone', message: 'message' };
          this.contactFieldErrors = Object.fromEntries(Object.entries(err.error.errors).map(([field, messages]) => [fieldMap[field] || field, Array.isArray(messages) ? String(messages[0]) : String(messages)]));
          this.contactFormError = 'Nie udało się wysłać formularza. Sprawdź zaznaczone pola.';
          this.focusFirstInvalid('.lux-contact-card');
          return;
        }
        void this.showAlert({
          title: 'Nie udało się wysłać formularza',
          text: 'Nie udało się wysłać formularza. Spróbuj ponownie lub skontaktuj się z nami telefonicznie.',
          icon: 'error',
          confirmButtonText: 'Rozumiem',
          confirmButtonColor: '#dc3545',
          background: 'rgba(255,255,255,0.98)',
          backdrop: 'rgba(15,23,42,0.45)',
          customClass: {
            popup: 'rounded-4 shadow-lg',
            confirmButton: 'px-4 py-2 fw-bold'
          }
        });
      }
    });
  }

  getRoomAmenities(room: any): string[] {
    if (Array.isArray(room.amenities)) {
      return room.amenities;
    }

    if (typeof room.amenities === 'string' && room.amenities.trim()) {
      return room.amenities.split(',').map((amenity: string) => amenity.trim()).filter(Boolean);
    }

    return ['Klimatyzacja', 'Wi-Fi', 'Łazienka prywatna', 'TV', 'Śniadanie w cenie'];
  }

  calculateTotalPrice(): void {
    if (this.newBooking.check_in && this.newBooking.check_out && this.selectedRoom) {
      const start = new Date(this.newBooking.check_in);
      const end = new Date(this.newBooking.check_out);
      
      if (end <= start) {
        this.newBooking.total_price = 0;
        return;
      }

      const hasCollision = this.occupiedDates.some(booking => this.datesOverlap(start, end, booking));

      if (hasCollision) {
        this.newBooking.total_price = 0;
        return;
      }

      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const cenaZaNoc = this.selectedRoom.price_per_night || this.selectedRoom.price || 0;

      this.newBooking.total_price = diffDays * cenaZaNoc;
    }
  }

  hasValidAuthToken(): boolean {
    const token = localStorage.getItem('auth_token');
    const normalizedToken = typeof token === 'string' ? token.trim() : '';

    return normalizedToken.length > 0 && normalizedToken !== 'undefined' && normalizedToken !== 'null';
  }

  async showLoginRequiredDialog(): Promise<void> {
    const Swal = await import('sweetalert2');
    const result = await Swal.default.fire({
      title: 'Logowanie wymagane',
      text: 'Aby dokonać rezerwacji, musisz założyć konto lub zalogować się.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Zaloguj się',
      cancelButtonText: 'Anuluj',
      confirmButtonColor: '#0d6efd',
      cancelButtonColor: '#6c757d',
      background: 'rgba(255,255,255,0.96)',
      backdrop: 'rgba(15,23,42,0.55)',
      customClass: {
        popup: 'rounded-4 shadow-lg',
        confirmButton: 'px-4 py-2 fw-bold',
        cancelButton: 'px-4 py-2 fw-bold'
      }
    });

    if (result.isConfirmed) {
      this.closeRoomModal();
      this.router.navigate(['/login']);
    }
  }

  clearContactFieldError(field: string): void {
    delete this.contactFieldErrors[field];
    this.contactFormError = '';
  }

  confirmBooking(form: NgForm): void {
    this.bookingFormSubmitted = true;
    form.form.markAllAsTouched();
    this.bookingFormError = '';

    if (this.isBookingSaving) {
      return;
    }

    if (!this.hasValidAuthToken()) {
      this.showLoginRequiredDialog();
      return;
    }

    if (form.invalid || this.invalidBookingDateRange) {
      this.bookingFormError = 'Nie udało się zapisać rezerwacji. Sprawdź pola formularza.';
      this.focusFirstInvalid('.reservation-panel');
      return;
    }

    if (this.newBooking.total_price <= 0) {
      void this.showAlert({
        title: 'Niepoprawny termin',
        text: 'Ten termin jest już zajęty lub dane są niepoprawne. Wybierz inne daty.',
        icon: 'error',
        confirmButtonText: 'Rozumiem',
        confirmButtonColor: '#dc3545',
        background: 'rgba(255,255,255,0.96)',
        backdrop: 'rgba(15,23,42,0.55)',
        customClass: {
          popup: 'rounded-4 shadow-lg',
          confirmButton: 'px-4 py-2 fw-bold'
        }
      });
      return;
    }

    this.isBookingSaving = true;

    this.roomService.saveBooking(this.newBooking).subscribe({
      next: (res: any) => {
        this.isBookingSaving = false;
        void this.showAlert({
          title: 'Rezerwacja zapisana',
          text: 'Twoja rezerwacja została przyjęta.',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#198754',
          background: 'rgba(255,255,255,0.96)',
          backdrop: 'rgba(15,23,42,0.55)',
          customClass: {
            popup: 'rounded-4 shadow-lg',
            confirmButton: 'px-4 py-2 fw-bold'
          }
        });
        this.closeRoomModal();
      },
      error: (err: any) => {
        this.isBookingSaving = false;
        if (err.status === 401 || err.status === 403) {
          this.showLoginRequiredDialog();
          return;
        }

        if (err.status === 422 && err.error?.errors) {
          this.bookingFieldErrors = Object.fromEntries(Object.entries(err.error.errors).map(([field, messages]) => [field, Array.isArray(messages) ? String(messages[0]) : String(messages)]));
          this.bookingFormError = 'Nie udało się zapisać rezerwacji. Sprawdź pola formularza.';
          this.focusFirstInvalid('.reservation-panel');
          return;
        }

        if (err.status === 422) {
          this.bookingFormError = 'Wybrany pokój nie jest dostępny w tym terminie.';
          return;
        }

        void this.showAlert({
          title: 'Błąd zapisu',
          text: err.error?.message || 'Wystąpił błąd podczas zapisu.',
          icon: 'error',
          confirmButtonText: 'Rozumiem',
          confirmButtonColor: '#dc3545',
          background: 'rgba(255,255,255,0.96)',
          backdrop: 'rgba(15,23,42,0.55)',
          customClass: {
            popup: 'rounded-4 shadow-lg',
            confirmButton: 'px-4 py-2 fw-bold'
          }
        });
      }
    });
  }

  get invalidBookingDateRange(): boolean {
    return !!this.newBooking.check_in && !!this.newBooking.check_out && this.newBooking.check_out <= this.newBooking.check_in;
  }

  get selectedDatesOverlap(): boolean {
    if (!this.newBooking.check_in || !this.newBooking.check_out || this.invalidBookingDateRange) {
      return false;
    }

    const start = new Date(this.newBooking.check_in);
    const end = new Date(this.newBooking.check_out);

    return this.occupiedDates.some(booking => this.datesOverlap(start, end, booking));
  }

  private datesOverlap(start: Date, end: Date, booking: any): boolean {
    const existingStart = new Date(booking.check_in);
    const existingEnd = new Date(booking.check_out);

    return start < existingEnd && end > existingStart;
  }

  clearBookingFieldError(field: string): void {
    delete this.bookingFieldErrors[field];
    this.bookingFormError = '';
  }

  private focusFirstInvalid(containerSelector: string): void {
    setTimeout(() => {
      const element = document.querySelector<HTMLElement>(`${containerSelector} .is-invalid, ${containerSelector} .ng-invalid`);
      element?.focus();
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }
}
