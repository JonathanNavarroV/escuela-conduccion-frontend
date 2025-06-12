import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { DEFAULT_USER_IMAGE } from '../../../core/constants/image-paths';
import { ApiResponse } from '../../../core/models/common/api-response.model';
import {
	CreateUserDto,
	UpdateUserDto,
} from '../../../core/models/users/user-dto.model';
import { User } from '../../../core/models/users/user.model';
import { UserService } from '../../../core/services/user.service';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { ConfirmActionDialogComponent } from '../../../shared/dialogs/confirm-action-dialog/confirm-action-dialog.component';
import { CreateUserDialogComponent } from './dialogs/create-user-dialog/create-user-dialog.component';
import { UpdateUserDialogComponent } from './dialogs/update-user-dialog/update-user-dialog.component';

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
export class UsersComponent implements OnInit {
	private readonly userService = inject(UserService);

	/**
	 * Referencia al servicio de diálogos de Angular Material.
	 */
	private dialog = inject(MatDialog);

	/**
	 * Fuente de datos que alimenta la tabla de usuarios.
	 * Se actualiza al obtener datos desde el servicio.
	 */
	protected usersDataSource: MatTableDataSource<User> =
		new MatTableDataSource<User>();

	protected defaultUserImage = DEFAULT_USER_IMAGE;
	protected isLoadingDataTable = false;

	/**
	 * Carga inicialmente todos los usuarios.
	 */
	public ngOnInit(): void {
		this.getUsers();
	}

	/**
	 * Obtiene todos los usuarios desde el backend y actualiza el dataSource de la tabla.
	 */
	public async getUsers(): Promise<void> {
		this.isLoadingDataTable = true;
		try {
			const apiResponse: ApiResponse<User[]> = await firstValueFrom(
				this.userService.getUsers(),
			);
			this.usersDataSource.data = apiResponse.data ?? [];
		} catch (error) {
			console.error('Error al obtener los usuarios:', error);
		} finally {
			this.isLoadingDataTable = false;
		}
	}

	/**
	 * Busca usuarios por nombre completo utilizando el servicio.
	 * Si el input está vacío, vuelve a cargar todos los usuarios.
	 *
	 * @param {string} fullName - Nombre completo usado como criterio de búsqueda.
	 */
	public async getUsersByFullName(fullName: string): Promise<void> {
		if (fullName.length === 0) {
			this.getUsers();
		} else {
			this.isLoadingDataTable = true;
			try {
				const apiResponse: ApiResponse<User[]> = await firstValueFrom(
					this.userService.getUsersByFullName(fullName),
				);
				this.usersDataSource.data = apiResponse.data ?? [];
			} catch (error) {
				console.error('Error al obtener los usuarios:', error);
			} finally {
				this.isLoadingDataTable = false;
			}
		}
	}

	/**
	 * Abre el diálogo de creación de usuario.
	 *
	 * Al cerrar el diálogo, si el usuario envía un formulario válido, se envía la solicitud al backend para crear un nuevo usuario usando `UserService`.
	 *
	 * Si la creación es exitosa, se muestra el resultado en consola.
	 * Si ocurre un error, se registra en consola.
	 */
	public openCreateUserDialog(): void {
		this.dialog
			.open(CreateUserDialogComponent, {
				minWidth: '640px',
				width: '640px',
			})
			.afterClosed()
			.subscribe((createUserDto: CreateUserDto) => {
				if (createUserDto) {
					this.userService.createUser(createUserDto).subscribe({
						next: (apiResponse) => {
							console.log('Usuario creado: ', apiResponse.data);
						},
						error: (error) => {
							console.error('Error al crear usuario', error);
						},
					});
				}
			});
	}

	/**
	 * Abre el diálogo para la modificación de un usuario.
	 *
	 * Al cerrar el diálogo, si el usuario envía un formulario válido, se envía la solicitud al backend para actualizar un usuario usando `UserService`.
	 *
	 * Si la actualización es exitosa, se muestra el resultado en consola.
	 * Si ocurre un error, se registra en consola.
	 */
	public openUpdateUserDialog(userId: string): void {
		this.dialog
			.open(UpdateUserDialogComponent, {
				minWidth: '640px',
				width: '640px',
				data: userId,
			})
			.afterClosed()
			.subscribe((updateUserDto: UpdateUserDto) => {
				if (updateUserDto)
					this.userService.updateUser(userId, updateUserDto).subscribe({
						next: (apiResponse) => {
							console.log('Usuario actualizado: ', apiResponse.data);
						},
						error: (error) => {
							console.error('Error al actualizar usuario', error);
						},
					});
			});
	}

	/**
	 * Abre el diálogo para la confirmación de eliminación de un usuario.
	 */
	public openConfirmDeleteDialog(): void {
		this.dialog.open(ConfirmActionDialogComponent, {});
	}
}
