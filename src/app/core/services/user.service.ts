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

	getUsers(): Observable<ApiResponse<User[]>> {
		return this.http.get<ApiResponse<User[]>>(`${environment.apiUrl}/users`);
	}
}
