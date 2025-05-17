import { CommonModule } from '@angular/common';
import { Component, signal, WritableSignal } from '@angular/core';
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
	styleUrl: './login.component.css',
})
export class LoginComponent {
	passwordVisibility: WritableSignal<boolean>;

	loginForm: FormGroup;

	isLoading: boolean;

	constructor(
		private formBuilder: FormBuilder,
		private authService: AuthService,
		private snackbar: SnackbarService,
		private router: Router,
	) {
		this.passwordVisibility = signal(true);

		this.loginForm = this.formBuilder.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.minLength(6)]],
			rememberMe: [false],
		});

		this.isLoading = false;
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
				let email = this.loginForm.get('email')?.value;
				let password = this.loginForm.get('password')?.value;
				let rememberMe = this.loginForm.get('rememberMe')?.value;

				let loginRequest: LoginRequest = {
					email,
					password,
				};
				const apiResponse: ApiResponse<LoginData> = await firstValueFrom(
					this.authService.login(loginRequest),
				);

				const token = apiResponse?.data?.access_token;
				if (token) {
					if (rememberMe) {
						localStorage.setItem('auth_token', token);
					} else {
						sessionStorage.setItem('auth_token', token);
					}
					this.router.navigate(['/admin']);
				}
			}
		} catch (error: any) {
			const message = error?.error?.message;
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
}
