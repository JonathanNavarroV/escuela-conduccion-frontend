import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/common/api-response.model';
import { CreateUserDto } from '../models/users/user-dto.model';
import { User } from '../models/users/user.model';

@Injectable({
	providedIn: 'root',
})
export class UserService {
	private readonly http = inject(HttpClient);

	/**
	 * Obtiene la lista completa de usuarios desde el backend.
	 *
	 * @returns {Observable<ApiResponse<User[]>>} Observable que emite la respuesta con la lista de usuarios.
	 */
	public getUsers(): Observable<ApiResponse<User[]>> {
		return this.http.get<ApiResponse<User[]>>(`${environment.apiUrl}/users`);
	}

	/**
	 * Busca usuarios cuyo nombre completo coincide parcial o totalmente con el término dado.
	 *
	 * @param {string} fullName - Texto para buscar coincidencias en el nombre completo.
	 * @returns {Observable<ApiResponse<User[]>>} Observable que emite la respuesta con la lista de usuarios encontrados.
	 */
	public getUsersByFullName(fullName: string) {
		return this.http.get<ApiResponse<User[]>>(
			`${environment.apiUrl}/users/search`,
			{
				params: { fullName },
			},
		);
	}

	/**
	 * Obtiene la lista de roles disponibles para los usuarios desde el backend.
	 *
	 * @returns {Observable<ApiResponse<string[]>>} Observable que emite la respuesta con la lista de roles disponibles.
	 */
	public getRoles(): Observable<ApiResponse<string[]>> {
		return this.http.get<ApiResponse<string[]>>(
			`${environment.apiUrl}/users/roles`,
		);
	}

	/**
	 * Crear un nuevo usuario.
	 *
	 * @param createUserDto - Objeto que contiene los datos del nuevo usuario a crear.
	 * @returns Un `Observable` que emite la respuesta del servidor, la cual incluye el usuario creado.
	 */
	public createUser(
		createUserDto: CreateUserDto,
	): Observable<ApiResponse<User>> {
		return this.http.post<ApiResponse<User>>(
			`${environment.apiUrl}/users`,
			createUserDto,
		);
	}
}
