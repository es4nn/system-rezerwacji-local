import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  isRegistering = false;
  registerError = '';
  fieldErrors: Record<string, string> = {};
  registerForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)]
    }),
    password_confirmation: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    })
  });

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  get passwordsDoNotMatch(): boolean {
    return this.registerForm.controls.password.value !== this.registerForm.controls.password_confirmation.value;
  }

  onRegister(): void {
    if (this.registerForm.invalid || this.passwordsDoNotMatch || this.isRegistering) {
      this.registerForm.markAllAsTouched();
      this.registerError = 'Sprawdź pola formularza.';
      this.focusFirstInvalid();
      return;
    }

    this.isRegistering = true;

    this.authService.register(this.registerForm.getRawValue()).subscribe({
      next: () => {
        this.isRegistering = false;
        Swal.fire({
          title: 'Konto utworzone',
          text: 'Możesz teraz zalogować się do Hotel Lux.',
          icon: 'success',
          confirmButtonText: 'Przejdź do logowania',
          confirmButtonColor: '#0d6efd',
          background: 'rgba(255,255,255,0.96)',
          backdrop: 'rgba(15,23,42,0.55)',
          customClass: {
            popup: 'rounded-4 shadow-lg',
            confirmButton: 'px-4 py-2 fw-bold'
          }
        }).then(() => this.router.navigate(['/login']));
      },
      error: (err) => {
        this.isRegistering = false;
        if (err.status === 422 && err.error?.errors) {
          this.fieldErrors = Object.fromEntries(Object.entries(err.error.errors).map(([field, messages]) => [field, Array.isArray(messages) ? String(messages[0]) : String(messages)]));
          this.registerError = 'Nie udało się utworzyć konta. Sprawdź pola formularza.';
          this.focusFirstInvalid();
          return;
        }
        this.registerError = 'Nie udało się utworzyć konta. Spróbuj ponownie.';
      }
    });
  }

  clearFieldError(field: string): void {
    delete this.fieldErrors[field];
    this.registerError = '';
  }

  private focusFirstInvalid(): void {
    setTimeout(() => document.querySelector<HTMLElement>('.register-card .is-invalid, .register-card .ng-invalid')?.focus());
  }
}
