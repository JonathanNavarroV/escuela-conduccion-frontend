import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { ApiResponse } from '../../../core/models/common/api-response.model';
import { User } from '../../../core/models/users/user.model';
import { UserService } from '../../../core/services/user.service';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { CreateUserDialogComponent } from './dialogs/create-user-dialog/create-user-dialog.component';

@Component({
	selector: 'app-users',
	standalone: true,
	imports: [
		MatTableModule,
		MatIconModule,
		MatMenuModule,
		MatButtonModule,
		DataTableComponent,
	],
	templateUrl: './users.component.html',
	styleUrl: './users.component.scss',
})
export class UsersComponent {
	usersDataSource: MatTableDataSource<User> = new MatTableDataSource<User>();

	dialog = inject(MatDialog);

	constructor(private userService: UserService) {}

	ngOnInit(): void {
		this.getUsers();
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
		this.usersDataSource.data = apiResponse.data;
	}

	/**
	 * Obtiene la lista de usuarios filtrada por el nombre completo recibido
	 * desde el evento del input y actualiza la tabla con los datos recibidos.
	 * Si el texto del input está vacío, recupera la lista completa de usuarios.
	 *
	 * @param {Event} event - Evento disparado al modificar el valor del input de búsqueda.
	 * @returns {Promise<void>} Promesa que se resuelve cuando la lista de usuarios es actualizada.
	 */
	async getUsersByFullName(fullName: string): Promise<void> {
		const apiResponse: ApiResponse<User[]> = await firstValueFrom(
			this.userService.getUsersByFullName(fullName),
		);
		this.usersDataSource.data = apiResponse.data;
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

	/**
	 * Abre el diálogo para la creación de un nuevo usuario.
	 */
	openUpdateUserDialog(): void {
		this.dialog.open(CreateUserDialogComponent, {
			minWidth: '720px',
			width: '720px',
		});
	}

	/**
	 * Abre el diálogo para la creación de un nuevo usuario.
	 */
	openConfirmDeleteDialog(): void {
		this.dialog.open(CreateUserDialogComponent, {
			minWidth: '720px',
			width: '720px',
		});
	}
}
