
import { ChangeDetectionStrategy, Component, signal, OnInit, inject } from '@angular/core';
import { email, form, FormField, minLength, required } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { AuthService } from '../../.services/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormField],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private router = inject(Router);
  private authService = inject(AuthService);

  constructor() {
    console.log("Login Component Constructor called");
  }

  loginModel = signal({
    username: 'Admin',
    password: 'P@ssw0rd1',
  });

  isLoading = signal(false);

  errorMsg = signal({
    message: '',
    active: false,
  })



  loginForm = form(this.loginModel, (fieldPath) => {
    required(fieldPath.username, { message: 'Username is required' });
    required(fieldPath.password, { message: 'Password is required' });
    minLength(fieldPath.password, 8, { message: 'Password must be at least 8 characters' });
  });
  onSubmit(e: Event) {
    e.preventDefault();
    console.log('Submitting:');
    this.isLoading.set(true);
    this.authService
      .login(this.loginForm.username().value(), this.loginForm.password().value())
      .subscribe({
        next: () => {
          this.router.navigate(['home'], { replaceUrl: true });
        },
        error: (e) => {
          console.log('login error =>' + JSON.stringify(e.error));
          this.errorMsg.set({
            message: 'Account not found: Try again!',
            active: true,
          }); 
          this.isLoading.set(false);
        },
        complete: () =>
          console.info('complete')
      });
  }
}

