import { CommonModule } from '@angular/common';
import {
	AfterViewInit,
	Component,
	EventEmitter,
	Input,
	Output,
	TemplateRef,
	ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
	selector: 'app-data-table',
	standalone: true,
	imports: [
		MatFormFieldModule,
		MatIconModule,
		MatTableModule,
		MatPaginatorModule,
		MatInputModule,
		MatButtonModule,
		MatProgressBarModule,
		CommonModule,
	],
	templateUrl: './data-table.component.html',
	styleUrl: './data-table.component.scss',
})
export class DataTableComponent<T extends { id: string }>
	implements AfterViewInit
{
	/** Placeholder opcional para el campo de búsqueda. */
	@Input() public searchPlaceholder?: string;

	/** Plantilla opcional para las acciones del encabezado. */
	@Input() public headerActionsTemplate?: TemplateRef<unknown>;

	/** Fuente de datos para la tabla, con el tipo genérico `T`. */
	@Input() public dataSource: MatTableDataSource<T> =
		new MatTableDataSource<T>();

	/** Configuración de columnas para la tabla, con definición y encabezado. */
	@Input() public columns: { def: string; header: string }[] = [];

	/** Lista de columnas que se mostrarán en la tabla, en orden. */
	@Input() public displayedColumns: string[] = [];

	/** Plantillas personalizadas para distintas partes de la tabla, indexadas por clave. */
	@Input() public customTemplates: Record<string, TemplateRef<unknown>> = {};

	/** Indica si la tabla está en estado de carga para mostrar un spinner o indicador. */
	@Input() public isLoading = false;

	/** Evento que emite el término de búsqueda cuando cambia el filtro. */
	@Output() private searchChanged = new EventEmitter<string>();

	/** Referencia al paginador de la tabla para controlar la paginación. */
	@ViewChild(MatPaginator) private paginator?: MatPaginator;

	/**
	 * Se ejecuta después de inicializar las vistas hijas.
	 *
	 * Descripción detallada:
	 * - Asocia el paginador (`MatPaginator`) a la fuente de datos de la tabla si está disponible.
	 */
	public ngAfterViewInit(): void {
		if (this.paginator) {
			this.dataSource.paginator = this.paginator;
		}
	}

	/**
	 * Maneja el cambio en el campo de búsqueda y emite el nuevo término.
	 *
	 * @param {Event} event - Evento de entrada del campo de búsqueda.
	 */
	protected onSearchChanged(event: Event): void {
		const value = (event.target as HTMLInputElement).value;
		this.searchChanged.emit(value);
	}

	/**
	 * Función para optimizar el seguimiento de elementos en *ngFor por su ID.
	 *
	 * @param {number} _index - Índice del elemento en la lista (no usado).
	 * @param {T} item - Elemento actual del tipo genérico `T`.
	 * @returns {string} El ID único del elemento para mejorar el rendimiento del renderizado.
	 */
	public trackById(_index: number, item: T): string {
		return item.id;
	}
}
