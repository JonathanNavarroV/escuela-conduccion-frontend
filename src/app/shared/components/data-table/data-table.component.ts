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
	/**
	 * Placeholder opcional para el campo de búsqueda.
	 */
	@Input() public searchPlaceholder?: string;

	/**
	 * Template opcional para mostrar acciones personalizadas en la cabecera, al lado del buscador.
	 */
	@Input() public headerActionsTemplate?: TemplateRef<unknown>;

	/**
	 * Fuente de datos que será usada por la tabla.
	 * Debe ser una instancia de MatTableDataSource.
	 */
	@Input() public dataSource: MatTableDataSource<T> =
		new MatTableDataSource<T>();

	/**
	 * Lista de definiciones de columnas.
	 * Cada columna debe tener al menos un identificador `def` y un encabezado `header`.
	 */
	@Input() public columns: { def: string; header: string }[] = [];

	/**
	 * Lista de columnas que serán mostradas en el orden definido.
	 * Cada elemento debe coincidir con el `def` de alguna columna.
	 */
	@Input() public displayedColumns: string[] = [];

	/**
	 * Diccionario de templates personalizados por columna.
	 * La clave es el `def` de la columna, y el valor un TemplateRef.
	 */
	@Input() public customTemplates: Record<string, TemplateRef<unknown>> = {};

	/**
	 * Indica si la tabla está actualmente cargando datos.
	 *
	 * Esta bandera se utiliza para mostrar u ocultar un overlay de carga sobre la tabla
	 * mientras se realiza una petición al backend.
	 */
	@Input() public isLoading = false;

	/**
	 * Evento que se emite cada vez que cambia el valor del campo de búsqueda.
	 * El string emitido representa el texto ingresado.
	 */
	@Output() private searchChanged = new EventEmitter<string>();

	/**
	 * Referencia al componente de paginación de Angular Material.
	 * Se vincula al datasource en `ngAfterViewInit`.
	 */
	@ViewChild(MatPaginator) private paginator?: MatPaginator;

	/**
	 * Se ejecuta después de que la vista del componente ha sido inicializada.
	 * Asocia el paginador de Angular Material al dataSource de la tabla para habilitar la paginación.
	 *
	 * @returns {void} No retorna ningún valor.
	 */
	public ngAfterViewInit(): void {
		if (this.paginator) {
			this.dataSource.paginator = this.paginator;
		}
	}

	/**
	 * Captura el evento del input de búsqueda y emite el valor ingresado
	 * a través del Output `searchChanged`.
	 *
	 * @param {Event} event Evento de entrada proveniente del campo de búsqueda.
	 * @returns {void} No retorna ningún valor.
	 */
	protected onSearchChanged(event: Event): void {
		const value = (event.target as HTMLInputElement).value;
		this.searchChanged.emit(value);
	}

	/**
	 * Función trackBy para optimizar el renderizado de filas en la tabla.
	 * Utiliza la propiedad `id` de cada elemento para identificarlo de forma única.
	 *
	 * @param {number} _index - Índice del elemento en la lista.
	 * @param {T} item - Elemento actual de la lista.
	 * @returns {string} El identificador único del elemento (propiedad `id`).
	 */
	public trackById(_index: number, item: T): string {
		return item.id;
	}
}
