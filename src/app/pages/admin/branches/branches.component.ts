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
import {
	CreateBranchDto,
	UpdateBranchDto,
} from '../../../core/models/branches/branch-dto.model';
import { Branch } from '../../../core/models/branches/branch.model';
import { ApiResponse } from '../../../core/models/common/api-response.model';
import { ConfirmDialogData } from '../../../core/models/common/confirm-dialog-data';
import { BranchService } from '../../../core/services/branch.service';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { ConfirmActionDialogComponent } from '../../../shared/dialogs/confirm-action-dialog/confirm-action-dialog.component';
import { CreateBranchDialogComponent } from './dialogs/create-branch-dialog/create-branch-dialog.component';
import { UpdateBranchDialogComponent } from './dialogs/update-branch-dialog/update-branch-dialog.component';

@Component({
	selector: 'app-branches',
	standalone: true,
	imports: [
		CommonModule,
		MatTableModule,
		MatIconModule,
		MatMenuModule,
		MatButtonModule,
		DataTableComponent,
	],
	templateUrl: './branches.component.html',
	styleUrl: './branches.component.scss',
})
export class BranchesComponent implements OnInit {
	private readonly branchService = inject(BranchService);
	private readonly dialog = inject(MatDialog);

	/**
	 * Fuente de datos para la tabla de sedes.
	 *
	 * Descripción detallada:
	 * - Utiliza `MatTableDataSource` de Angular Material para manejar, filtrar y paginar los datos de sedes en la tabla.
	 */
	protected branchesDataSource: MatTableDataSource<Branch> =
		new MatTableDataSource<Branch>();

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
	 * Configura la escucha reactiva para el término de búsqueda de sedes.
	 *
	 * Descripción detallada:
	 * - Escucha cambios en el `BehaviorSubject` `search$`.
	 * - Aplica un debounce para evitar búsquedas excesivas.
	 * - Filtra términos repetidos.
	 * - Muestra indicador de carga mientras se realiza la búsqueda.
	 * - Realiza la consulta a la API: obtiene todas las sedes si el término está vacío, o busca por término si no.
	 * - Actualiza la fuente de datos de la tabla con los resultados recibidos.
	 * - Maneja errores registrándolos en consola y ocultando el indicador de carga.
	 */
	private initSearchListener(): void {
		this.search$
			.pipe(
				debounceTime(DEBOUNCE_TIMES.branchSearch),
				distinctUntilChanged(),
				tap(() => (this.isLoadingDataTable = true)),
				switchMap((term) =>
					term.length === 0
						? this.branchService.getBranches()
						: this.branchService.getBranchesBySearchTerm(term),
				),
			)
			.subscribe({
				next: (apiResponse) => {
					this.branchesDataSource.data = apiResponse.data ?? [];
					this.isLoadingDataTable = false;
				},
				error: (error) => {
					console.error('Error al buscar usuarios:', error);
					this.isLoadingDataTable = false;
				},
			});
	}

	/**
	 * Obtiene la lista completa de sedes desde el backend.
	 *
	 * Descripción detallada:
	 * - Muestra un indicador de carga mientras se realiza la petición.
	 * - Actualiza la fuente de datos de la tabla con las sedes recibidas.
	 * - Maneja errores registrándolos en consola.
	 *
	 * @returns {Promise<void>} No retorna valor directamente; finaliza al completar la carga de sedes.
	 *
	 * @async
	 */
	public async getBranches(): Promise<void> {
		this.isLoadingDataTable = true;
		try {
			const apiResponse: ApiResponse<Branch[]> = await firstValueFrom(
				this.branchService.getBranches(),
			);
			this.branchesDataSource.data = apiResponse.data ?? [];
		} catch (error) {
			console.log('Error al obtener las sedes: ', error);
		} finally {
			this.isLoadingDataTable = false;
		}
	}

	/**
	 * Actualiza el término de búsqueda para filtrar la lista de sedes.
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
	 * Abre un diálogo para crear una nueva sede y procesa el resultado.
	 *
	 * Descripción detallada:
	 * - Muestra un diálogo modal con el componente `CreateBranchDialogComponent`.
	 * - Configura un ancho mínimo y fijo de 640px para el diálogo.
	 * - Al cerrarse el diálogo, si se recibe un objeto `CreateBranchDto`, se realiza la creación de la sede mediante el servicio.
	 * - En caso de éxito, registra en consola y actualiza la lista de sedes.
	 * - Maneja errores de creación mostrando un mensaje en consola.
	 */
	protected openCreateBranchDialog(): void {
		this.dialog
			.open(CreateBranchDialogComponent, {
				minWidth: '640px',
				width: '640px',
			})
			.afterClosed()
			.subscribe((createBranchDto: CreateBranchDto) => {
				if (createBranchDto) {
					this.branchService.createBranch(createBranchDto).subscribe({
						next: (apiResponse) => {
							console.log('Sede creada: ', apiResponse.data);
							this.getBranches();
						},
						error: (error) => {
							console.error('Error al crear sede', error);
						},
					});
				}
			});
	}

