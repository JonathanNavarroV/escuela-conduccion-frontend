import { CommonModule } from '@angular/common';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import {
	FormBuilder,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { LoginData } from '../../../core/models/auth/login-data.model';
import { LoginRequest } from '../../../core/models/auth/login-request.model';
import { ApiResponse } from '../../../core/models/common/api-response.model';
import { AuthService } from '../../../core/services/auth.service';
import { SnackbarService } from '../../../core/services/snackbar.service';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatButtonModule,
		MatCardModule,
		MatCheckboxModule,
		MatFormFieldModule,
		MatInputModule,
		MatProgressSpinner,
		MatIconModule,
	],
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss',
})
export class LoginComponent {
	private readonly formBuilder = inject(FormBuilder);
	private readonly authService = inject(AuthService);
	private readonly snackbar = inject(SnackbarService);
	private readonly router = inject(Router);

	loginForm: FormGroup;

	passwordVisibility: WritableSignal<boolean> = signal(true);
	isLoading = false;

	constructor() {
		this.loginForm = this.formBuilder.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.minLength(6)]],
			rememberMe: [false],
		});
	}

	/**
	 * Alterna la visibilidad de la contraseña en el campo de entrada.
	 * Cambia el valor de `passwordVisibility` entre `true` y `false`.
	 *
	 * @param event - Evento del mouse que activó la acción. Se usa `stopPropagation()` para evitar que el evento se propage a elementos padres.
	 */
	togglePasswordVisibility(event: MouseEvent): void {
		this.passwordVisibility.set(!this.passwordVisibility());
		event.stopPropagation();
	}

	/**
	 * Maneja el envío del formulario de login.
	 *
	 * - Valida el formulario.
	 * - Envía las credenciales al servicio de autenticación.
	 * - Guarda el token en `localStorage` o `sessionStorage` según el valor de `rememberMe`.
	 * - Redirige al usuario a `/admin` si el login fue exitoso.
	 * - Muestra errores del backend mediante `snackbar` si ocurren.
	 * - Limpia el campo de contraseña si el login falla.
	 *
	 * @returns {Promise<void>}
	 */
	async onSubmit(): Promise<void> {
		this.isLoading = true;
		try {
			if (this.loginForm.valid) {
				const email = this.loginForm.get('email')?.value;
				const password = this.loginForm.get('password')?.value;
				const rememberMe = this.loginForm.get('rememberMe')?.value;

				const loginRequest: LoginRequest = {
					email,
					password,
				};
				const apiResponse: ApiResponse<LoginData> = await firstValueFrom(
					this.authService.login(loginRequest),
				);

				this.authService.clearAuthToken();
				const token = apiResponse?.data?.access_token;
				if (token) {
					if (rememberMe) {
						sessionStorage.setItem('auth_token', token);
					} else {
						localStorage.setItem('auth_token', token);
					}
					this.router.navigate(['/admin']);
				}
			}
		} catch (error: unknown) {
			const message = (error as { error?: { message?: string } })?.error
				?.message;
			if (message) {
				this.snackbar.show(message);
			} else {
				console.log('Login error:', error);
			}

			this.loginForm.get('password')?.reset();
		} finally {
			this.isLoading = false;
		}
	}

	async testSuccess() {
		const loginRequest: LoginRequest = {
			email: 'juan.perez@ejemplo.com',
			password: 'contraseña.segura.123',
		};
		const apiResponse: ApiResponse<LoginData> = await firstValueFrom(
			this.authService.login(loginRequest),
		);

		this.authService.clearAuthToken();
		const token = apiResponse?.data?.access_token;
		if (token) {
			localStorage.setItem('auth_token', token);
			this.router.navigate(['/admin']);
		}
	}

	async testError() {
		const loginRequest: LoginRequest = {
			email: 'juan.perez@ejemplo.com',
			password: 'contraseña.segura.321',
		};
		await firstValueFrom(this.authService.login(loginRequest));
	}
}
