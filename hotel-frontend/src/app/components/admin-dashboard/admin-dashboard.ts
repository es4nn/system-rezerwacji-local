import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RoomService } from '../../services/room';
import { AuthService } from '../../services/auth';
import Swal from 'sweetalert2';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { environment } from '../../../environments/environment';

type AdminTab = 'rooms' | 'reservations';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, BaseChartDirective],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {
  @ViewChild('roomFormSection') roomFormSection?: ElementRef<HTMLElement>;
  @ViewChild('roomEditorForm') roomEditorForm?: NgForm;

  activeTab: AdminTab = 'rooms';
  rooms: any[] = [];
  bookings: any[] = [];
  filteredLastName = '';
  editingRoom: any = null;
  roomForm = this.createEmptyRoomForm();
  selectedRoomImageFile: File | null = null;
  roomImagePreviewUrl = '';
  roomFormSubmitted = false;
  roomFieldErrors: Record<string, string> = {};
  roomFormError = '';
  isRoomPreviewOpen = false;
  isAuthorized = false;
  isLoading = true;
  roomsLoading = false;
  bookingsLoading = false;
  isRoomSaving = false;
  isRoomUpdating = false;
  deletingRoomId: number | null = null;
  updatingBookingId: number | null = null;
  statsLoading = false;
  monthlyRevenueTotal = 0;
  monthlyBookingsTotal = 0;
  selectedStatsYear = 2026;
  availableStatsYears: number[] = [2026, 2025];
  revenueChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Przychód z rezerwacji',
        yAxisID: 'revenue',
        backgroundColor: 'rgba(13, 110, 253, 0.72)',
        borderColor: '#0d6efd',
        borderWidth: 1,
        borderRadius: 8,
        hoverBackgroundColor: 'rgba(13, 202, 240, 0.82)'
      },
      {
        data: [],
        label: 'Liczba rezerwacji',
        yAxisID: 'bookings',
        backgroundColor: 'rgba(25, 135, 84, 0.68)',
        borderColor: '#198754',
        borderWidth: 1,
        borderRadius: 8,
        hoverBackgroundColor: 'rgba(25, 135, 84, 0.9)'
      }
    ]
  };
  revenueChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          usePointStyle: true,
          boxWidth: 8
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            if (context.dataset.yAxisID === 'bookings') {
              return `${context.dataset.label}: ${context.parsed.y}`;
            }

            return `${context.dataset.label}: ${context.parsed.y} PLN`;
          }
        }
      }
    },
    scales: {
      revenue: {
        type: 'linear',
        position: 'left',
        beginAtZero: true,
        ticks: {
          callback: (value) => `${value} PLN`
        }
      },
      bookings: {
        type: 'linear',
        position: 'right',
        beginAtZero: true,
        grid: {
          drawOnChartArea: false
        },
        ticks: {
          precision: 0
        }
      }
    }
  };

  constructor(
    private roomService: RoomService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.activeTab = this.router.url.includes('rezerwacje') ? 'reservations' : 'rooms';

    this.authService.validateSession().subscribe({
      next: (user: any) => {
        if (user?.role !== 'admin') {
          this.router.navigate(['/']);
          return;
        }

        this.isAuthorized = true;
        this.isLoading = false;
        this.loadRooms();
        this.loadStats();

        if (this.activeTab === 'reservations') {
          this.loadBookings();
        }
      },
      error: () => {
        this.authService.clearSession();
        this.router.navigate(['/']);
      }
    });
  }

  setActiveTab(tab: AdminTab): void {
    this.activeTab = tab;

    if (tab === 'reservations' && this.bookings.length === 0) {
      this.loadBookings();
    }
  }

  loadRooms(): void {
    this.roomsLoading = true;

    this.roomService.getRooms().subscribe({
      next: (data: any) => {
        this.rooms = data;
        this.roomsLoading = false;
      },
      error: (err: any) => {
        console.error('Błąd pobierania pokoi', err);
        this.roomsLoading = false;
      }
    });
  }

  loadBookings(): void {
    this.bookingsLoading = true;

    this.roomService.getAdminBookings().subscribe({
      next: (data: any) => {
        this.bookings = data;
        this.bookingsLoading = false;
      },
      error: (err: any) => {
        console.error('Błąd pobierania rezerwacji', err);
        this.bookingsLoading = false;
      }
    });
  }

  loadStats(): void {
    this.statsLoading = true;

    this.roomService.getAdminStats(this.selectedStatsYear).subscribe({
      next: (data: any) => {
        const revenue = data.revenue || [];
        const bookingCounts = data.booking_counts || [];
        this.selectedStatsYear = data.year || this.selectedStatsYear;
        this.availableStatsYears = data.years?.length ? data.years : this.availableStatsYears;
        this.monthlyRevenueTotal = revenue.reduce((sum: number, value: number) => sum + Number(value), 0);
        this.monthlyBookingsTotal = bookingCounts.reduce((sum: number, value: number) => sum + Number(value), 0);
        this.revenueChartData = {
          labels: data.labels || [],
          datasets: [
            {
              ...this.revenueChartData.datasets[0],
              data: revenue
            },
            {
              ...this.revenueChartData.datasets[1],
              data: bookingCounts
            }
          ]
        };
        this.statsLoading = false;
      },
      error: (err: any) => {
        console.error('Błąd pobierania statystyk', err);
        this.statsLoading = false;
      }
    });
  }

  changeStatsYear(year: string): void {
    this.selectedStatsYear = Number(year);
    this.loadStats();
  }

  get filteredBookings(): any[] {
    const phrase = this.filteredLastName.trim().toLowerCase();

    if (!phrase) {
      return this.bookings;
    }

    return this.bookings.filter((booking: any) => {
      const parts = String(booking.customer_name || '').trim().toLowerCase().split(/\s+/);
      const lastName = parts.length > 1 ? parts[parts.length - 1] : parts[0] || '';
      return lastName.includes(phrase);
    });
  }

  addRoom(): void {
    this.resetRoomValidation();
    this.closeRoomPreview();
    this.editingRoom = null;
    this.roomForm = this.createEmptyRoomForm();
    this.clearImagePreview();
    this.scrollToRoomForm();
  }

  editRoom(room: any): void {
    this.resetRoomValidation();
    this.closeRoomPreview();
    this.editingRoom = { ...room };
    this.roomForm = {
      name: room.name || `Pokój ${room.room_number || ''}`.trim(),
      room_number: room.room_number || '',
      capacity: Number(room.capacity || 1),
      price_per_night: Number(room.price_per_night || 0),
      description: room.description || '',
      main_image: room.main_image || ''
    };
    this.selectedRoomImageFile = null;
    this.roomImagePreviewUrl = '';
    this.scrollToRoomForm();
  }

  cancelEdit(): void {
    this.closeRoomPreview();
    this.editingRoom = null;
    this.roomForm = this.createEmptyRoomForm();
    this.clearImagePreview();
    this.resetRoomValidation();
  }

  onRoomImageSelected(event: Event): void {
    this.clearRoomFieldError('main_image');
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    this.selectedRoomImageFile = file;

    if (!file) {
      this.roomImagePreviewUrl = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.roomImagePreviewUrl = String(reader.result || '');
    };
    reader.readAsDataURL(file);
  }

  saveRoom(event: Event, form: NgForm): void {
    event.preventDefault();
    if (!this.validateRoomForm(form)) {
      return;
    }
    if (this.isRoomSaving) {
      return;
    }

    this.isRoomSaving = true;

    this.roomService.addRoom(this.buildRoomFormData()).subscribe({
      next: () => {
        this.isRoomSaving = false;
        Swal.fire({
          title: 'Pokój dodany',
          text: 'Nowy pokój jest już dostępny w systemie.',
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
        this.cancelEdit();
        this.loadRooms();
      },
      error: (err: any) => {
        this.isRoomSaving = false;
        this.handleRoomSaveError(err);
      }
    });
  }

  saveEditedRoom(event: Event, form: NgForm): void {
    event.preventDefault();
    if (!this.validateRoomForm(form)) {
      return;
    }
    if (this.isRoomUpdating || !this.editingRoom) {
      return;
    }

    this.isRoomUpdating = true;

    this.roomService.updateRoom(this.editingRoom.id, this.buildRoomFormData()).subscribe({
      next: () => {
        this.isRoomUpdating = false;
        Swal.fire({
          title: 'Pokój zaktualizowany',
          text: 'Zmiany zostały zapisane.',
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
        this.cancelEdit();
        this.loadRooms();
      },
      error: (err: any) => {
        this.isRoomUpdating = false;
        this.handleRoomSaveError(err);
      }
    });
  }

  deleteRoom(id: number): void {
    if (this.deletingRoomId) {
      return;
    }

    Swal.fire({
      title: 'Usunąć pokój?',
      text: 'Pokój zostanie trwale usunięty z systemu.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Tak, usuń',
      cancelButtonText: 'Anuluj',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      background: 'rgba(255,255,255,0.96)',
      backdrop: 'rgba(15,23,42,0.55)',
      customClass: {
        popup: 'rounded-4 shadow-lg',
        confirmButton: 'px-4 py-2 fw-bold',
        cancelButton: 'px-4 py-2 fw-bold'
      }
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.deletingRoomId = id;

      this.roomService.deleteRoomFromDb(id).subscribe({
        next: () => {
          this.deletingRoomId = null;
          Swal.fire({
            title: 'Pokój usunięty',
            text: 'Lista pokoi została odświeżona.',
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
          this.loadRooms();
        },
        error: (err: any) => {
          this.deletingRoomId = null;
          console.error('Pełny błąd:', err);
          this.showRoomError('Nie udało się usunąć pokoju', err);
        }
      });
    });
  }

  updateStatus(booking: any, status: string): void {
    if (booking.status === status) {
      return;
    }

    const previousStatus = booking.status;
    booking.status = status;
    this.updatingBookingId = booking.id;

    this.roomService.updateBookingStatus(booking.id, status).subscribe({
      next: (response: any) => {
        const index = this.bookings.findIndex((item: any) => item.id === booking.id);

        if (index !== -1) {
          this.bookings[index] = response.booking;
        }

        Swal.fire({
          title: 'Status zaktualizowany',
          text: 'Status rezerwacji został zapisany.',
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
        this.updatingBookingId = null;
      },
      error: (err: any) => {
        console.error('Błąd aktualizacji statusu', err);
        booking.status = previousStatus;
        this.updatingBookingId = null;
        Swal.fire({
          title: 'Nie udało się zmienić statusu',
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

  getStatusLabel(status: string): string {
    switch (status) {
      case 'confirmed':
        return 'Potwierdzona';
      case 'cancelled':
        return 'Anulowana';
      default:
        return 'Aktywna';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'confirmed':
        return 'bg-success';
      case 'cancelled':
        return 'bg-secondary';
      default:
        return 'bg-info text-dark';
    }
  }

  getRoomImageUrl(room: any): string {
    if (this.roomImagePreviewUrl) {
      return this.roomImagePreviewUrl;
    }

    if (room?.main_image_url) {
      return this.normalizeRoomImageUrl(String(room.main_image_url));
    }

    if (room?.main_image) {
      return this.normalizeRoomImageUrl(String(room.main_image));
    }

    return 'https://placehold.co/400x250/eeeeee/999999?text=Brak+Zdjecia';
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

  get previewRoom(): any {
    return {
      ...this.editingRoom,
      ...this.roomForm,
      name: this.roomForm.name || 'Nazwa pokoju',
      room_number: this.roomForm.room_number || '---',
      capacity: this.roomForm.capacity || 1,
      price_per_night: this.roomForm.price_per_night || 0,
      description: this.roomForm.description || 'Opis pokoju pojawi się tutaj podczas uzupełniania formularza.'
    };
  }

  private createEmptyRoomForm(): any {
    return {
      name: '',
      room_number: '',
      capacity: 2,
      price_per_night: 0,
      description: '',
      main_image: ''
    };
  }

  private buildRoomFormData(): FormData {
    const formData = new FormData();
    formData.append('name', this.roomForm.name.trim());
    formData.append('room_number', this.roomForm.room_number);
    formData.append('capacity', String(this.roomForm.capacity));
    formData.append('price_per_night', String(this.roomForm.price_per_night));
    formData.append('description', this.roomForm.description || '');

    if (this.selectedRoomImageFile) {
      formData.append('main_image', this.selectedRoomImageFile);
    }

    return formData;
  }

  openRoomPreview(): void {
    this.isRoomPreviewOpen = true;
  }

  closeRoomPreview(): void {
    this.isRoomPreviewOpen = false;
  }

  clearRoomFieldError(field: string): void {
    delete this.roomFieldErrors[field];
    this.roomFormError = '';
  }

  private validateRoomForm(form: NgForm): boolean {
    this.roomFormSubmitted = true;
    form.form.markAllAsTouched();
    this.roomFormError = '';

    if (form.valid) {
      return true;
    }

    this.roomFormError = 'Nie udało się zapisać danych. Sprawdź pola formularza.';
    this.focusFirstInvalid(form);
    return false;
  }

  private handleRoomSaveError(err: any): void {
    if (err.status === 422 && err.error?.errors) {
      this.roomFieldErrors = Object.fromEntries(
        Object.entries(err.error.errors).map(([field, messages]) => [
          field,
          Array.isArray(messages) ? String(messages[0]) : String(messages)
        ])
      );
      this.roomFormError = 'Nie udało się zapisać danych. Sprawdź pola formularza.';
      this.focusFirstInvalid(this.roomEditorForm);
      return;
    }

    this.roomFormError = 'Nie udało się zapisać danych. Spróbuj ponownie.';
  }

  private focusFirstInvalid(form?: NgForm): void {
    setTimeout(() => {
      const element = this.roomFormSection?.nativeElement.querySelector<HTMLElement>(
        '.is-invalid, .form-control.ng-invalid, [aria-invalid="true"]'
      );
      element?.focus();
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  private resetRoomValidation(): void {
    this.roomFormSubmitted = false;
    this.roomFieldErrors = {};
    this.roomFormError = '';
  }

  private clearImagePreview(): void {
    this.selectedRoomImageFile = null;
    this.roomImagePreviewUrl = '';
  }

  private scrollToRoomForm(): void {
    setTimeout(() => {
      this.roomFormSection?.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
  }

  private showRoomError(title: string, err: any): void {
    Swal.fire({
      title,
      text: err.error?.message || err.message || 'Nieznany błąd serwera',
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
}