	/**
	 * Abre un diálogo para actualizar una sede existente y procesa el resultado.
	 *
	 * Descripción detallada:
	 * - Muestra un diálogo modal con el componente `UpdateBranchDialogComponent`.
	 * - Configura un ancho mínimo y fijo de 640px para el diálogo.
	 * - Pasa el `branchId` como dato al diálogo para cargar la información de la sede.
	 * - Al cerrarse el diálogo, si se recibe un objeto `UpdateBranchDto`, se realiza la actualización de la sede mediante el servicio.
	 * - En caso de éxito, registra en consola y actualiza la lista de sedes.
	 * - Maneja errores de actualización mostrando un mensaje en consola.
	 *
	 * @param {string} branchId - Identificador de la sede que se desea actualizar.
	 */
	protected openUpdateBranchDialog(branchId: string): void {
		this.dialog
			.open(UpdateBranchDialogComponent, {
				minWidth: '640px',
				width: '640px',
				data: branchId,
			})
			.afterClosed()
			.subscribe((updateBranchDto: UpdateBranchDto) => {
				if (updateBranchDto) {
					this.branchService.updateBranch(branchId, updateBranchDto).subscribe({
						next: (apiResponse) => {
							console.log('Sede actualizada: ', apiResponse.data);
							this.getBranches();
						},
						error: (error) => {
							console.error('Error al actualizar seed', error);
						},
					});
				}
			});
	}

	/**
	 * Abre un diálogo de confirmación para desactivar una sede y procesa la acción.
	 *
	 * Descripción detallada:
	 * - Configura el diálogo con un título y mensaje específicos para la acción de desactivación.
	 * - Muestra el diálogo modal `ConfirmActionDialogComponent` con la información de confirmación.
	 * - Al cerrarse, si el usuario confirma, se ejecuta la desactivación mediante el servicio.
	 * - En caso de éxito, se registra en consola y se actualiza la lista de sedes.
	 * - Maneja errores de desactivación mostrando un mensaje en consola.
	 *
	 * @param {string} branchId - Identificador de la sede que se desea desactivar.
	 */
	protected openConfirmDeactivateDialog(branchId: string): void {
		const dialogData: ConfirmDialogData = {
			title: 'Desactivar sede',
			message: '¿Seguro que desea desactivar esta sede?',
		};

		this.dialog
			.open(ConfirmActionDialogComponent, {
				data: dialogData,
			})
			.afterClosed()
			.subscribe((confirmed: boolean) => {
				if (confirmed) {
					this.branchService.deactivateBranch(branchId).subscribe({
						next: (apiResponse) => {
							console.log('Sede desactivada: ', apiResponse.data);
							this.getBranches();
						},
						error: (error) => {
							console.error('Error al desactivar sede', error);
						},
					});
				}
			});
	}

	/**
	 * Abre un diálogo de confirmación para activar una sede y procesa la acción.
	 *
	 * Descripción detallada:
	 * - Configura el diálogo con un título y mensaje específicos para la acción de activación.
	 * - Muestra el diálogo modal `ConfirmActionDialogComponent` con la información de confirmación.
	 * - Al cerrarse, si el usuario confirma, se ejecuta la activación mediante el servicio.
	 * - En caso de éxito, se registra en consola y se actualiza la lista de sedes.
	 * - Maneja errores de activación mostrando un mensaje en consola.
	 *
	 * @param {string} branchId - Identificador de la sede que se desea activar.
	 */
	protected openConfirmActivateDialog(branchId: string): void {
		const dialogData: ConfirmDialogData = {
			title: 'Activar sede',
			message: '¿Seguro que desea activar esta sede?',
		};

		this.dialog
			.open(ConfirmActionDialogComponent, {
				data: dialogData,
			})
			.afterClosed()
			.subscribe((confirmed: boolean) => {
				if (confirmed) {
					this.branchService.activateBranch(branchId).subscribe({
						next: (apiResponse) => {
							console.log('Sede activada: ', apiResponse.data);
							this.getBranches();
						},
						error: (error) => {
							console.error('Error al activar sede', error);
						},
					});
				}
			});
	}
}
