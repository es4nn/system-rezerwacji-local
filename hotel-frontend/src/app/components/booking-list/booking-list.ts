import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RoomService } from '../../services/room';
import { AuthService } from '../../services/auth';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './booking-list.html',
  styleUrl: './booking-list.css' 
})
export class BookingList implements OnInit {
  bookings: any[] = [];
  isLoading = true;
  cancelingBookingId: number | null = null;
  selectedRoomDetails: any = null;
  readonly storageUrl = `${environment.storageUrl}/`;
  readonly fallbackRoomImageUrl = 'https://placehold.co/900x520/e9ecef/6c757d?text=Hotel+Lux';

  constructor(
    private roomService: RoomService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;

    if (this.authService.isLoggedIn()) {
      this.loadBookings();
    } else {
      this.isLoading = false;
    }
  }

  loadBookings() {
    this.isLoading = true;
    this.roomService.getMyBookings().subscribe({
      next: (data: any) => {
        this.bookings = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('Błąd pobierania rezerwacji', err);
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

  openRoomDetails(room: any): void {
    if (!room) {
      return;
    }

    this.selectedRoomDetails = room;
  }

  closeRoomDetails(): void {
    this.selectedRoomDetails = null;
  }

  getRoomImageUrl(room: any): string {
    if (room?.main_image_detail_url) {
      return this.normalizeRoomImageUrl(String(room.main_image_detail_url));
    }

    if (room?.main_image_url) {
      return this.normalizeRoomImageUrl(String(room.main_image_url));
    }

    if (room?.main_image) {
      return this.normalizeRoomImageUrl(String(room.main_image));
    }

    if (room?.image) {
      return this.normalizeRoomImageUrl(String(room.image));
    }

    return this.fallbackRoomImageUrl;
  }

  getRoomImageSrcset(room: any): string | null {
    if (room?.main_image_srcset) {
      return String(room.main_image_srcset);
    }

    if (room?.main_image_thumb_url && room?.main_image_detail_url) {
      return `${this.normalizeRoomImageUrl(String(room.main_image_thumb_url))} 600w, ${this.normalizeRoomImageUrl(String(room.main_image_detail_url))} 1200w`;
    }

    return null;
  }

  private normalizeRoomImageUrl(imagePath: string): string {
    if (/^https?:\/\//i.test(imagePath)) {
      try {
        const url = new URL(imagePath);

        if (url.pathname.startsWith('/storage/')) {
          return `${this.storageUrl}${url.pathname.replace(/^\/storage\//, '')}`;
        }
      } catch {
        return imagePath;
      }

      return imagePath;
    }

    return `${this.storageUrl}${imagePath.replace(/^\/?storage\//, '')}`;
  }

  getRoomAmenities(room: any): string[] {
    if (Array.isArray(room?.amenities)) {
      return room.amenities;
    }

    if (typeof room?.amenities === 'string' && room.amenities.trim()) {
      return room.amenities
        .split(',')
        .map((amenity: string) => amenity.trim())
        .filter((amenity: string) => amenity.length > 0);
    }

    return ['Wi-Fi', 'Prywatna łazienka', 'TV', 'Klimatyzacja'];
  }

  async downloadPDF(booking: any) {
    const jsPdfModule = await import('jspdf');
    const autoTableModule = await import('jspdf-autotable');
    const doc = new jsPdfModule.jsPDF();
    const autoTable = autoTableModule.default;
    const roomNumber = booking.room?.room_number || 'Brak danych';
    const customerName = booking.customer_name || this.authService.getUserName() || 'Gość Hotel Lux';
    const fileName = `hotel-lux-rezerwacja-${booking.id || roomNumber}.pdf`;

    doc.setFillColor(13, 110, 253);
    doc.rect(0, 0, 210, 36, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Hotel Lux', 14, 16);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Potwierdzenie rezerwacji', 14, 25);

    doc.setTextColor(33, 37, 41);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Szczegoly pobytu', 14, 50);

    autoTable(doc, {
      startY: 58,
      theme: 'grid',
      styles: {
        font: 'helvetica',
        fontSize: 11,
        cellPadding: 4,
        lineColor: [222, 226, 230],
        lineWidth: 0.2
      },
      headStyles: {
        fillColor: [13, 110, 253],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      body: [
        ['Klient', customerName],
        ['Numer pokoju', `Pokoj ${roomNumber}`],
        ['Data przyjazdu', booking.check_in],
        ['Data wyjazdu', booking.check_out],
        ['Status', this.getStatusLabel(booking.status)],
        ['Kwota calkowita', `${booking.total_price} PLN`]
      ],
      columns: [
        { header: 'Pole', dataKey: 'label' },
        { header: 'Wartosc', dataKey: 'value' }
      ]
    });

    const finalY = (doc as any).lastAutoTable.finalY + 18;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text('Dziekujemy za wybor Hotel Lux.', 14, finalY);
    doc.text('Recepcja jest dostepna 24/7.', 14, finalY + 8);

    doc.setDrawColor(13, 110, 253);
    doc.line(14, 280, 196, 280);
    doc.setFontSize(9);
    doc.setTextColor(110, 110, 110);
    doc.text('Hotel Lux | ul. Morska 15, Gdansk | kontakt@hotel-lux.pl', 14, 287);

    doc.save(fileName);
  }

  cancelBooking(id: number) {
    if (this.cancelingBookingId) {
      return;
    }

    Swal.fire({
      title: 'Czy na pewno chcesz anulować tę rezerwację?',
      text: 'Tej operacji nie będzie można łatwo cofnąć.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Tak, anuluj',
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

      this.cancelingBookingId = id;

      this.roomService.deleteBooking(id).subscribe({
        next: () => {
          this.cancelingBookingId = null;
          Swal.fire({
            title: 'Rezerwacja anulowana',
            text: 'Status rezerwacji został zaktualizowany.',
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
          this.loadBookings();
        },
        error: (err: any) => {
          this.cancelingBookingId = null;
          Swal.fire({
            title: 'Nie udało się anulować rezerwacji',
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
    });
  }
}
