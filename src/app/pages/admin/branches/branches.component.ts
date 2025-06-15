import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
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
	 * Fuente de datos que alimenta la tabla de sedes.
	 * Se actualiza al obtener datos desde el servicio.
	 */
	protected branchesDataSource: MatTableDataSource<Branch> =
		new MatTableDataSource<Branch>();

	protected isLoadingDataTable = false;

	/**
	 * Carga inicialmente todas las sedes.
	 */
	public ngOnInit(): void {
		this.getBranches();
	}

	/**
	 * Obtiene todas las sedes desde el backend y actualiza el dataSource de la tabla
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
	 * Busca sedes por nombre.
	 * Si el input está vacío, vuelve a cargar todas las sedes.
	 *
	 * @param {string} searchTerm - Nombre usuario como criterio de búsqueda.
	 */
	public async getBranchesByTerm(searchTerm: string): Promise<void> {
		if (searchTerm.length === 0) {
			this.getBranches();
		} else {
			this.isLoadingDataTable = true;
			try {
				const apiResponse: ApiResponse<Branch[]> = await firstValueFrom(
					this.branchService.getBranchesBySearchTerm(searchTerm),
				);
				this.branchesDataSource.data = apiResponse.data ?? [];
			} catch (error) {
				console.error('Error al obtener los usuarios: ', error);
			} finally {
				this.isLoadingDataTable = false;
			}
		}
	}

	/**
	 * Abre el diálogo de creación de sede.
	 *
	 * Al cerrar el diálogo, si la sede envía un formulario válido, se envía la solicitud al backend para crear una nueva sede usando `BranchService`.
	 *
	 * Si la creación es exitosa, se muestra el resultado en consola.
	 * Si ocurre un error, se registra en consola.
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
	 * Abre el diálogo para editar una sede existente.
	 *
	 * @param branchId - ID de la sede que se desea editar.
	 *
	 * Al cerrar el diálogo, si se proporciona un formulario válido (`UpdateBranchDto`), se envía una solicitud al backend mediante `BranchService` para actualizar la sede.
	 *
	 * - Si la actualización es exitosa, se recarga la lista de sedes.
	 * - Si ocurre un error, este se registra en la consola.
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
	 * Abre un cuadro de diálogo para confirmar la eliminación de una sede.
	 *
	 * @param branchId - ID de la sede que se desea eliminar.
	 *
	 * Si se confirma la acción, se envía una solicitud al backend para eliminar la sede usando `BranchService`.
	 *
	 * - Si la eliminación es exitosa, se recarga la lista de sedes.
	 * - Si ocurre un error, este se registra en la consola.
	 */
	protected openConfirmDeleteDialog(branchId: string): void {
		const dialogData: ConfirmDialogData = {
			title: 'Eliminar sede',
			message: '¿Seguro que desea ekiminar esta sede?',
		};

		this.dialog
			.open(ConfirmActionDialogComponent, {
				data: dialogData,
			})
			.afterClosed()
			.subscribe((confirmed: boolean) => {
				if (confirmed) {
					this.branchService.deleteBranch(branchId).subscribe({
						next: (apiResponse) => {
							console.log('Sede eliminada: ', apiResponse.data);
							this.getBranches();
						},
						error: (error) => {
							console.error('Error al eliminar sede', error);
						},
					});
				}
			});
	}
}
