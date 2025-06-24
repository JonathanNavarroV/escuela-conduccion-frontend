import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/common/api-response.model';
import { District } from '../models/locations/district.model';
import { LocationLevel } from '../models/locations/location-level.model';
import { Province } from '../models/locations/province.model';
import { Region } from '../models/locations/region.model';

@Injectable({
	providedIn: 'root',
})
export class LocationsService {
	private readonly http = inject(HttpClient);

	/**
	 * Obtiene la lista de niveles de localización disponibles (como región, provincia o comuna).
	 *
	 * @returns Observable con la respuesta que contiene un array de niveles de localización.
	 */
	public getLocationLevels(): Observable<ApiResponse<LocationLevel[]>> {
		return this.http.get<ApiResponse<LocationLevel[]>>(
			`${environment.apiUrl}/locations/location_levels`,
		);
	}

	/**
	 * Obtiene la lista de regiones disponibles en el país.
	 *
	 * @returns Observable con la respuesta que contiene un array de regiones.
	 */
	public getRegions(): Observable<ApiResponse<Region[]>> {
		return this.http.get<ApiResponse<Region[]>>(
			`${environment.apiUrl}/locations/regions`,
		);
	}

	/**
	 * Obtiene la lista de provincias disponibles en el país.
	 *
	 * @returns Observable con la respuesta que contiene un array de regiones.
	 */
	public getProvinces(): Observable<ApiResponse<Province[]>> {
		return this.http.get<ApiResponse<Province[]>>(
			`${environment.apiUrl}/locations/provinces`,
		);
	}

	/**
	 * Obtiene la lista de provincias asociadas a una región específica.
	 *
	 * @param regionId ID de la región para obtener sus provincias.
	 * @returns Observable con la respuesta que contiene un array de provincias.
	 */
	public getProvincesByRegionId(
		regionId: string,
	): Observable<ApiResponse<Province[]>> {
		return this.http.get<ApiResponse<Province[]>>(
			`${environment.apiUrl}/locations/regions/${regionId}/provinces`,
		);
	}

	/**
	 * Obtiene la lista de comunas (distritos) asociadas a una provincia específica.
	 *
	 * @param provinceId ID de la provincia para obtener sus distritos.
	 * @returns Observable con la respuesta que contiene un array de distritos.
	 */
	public getDistrictsByProvinceId(
		provinceId: string,
	): Observable<ApiResponse<District[]>> {
		return this.http.get<ApiResponse<District[]>>(
			`${environment.apiUrl}/locations/provinces/${provinceId}/districts`,
		);
	}
}
