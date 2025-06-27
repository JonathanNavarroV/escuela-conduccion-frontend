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
	private readonly dialog = inject(MatDialog);

	/**
	 * Fuente de datos para la tabla de usuarios.
	 *
	 * Descripción detallada:
	 * - Utiliza `MatTableDataSource` de Angular Material para manejar, filtrar y paginar los datos de usuarios en la tabla.
	 */
	protected usersDataSource: MatTableDataSource<User> =
		new MatTableDataSource<User>();

	protected defaultUserImage = DEFAULT_USER_IMAGE;
	protected isLoadingDataTable = false;

	/**
	 * Observable reactivo para gestionar el término de búsqueda.
	 *
	 * Descripción detallada:
	 * - `BehaviorSubject` que almacena el texto actual del filtro de búsqueda.
	 * - Emite el valor inicial como cadena vacía.
	 * - Se usa para reaccionar y filtrar datos según el término ingresado por el usuario.
	 */
	private search$ = new BehaviorSubject<string>('');

	/**
	 * Inicializa el componente.
	 *
	 * Descripción detallada:
	 * - Llama a `initSearchListener()` para configurar la escucha reactiva del término de búsqueda.
	 */
	public ngOnInit(): void {
		this.initSearchListener();
	}

	/**
	 * Configura la escucha reactiva para el término de búsqueda de usuarios.
	 *
	 * Descripción detallada:
	 * - Escucha cambios en el `BehaviorSubject` `search$`.
	 * - Aplica un debounce para evitar búsquedas excesivas.
	 * - Filtra términos repetidos.
	 * - Muestra indicador de carga mientras se realiza la búsqueda.
	 * - Realiza la consulta a la API: obtiene todos los usuarios si el término está vacío, o busca por término si no.
	 * - Actualiza la fuente de datos de la tabla con los resultados recibidos.
	 * - Maneja errores registrándolos en consola y ocultando el indicador de carga.
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
	 * Obtiene la lista completa de usuarios desde el backend.
	 *
	 * Descripción detallada:
	 * - Muestra un indicador de carga mientras se realiza la petición.
	 * - Actualiza la fuente de datos de la tabla con los usuarios recibidos.
	 * - Maneja errores registrándolos en consola.
	 *
	 * @returns {Promise<void>} No retorna valor directamente; finaliza al completar la carga de usuarios.
	 *
	 * @async
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
	 * Actualiza el término de búsqueda para filtrar la lista de usuarios.
	 *
	 * Descripción detallada:
	 * - Emite el nuevo término en el `BehaviorSubject` `search$` para activar la búsqueda reactiva.
	 *
	 * @param {string} searchTerm - Texto ingresado por el usuario para filtrar resultados.
	 *
	 * @returns {Promise<void>} No retorna valor; la actualización dispara el filtro automáticamente.
	 *
	 * @async
	 */
	public async onSearchChanged(searchTerm: string): Promise<void> {
		this.search$.next(searchTerm);
	}

	/**
	 * Abre un diálogo para crear un nuevo usuario y procesa el resultado.
	 *
	 * Descripción detallada:
	 * - Muestra un diálogo modal con el componente `CreateUserDialogComponent`.
	 * - Configura un ancho mínimo y fijo de 640px para el diálogo.
	 * - Al cerrarse el diálogo, si se recibe un objeto `CreateUserDto`, se realiza la creación del usuario mediante el servicio.
	 * - En caso de éxito, registra en consola y actualiza la lista de usuarios.
	 * - Maneja errores de creación mostrando un mensaje en consola.
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
	 * Abre un diálogo para actualizar un usuario existente y procesa el resultado.
	 *
	 * Descripción detallada:
	 * - Muestra un diálogo modal con el componente `UpdateUserDialogComponent`.
	 * - Configura un ancho mínimo y fijo de 640px para el diálogo.
	 * - Pasa el `userId` como dato al diálogo para cargar la información del usuario.
	 * - Al cerrarse el diálogo, si se recibe un objeto `UpdateUserDto`, se realiza la actualización del usuario mediante el servicio.
	 * - En caso de éxito, registra en consola y actualiza la lista de usuarios.
	 * - Maneja errores de actualización mostrando un mensaje en consola.
	 *
	 * @param {string} userId - Identificador del usuario que se desea actualizar.
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
	 * Abre un diálogo de confirmación para desactivar un usuario y procesa la acción.
	 *
	 * Descripción detallada:
	 * - Configura el diálogo con un título y mensaje específicos para la acción de desactivación.
	 * - Muestra el diálogo modal `ConfirmActionDialogComponent` con la información de confirmación.
	 * - Al cerrarse, si el usuario confirma, se ejecuta la desactivación mediante el servicio.
	 * - En caso de éxito, se registra en consola y se actualiza la lista de usuarios.
	 * - Maneja errores de desactivación mostrando un mensaje en consola.
	 *
	 * @param {string} userId - Identificador del usuario que se desea desactivar.
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
	 * Abre un diálogo de confirmación para activar un usuario y procesa la acción.
	 *
	 * Descripción detallada:
	 * - Configura el diálogo con un título y mensaje específicos para la acción de activación.
	 * - Muestra el diálogo modal `ConfirmActionDialogComponent` con la información de confirmación.
	 * - Al cerrarse, si el usuario confirma, se ejecuta la activación mediante el servicio.
	 * - En caso de éxito, se registra en consola y se actualiza la lista de usuarios.
	 * - Maneja errores de activación mostrando un mensaje en consola.
	 *
	 * @param {string} userId - Identificador del usuario que se desea activar.
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
