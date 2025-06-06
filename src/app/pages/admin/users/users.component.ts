import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
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
import { CreateUserDialogComponent } from './dialogs/create-user-dialog/create-user-dialog.component';

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
	@ViewChild(MatPaginator) paginator?: MatPaginator;

	dialog = inject(MatDialog);

	constructor(private userService: UserService) {}

	ngOnInit(): void {
		this.getUsers();
	}

	/**
	 * Se ejecuta después de que la vista del componente ha sido inicializada.
	 * Asocia el paginador de Angular Material al dataSource de la tabla para habilitar la paginación.
	 *
	 * @returns {void} No retorna ningún valor.
	 */
	ngAfterViewInit(): void {
		if (this.paginator) {
			this.dataSource.paginator = this.paginator;
		}
	}

	/**
	 * Obtiene la lista completa de usuarios desde el servicio `UserService`
	 * y actualiza la tabla con los datos recibidos.
	 *
	 * @returns {Promise<void>} Promesa que se resuelve cuando la lista de usuarios es actualizada.
	 */
	async getUsers(): Promise<void> {
		const apiResponse: ApiResponse<User[]> = await firstValueFrom(
			this.userService.getUsers(),
		);
		this.users = apiResponse.data;
	}

	/**
	 * Obtiene la lista de usuarios filtrada por el nombre completo recibido
	 * desde el evento del input y actualiza la tabla con los datos recibidos.
	 * Si el texto del input está vacío, recupera la lista completa de usuarios.
	 *
	 * @param {Event} event - Evento disparado al modificar el valor del input de búsqueda.
	 * @returns {Promise<void>} Promesa que se resuelve cuando la lista de usuarios es actualizada.
	 */
	async getUsersByFullName(event: Event): Promise<void> {
		const fullName = (event.target as HTMLInputElement).value;

		const apiResponse: ApiResponse<User[]> = await firstValueFrom(
			this.userService.getUsersByFullName(fullName),
		);
		this.users = apiResponse.data;
		if (fullName.length === 0) {
			this.getUsers();
		}
	}

	/**
	 * Abre el diálogo para la creación de un nuevo usuario.
	 */
	openCreateUserDialog(): void {
		this.dialog.open(CreateUserDialogComponent, {
			minWidth: '720px',
			width: '720px',
		});
	}
}
