import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Branch } from '../models/branches/branch.model';
import { ApiResponse } from '../models/common/api-response.model';
import { environment } from '../../../environments/environment';
import {
	CreateBranchDto,
	UpdateBranchDto,
} from '../models/branches/branch-dto.model';

@Injectable({
	providedIn: 'root',
})
export class BranchService {
	private readonly http = inject(HttpClient);

	/**
	 * Obtiene la lista completa de sedes desde el backend.
	 *
	 * @returns {Observable<ApiResponse<Branch[]>>} Observable que emite la respuesta con la lista de sedes.
	 */
	public getBranches(): Observable<ApiResponse<Branch[]>> {
		return this.http.get<ApiResponse<Branch[]>>(
			`${environment.apiUrl}/branches`,
		);
	}

	/**
	 * Busca sedes cuyo nombre coincide parcial o totalmente con el término dado.
	 *
	 * @param {string} searchTerm - Texto para buscar coincidencias en el nombre completo.
	 * @returns {Observable<ApiResponse<User[]>>} Observable que emite la respuesta con la lista de usuarios encontrados.
	 */
	public getBranchesBySearchTerm(
		searchTerm: string,
	): Observable<ApiResponse<Branch[]>> {
		return this.http.get<ApiResponse<Branch[]>>(
			`${environment.apiUrl}/branches/search`,
			{
				params: { searchTerm },
			},
		);
	}

	/**
	 * Busca sedes por su ID.
	 *
	 * @param {string} branchId - Identificador para buscar coincidencias de sede.
	 * @returns {Observable<ApiResponse<Branch>>} Observable que emite la respuesta con la sede encontrada.
	 */
	public getBranchById(branchId: string): Observable<ApiResponse<Branch>> {
		return this.http.get<ApiResponse<Branch>>(
			`${environment.apiUrl}/branches/${branchId}`,
		);
	}

	/**
	 * Crear una nueva sede.
	 *
	 * @param createBranchDto - Objeto que contiene los datos de la nueva sede a crear.
	 * @returns Un `Observable` que emite la respuesta del servidor, la cual incluye la sede creada.
	 */
	public createBranch(
		createBranchDto: CreateBranchDto,
	): Observable<ApiResponse<Branch>> {
		return this.http.post<ApiResponse<Branch>>(
			`${environment.apiUrl}/branches`,
			createBranchDto,
		);
	}

	/**
	 * Actualiza los datos de una sede existente.
	 *
	 * @param branchId - ID de la sede que se desea actualizar.
	 * @param updateBranchDto - Objeto con los nuevos datos para la sede.
	 * @returns Un `Observable` que emite la respuesta del servidor, incluyendo la sede actualizada.
	 */
	public updateBranch(
		branchId: string,
		updateBranchDto: UpdateBranchDto,
	): Observable<ApiResponse<Branch>> {
		return this.http.patch<ApiResponse<Branch>>(
			`${environment.apiUrl}/branches/${branchId}`,
			updateBranchDto,
		);
	}

	/**
	 * Activar una sede por su ID.
	 *
	 * @param branchId - ID de la sede que se desea activar.
	 * @returns  Un `Observable` que emite la respuesta del servidor al activar la sede.
	 */
	public activateBranch(branchId: string): Observable<ApiResponse<Branch>> {
		return this.http.patch<ApiResponse<Branch>>(
			`${environment.apiUrl}/branches/${branchId}/activate`,
			null,
		);
	}
	/**
	 * Desactivar una sede por su ID.
	 *
	 * @param branchId - ID de la sede que se desea desactivar.
	 * @returns  Un `Observable` que emite la respuesta del servidor al desactivar la sede.
	 */
	public deactivateBranch(branchId: string): Observable<ApiResponse<Branch>> {
		return this.http.patch<ApiResponse<Branch>>(
			`${environment.apiUrl}/branches/${branchId}/deactivate`,
			null,
		);
	}
}
