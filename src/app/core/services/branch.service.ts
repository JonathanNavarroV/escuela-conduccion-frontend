import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Branch } from '../models/branches/branch.model';
import { ApiResponse } from '../models/common/api-response.model';
import { environment } from '../../../environments/environment';

@Injectable({
	providedIn: 'root',
})
export class BranchService {
	private readonly http = inject(HttpClient);

	getBranches(): Observable<ApiResponse<Branch[]>> {
		return this.http.get<ApiResponse<Branch[]>>(
			`${environment.apiUrl}/branches`,
		);
	}
}
