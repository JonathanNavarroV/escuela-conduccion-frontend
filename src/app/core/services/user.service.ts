import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/common/api-response.model';
import { CreateUserDto, UpdateUserDto } from '../models/users/user-dto.model';
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
	 * @param {string} searchTerm - Texto para buscar coincidencias en el nombre.
	 * @returns {Observable<ApiResponse<User[]>>} Observable que emite la respuesta con la lista de sedes encontradas.
	 */
	public getUsersBySearchTerm(
		searchTerm: string,
	): Observable<ApiResponse<User[]>> {
		return this.http.get<ApiResponse<User[]>>(
			`${environment.apiUrl}/users/search`,
			{
				params: { searchTerm },
			},
		);
	}

	/**
	 * Busca usuarios por su ID.
	 *
	 * @param {string} userId - Identificador para buscar coincidencias de usuario.
	 * @returns {Observable<ApiResponse<User>>} Observable que emite la respuesta con el usuario encontrado.
	 */
	public getUserById(userId: string): Observable<ApiResponse<User>> {
		return this.http.get<ApiResponse<User>>(
			`${environment.apiUrl}/users/${userId}`,
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

	/**
	 * Actualiza los datos de un usuario existente.
	 *
	 * @param userId - ID del usuario que se desea actualizar.
	 * @param updateUserDto - Objeto con los nuevos datos para el usuario.
	 * @returns Un `Observable` que emite la respuesta del servidor, incluyendo el usuario actualizado.
	 */
	public updateUser(
		userId: string,
		updateUserDto: UpdateUserDto,
	): Observable<ApiResponse<User>> {
		return this.http.patch<ApiResponse<User>>(
			`${environment.apiUrl}/users/${userId}`,
			updateUserDto,
		);
	}

	/**
	 * Elimina un usuario por su ID.
	 *
	 * @param userId - ID del usuario que se desea eliminar.
	 * @returns Un `Observable` que emite la respuesta del servidor al eliminar el usuario.
	 */
	public deleteUser(userId: string): Observable<ApiResponse<unknown>> {
		return this.http.delete<ApiResponse<unknown>>(
			`${environment.apiUrl}/users/${userId}`,
		);
	}
}
