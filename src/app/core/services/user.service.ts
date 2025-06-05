import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/common/api-response.model';
import { User } from '../models/users/user.model';

@Injectable({
	providedIn: 'root',
})
export class UserService {
	constructor(private http: HttpClient) {}

	/**
	 * Obtiene la lista completa de usuarios desde el backend.
	 *
	 * @returns {Observable<ApiResponse<User[]>>} Observable que emite la respuesta con la lista de usuarios.
	 */
	getUsers(): Observable<ApiResponse<User[]>> {
		return this.http.get<ApiResponse<User[]>>(`${environment.apiUrl}/users`);
	}

	/**
	 * Busca usuarios cuyo nombre completo coincide parcial o totalmente con el término dado.
	 *
	 * @param {string} fullName - Texto para buscar coincidencias en el nombre completo.
	 * @returns {Observable<ApiResponse<User[]>>} Observable que emite la respuesta con la lista de usuarios encontrados.
	 */
	getUsersByFullName(fullName: string) {
		return this.http.get<ApiResponse<User[]>>(
			`${environment.apiUrl}/users/search`,
			{
				params: { fullName },
			},
		);
	}
}
