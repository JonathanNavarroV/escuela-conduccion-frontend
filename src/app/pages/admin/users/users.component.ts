import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
	BehaviorSubject,
	debounceTime,
	distinctUntilChanged,
	firstValueFrom,
	switchMap,
	tap,
} from 'rxjs';
import { DEBOUNCE_TIMES } from '../../../core/constants/debounce-times';
import { DEFAULT_USER_IMAGE } from '../../../core/constants/image-paths';
import { ApiResponse } from '../../../core/models/common/api-response.model';
import { ConfirmDialogData } from '../../../core/models/common/confirm-dialog-data';
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
		CommonModule,
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
	private readonly dialog = inject(MatDialog);

	/**
	 * Fuente de datos que alimenta la tabla de usuarios.
	 * Se actualiza al obtener datos desde el servicio.
	 */
	protected usersDataSource: MatTableDataSource<User> =
		new MatTableDataSource<User>();

	protected defaultUserImage = DEFAULT_USER_IMAGE;
	protected isLoadingDataTable = false;

	/**
	 * Stream reactivo que emite los términos de búsqueda ingresados.
	 *
	 * Este `BehaviorSubject` se observa con `initSearchListener` para
	 * ejecutar búsquedas con debounce y cancelar peticiones anteriores.
	 */
	private search$ = new BehaviorSubject<string>('');

	/**
	 * - Inicia el listener de búsqueda reactiva.
	 */
	public ngOnInit(): void {
		this.initSearchListener();
	}

	/**
	 * Inicializa el flujo reactivo de búsqueda de usuarios.
	 *
	 * - Aplica un `debounceTime` para evitar peticiones excesivas.
	 * - Usa `distinctUntilChanged` para evitar búsquedas duplicadas.
	 * - Emite `getUsers` o `getUsersBySearchTerm` dependiendo del input.
	 * - Muestra y oculta el indicador de carga (`isLoadingDataTable`).
	 */
	private initSearchListener(): void {
		this.search$
			.pipe(
				debounceTime(DEBOUNCE_TIMES.userSearch),
				distinctUntilChanged(),
				tap(() => (this.isLoadingDataTable = true)),
				switchMap((term) =>
					term.length === 0
						? this.userService.getUsers()
						: this.userService.getUsersBySearchTerm(term),
				),
			)
			.subscribe({
				next: (apiResponse) => {
					this.usersDataSource.data = apiResponse.data ?? [];
					this.isLoadingDataTable = false;
				},
				error: (error) => {
					console.error('Error al buscar usuarios:', error);
					this.isLoadingDataTable = false;
				},
			});
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
			console.error('Error al obtener los usuarios: ', error);
		} finally {
			this.isLoadingDataTable = false;
		}
	}

	/**
	 * Emite un nuevo término de búsqueda al stream `search$`.
	 *
	 * @param {string} searchTerm - Término de búsqueda ingresado.
	 */
	public async onSearchChanged(searchTerm: string): Promise<void> {
		this.search$.next(searchTerm);
	}

	/**
	 * Abre el diálogo de creación de usuario.
	 *
	 * Al cerrar el diálogo, si el usuario envía un formulario válido, se envía la solicitud al backend para crear un nuevo usuario usando `UserService`.
	 *
	 * Si la creación es exitosa, se muestra el resultado en consola.
	 * Si ocurre un error, se registra en consola.
	 */
	protected openCreateUserDialog(): void {
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
							this.getUsers();
						},
						error: (error) => {
							console.error('Error al crear usuario', error);
						},
					});
				}
			});
	}

	/**
	 * Abre el diálogo para editar un usuario existente.
	 *
	 * @param userId - ID del usuario que se desea editar.
	 *
	 * Al cerrar el diálogo, si se proporciona un formulario válido (`UpdateUserDto`), se envía una solicitud al backend mediante `UserService` para actualizar al usuario.
	 *
	 * - Si la actualización es exitosa, se recarga la lista de usuarios.
	 * - Si ocurre un error, este se registra en la consola.
	 */
	protected openUpdateUserDialog(userId: string): void {
		this.dialog
			.open(UpdateUserDialogComponent, {
				minWidth: '640px',
				width: '640px',
				data: userId,
			})
			.afterClosed()
			.subscribe((updateUserDto: UpdateUserDto) => {
				if (updateUserDto) {
					this.userService.updateUser(userId, updateUserDto).subscribe({
						next: (apiResponse) => {
							console.log('Usuario actualizado: ', apiResponse.data);
							this.getUsers();
						},
						error: (error) => {
							console.error('Error al actualizar usuario', error);
						},
					});
				}
			});
	}

	/**
	 * Abre un cuadro de diálogo para confirmar la desactivación de un usuario.
	 *
	 * @param userId - ID del usuario que se desea desactivar.
	 *
	 * Si se confirma la acción, se envía una solicitud al backend para desactivar el usuario usando `UserService`.
	 *
	 * - Si la desactivación es exitosa, se recarga la lista de usuarios.
	 * - Si ocurre un error, este se registra en la consola.
	 */
	protected openConfirmDeactivateDialog(userId: string): void {
		const dialogData: ConfirmDialogData = {
			title: 'Desactivar usuario',
			message: '¿Seguro que desea desactivar este usuario?',
		};

		this.dialog
			.open(ConfirmActionDialogComponent, {
				data: dialogData,
			})
			.afterClosed()
			.subscribe((confirmed: boolean) => {
				if (confirmed) {
					this.userService.deactivateUser(userId).subscribe({
						next: (apiResponse) => {
							console.log('Usuario desactivado: ', apiResponse.data);
							this.getUsers();
						},
						error: (error) => {
							console.error('Error al desactivar usuario', error);
						},
					});
				}
			});
	}

	/**
	 * Abre un cuadro de diálogo para confirmar la activación de un usuario.
	 *
	 * @param userId - ID del usuario que se desea activar.
	 *
	 * Si se confirma la acción, se envía una solicitud al backend para activar el usuario usando `BranchService`.
	 *
	 * - Si la activación es exitosa, se recarga la lista de usuarios.
	 * - Si ocurre un error, este se registra en la consola.
	 */
	protected openConfirmActivateDialog(userId: string): void {
		const dialogData: ConfirmDialogData = {
			title: 'Activar usuario',
			message: '¿Seguro que desea activar este usuario?',
		};

		this.dialog
			.open(ConfirmActionDialogComponent, {
				data: dialogData,
			})
			.afterClosed()
			.subscribe((confirmed: boolean) => {
				if (confirmed) {
					this.userService.activateUser(userId).subscribe({
						next: (apiResponse) => {
							console.log('Usuario activado: ', apiResponse.data);
							this.getUsers();
						},
						error: (error) => {
							console.error('Error al activar usuario', error);
						},
					});
				}
			});
	}
}
