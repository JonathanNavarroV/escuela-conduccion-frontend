import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { ApiResponse } from '../../../core/models/common/api-response.model';
import { User } from '../../../core/models/users/user.model';
import { UserService } from '../../../core/services/user.service';

@Component({
	selector: 'app-users',
	standalone: true,
	imports: [
		MatFormField,
		MatInputModule,
		MatTableModule,
		MatMenuModule,
		MatButtonModule,
		MatIconModule,
		MatPaginatorModule,
		CommonModule,
	],
	templateUrl: './users.component.html',
	styleUrl: './users.component.scss',
})
export class UsersComponent {
	users: User[] = [];

	displayedColumns: string[] = ['user', 'email', 'role', 'actions'];

	/**
	 * Fuente de datos para la tabla de usuarios.
	 * Se actualiza cuando se reciben los datos desde el backend.
	 */
	dataSource = new MatTableDataSource<User>(this.users);

	/**
	 * Referencia al componente de paginación de Angular Material.
	 * Se vincula al datasource en `ngAfterViewInit`.
	 */
	@ViewChild(MatPaginator) paginator!: MatPaginator;

	constructor(private userService: UserService) {}

	ngOnInit(): void {
		this.getUsers();
	}

	ngAfterViewInit(): void {
		this.dataSource.paginator = this.paginator;
	}

	/**
	 * Obtiene la lista de usuarios desde el servicio `UserService`
	 * y actualiza la tabla con los datos recibidos.
	 */
	async getUsers(): Promise<void> {
		const apiResponse: ApiResponse<User[]> = await firstValueFrom(
			this.userService.getUsers(),
		);
		this.users = apiResponse.data;
	}
}
