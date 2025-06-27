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

	public loginForm: FormGroup;

	public passwordVisibility: WritableSignal<boolean> = signal(true);
	public isLoading = false;

	public constructor() {
		this.loginForm = this.formBuilder.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.minLength(6)]],
			rememberMe: [false],
		});
	}

	/**
	 * Alterna la visibilidad de la contraseña.
	 *
	 * Descripción detallada:
	 * - Cambia el estado de visibilidad de la contraseña entre visible y oculto.
	 * - Detiene la propagación del evento para evitar efectos no deseados en elementos padres.
	 *
	 * @param {MouseEvent} event - Evento del clic que activa el cambio de visibilidad.
	 *   Se usa para detener su propagación.
	 */
	public togglePasswordVisibility(event: MouseEvent): void {
		this.passwordVisibility.set(!this.passwordVisibility());
		event.stopPropagation();
	}

	/**
	 * Maneja el envío del formulario de inicio de sesión.
	 *
	 * Descripción detallada:
	 * - Valida el formulario antes de procesarlo.
	 * - Envía una solicitud de login al backend con las credenciales ingresadas.
	 * - Guarda el token de autenticación en `sessionStorage` o `localStorage` según la preferencia del usuario.
	 * - Redirige al usuario a la sección de administración si el login es exitoso.
	 * - Muestra un mensaje de error en un snackbar si ocurre algún problema.
	 *
	 * @returns {Promise<void>} No retorna ningún valor directamente.
	 *   Finaliza al completar el proceso de login, exitoso o con error.
	 *
	 * @throws {Error} Si ocurre un error en la solicitud al backend.
	 *   El mensaje se muestra en un snackbar si está disponible, o se loguea en consola.
	 *
	 * @async
	 */
	public async onSubmit(): Promise<void> {
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

	public async testSuccess() {
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

	public async testError() {
		const loginRequest: LoginRequest = {
			email: 'juan.perez@ejemplo.com',
			password: 'contraseña.segura.321',
		};
		await firstValueFrom(this.authService.login(loginRequest));
	}
}
