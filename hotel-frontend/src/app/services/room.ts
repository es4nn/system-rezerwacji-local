import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // POBIERANIE WSZYSTKICH POKOI
  getRooms(): Observable<any> {
    return this.http.get(`${this.apiUrl}/rooms`);
  }

  searchAvailableRooms(checkIn: string, checkOut: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/rooms/search/available`, {
      params: {
        check_in: checkIn,
        check_out: checkOut
      }
    });
  }

  submitContactMessage(messageData: {
    name: string;
    email: string;
    phone?: string | null;
    message: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/contact`, messageData);
  }

  // DODAWANIE NOWEGO POKOJU
  addRoom(roomData: FormData): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${this.apiUrl}/rooms`, roomData, { headers });
  }

  // AKTUALIZACJA POKOJU (DODANA METODA)
  updateRoom(id: number, roomData: FormData): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    // Używamy POST, ponieważ przesyłamy FormData (zdjęcia)
    return this.http.post(`${this.apiUrl}/rooms/${id}`, roomData, { headers });
  }

  subscribeToNewsletter(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/newsletter`, { email });
  }

  // USUWANIE POKOJU
  deleteRoomFromDb(id: number): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}/rooms/${id}`, { headers });
  }

  // ZAPIS REZERWACJI
  saveBooking(bookingData: any): Observable<any> {
    const token = localStorage.getItem('auth_token');
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/bookings`, bookingData, { headers });
  }

  // POBIERANIE MOICH REZERWACJI
  getMyBookings(): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/bookings`, { headers });
  }

  getAdminBookings(): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/admin/bookings`, { headers });
  }

  updateBookingStatus(id: number, status: string): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch(`${this.apiUrl}/admin/bookings/${id}/status`, { status }, { headers });
  }

  getAdminStats(year?: number): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options: any = { headers };

    if (year) {
      options.params = { year };
    }

    return this.http.get(`${this.apiUrl}/admin/stats`, options);
  }

  // ANULOWANIE REZERWACJI
  deleteBooking(id: number): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}/bookings/${id}`, { headers });
  }

  // POBIERANIE DOSTĘPNOŚCI POKOJU (DATY)
  getRoomAvailability(roomId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/rooms/${roomId}/availability`);
  }  
}
