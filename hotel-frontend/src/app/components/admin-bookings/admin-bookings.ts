import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RoomService } from '../../services/room';
import { AuthService } from '../../services/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-bookings.html',
  styleUrl: './admin-bookings.css'
})
export class AdminBookings implements OnInit {
  bookings: any[] = [];
  filteredLastName = '';
  loading = false;
  updatingBookingId: number | null = null;
  isAuthorized = false;
  checkingAccess = true;

  constructor(
    private roomService: RoomService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.validateSession().subscribe({
      next: (user: any) => {
        if (user?.role !== 'admin') {
          this.router.navigate(['/']);
          return;
        }

        this.isAuthorized = true;
        this.checkingAccess = false;
        this.loadBookings();
      },
      error: () => {
        this.authService.clearSession();
        this.router.navigate(['/']);
      }
    });
  }

  loadBookings(): void {
    this.loading = true;

    this.roomService.getAdminBookings().subscribe({
      next: (data: any) => {
        this.bookings = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Błąd pobierania rezerwacji', err);
        this.loading = false;
      }
    });
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
}
