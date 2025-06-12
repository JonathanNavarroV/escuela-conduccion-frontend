import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginData } from '../models/auth/login-data.model';
import { LoginRequest } from '../models/auth/login-request.model';
import { ApiResponse } from '../models/common/api-response.model';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	private readonly http = inject(HttpClient);

	private readonly tokenKey = 'auth_token';

	/**
	 * Envía una solicitud de inicio de sesión al backend para autenticar al usuario.
	 *
	 * @param loginRequest - Objeto con las credenciales del usuario (correo, contraseña y opción de "recordarme").
	 * @returns Un observable que emite un ApiResponse con los datos de autenticación (token JWT con los datos del usuario)
	 */
	public login(loginRequest: LoginRequest): Observable<ApiResponse<LoginData>> {
		return this.http.post<ApiResponse<LoginData>>(
			`${environment.apiUrl}/auth/login`,
			loginRequest,
		);
	}

	/**
	 * Obtiene el token JWT almacenado en el navegador, ya sea en `localStorage` o `sessionStorage`.
	 *
	 * @returns El token JWT si está presente, o `null` si no se encuentra en ninguno de los dos almacenes.
	 */
	public getToken(): string | null {
		const token =
			localStorage.getItem(this.tokenKey) ||
			sessionStorage.getItem(this.tokenKey);
		return token;
	}

	/**
	 * Verifica si el usuario está autenticado validando la existencia y validez del token JWT.
	 *
	 * - Primero revisa si hay un token guardado en localStorage o sessionStorage.
	 * - Luego consulta al backend para validar si el token sigue siendo válido.
	 *
	 * @returns {Observable<boolean>} Un Observable que emite:
	 *   - `true` si el token existe y es válido según el backend.
	 *   - `false` si no hay token o si el backend indica que no es válido.
	 */
	public isAuthenticated(): Observable<boolean> {
		const token =
			localStorage.getItem(this.tokenKey) ||
			sessionStorage.getItem(this.tokenKey);

		if (!token) return of(false);

		return this.http.get(`${environment.apiUrl}/auth/validate-token`).pipe(
			map(() => true),
			catchError(() => of(false)),
		);
	}

	/**
	 * Elimina el token de autenticación desde el localStorage y sessionStorage.
	 */
	public clearAuthToken(): void {
		localStorage.removeItem(this.tokenKey);
		sessionStorage.removeItem(this.tokenKey);
	}
}
