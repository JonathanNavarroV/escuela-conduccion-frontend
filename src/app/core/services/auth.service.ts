import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginData } from '../models/auth/login-data.model';
import { LoginRequest } from '../models/auth/login-request.model';
import { ApiResponse } from '../models/common/api-response.model';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	constructor(private http: HttpClient) {}

	/**
	 * Envía una solicitud de inicio de sesión al backend para autenticar al usuario.
	 *
	 * @param loginRequest - Objeto con las credenciales del usuario (correo, contraseña y opción de "recordarme").
	 * @returns Un observable que emite un ApiResponse con los datos de autenticación (token JWT con los datos del usuario)
	 */
	login(loginRequest: LoginRequest): Observable<ApiResponse<LoginData>> {
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
	getToken(): string | null {
		let authKey: string = 'auth_token';

		return (
			localStorage.getItem(authKey) || sessionStorage.getItem(authKey) || null
		);
	}
}
