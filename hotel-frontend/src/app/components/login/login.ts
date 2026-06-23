import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  credentials = { email: '', password: '' };
  isLoggingIn = false;
  loginSubmitted = false;
  loginError = '';
  fieldErrors: Record<string, string> = {};

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin(form: NgForm) {
    this.loginSubmitted = true;
    form.form.markAllAsTouched();
    this.loginError = '';
    this.fieldErrors = {};

    if (form.invalid) {
      this.loginError = 'Sprawdź pola formularza.';
      this.focusFirstInvalid();
      return;
    }

    if (this.isLoggingIn) {
      return;
    }

    this.isLoggingIn = true;

    this.authService.login(this.credentials).subscribe({
      next: (response: any) => {
        this.isLoggingIn = false;
        if (response.user && response.user.name) {
          localStorage.setItem('user_name', response.user.name);
        }

        Swal.fire({
          title: 'Zalogowano pomyślnie',
          text: 'Witaj ponownie w Hotel Lux.',
          icon: 'success',
          confirmButtonText: 'Przejdź dalej',
          confirmButtonColor: '#198754',
          background: 'rgba(255,255,255,0.96)',
          backdrop: 'rgba(15,23,42,0.55)',
          customClass: {
            popup: 'rounded-4 shadow-lg',
            confirmButton: 'px-4 py-2 fw-bold'
          }
        }).then(() => this.router.navigate(['/']));
      },
      error: (err) => {
        this.isLoggingIn = false;
        if (err.status === 422 && err.error?.errors) {
          this.fieldErrors = this.firstBackendErrors(err.error.errors);
          this.loginError = 'Sprawdź pola formularza.';
          this.focusFirstInvalid();
          return;
        }
        this.loginError = err.status === 401
          ? 'Nieprawidłowy adres e-mail lub hasło.'
          : 'Nie udało się zalogować. Spróbuj ponownie.';
      }
    });
  }

  clearFieldError(field: string): void {
    delete this.fieldErrors[field];
    this.loginError = '';
  }

  private firstBackendErrors(errors: Record<string, string[]>): Record<string, string> {
    return Object.fromEntries(Object.entries(errors).map(([key, value]) => [key, value[0]]));
  }

  private focusFirstInvalid(): void {
    setTimeout(() => document.querySelector<HTMLElement>('.login-form .is-invalid, .login-form .ng-invalid')?.focus());
  }
}
