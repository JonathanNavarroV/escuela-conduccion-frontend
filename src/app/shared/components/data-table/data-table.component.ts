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
		CommonModule,
	],
	templateUrl: './data-table.component.html',
	styleUrl: './data-table.component.scss',
})
export class DataTableComponent<T> implements AfterViewInit {
	/**
	 * Placeholder opcional para el campo de búsqueda.
	 */
	@Input() searchPlaceholder?: string;

	/**
	 * Template opcional para mostrar acciones personalizadas en la cabecera, al lado del buscador.
	 */
	@Input() headerActionsTemplate?: TemplateRef<unknown>;

	/**
	 * Fuente de datos que será usada por la tabla.
	 * Debe ser una instancia de MatTableDataSource.
	 */
	@Input() dataSource: MatTableDataSource<T> = new MatTableDataSource<T>();

	/**
	 * Lista de definiciones de columnas.
	 * Cada columna debe tener al menos un identificador `def` y un encabezado `header`.
	 */
	@Input() columns: { def: string; header: string }[] = [];

	/**
	 * Lista de columnas que serán mostradas en el orden definido.
	 * Cada elemento debe coincidir con el `def` de alguna columna.
	 */
	@Input() displayedColumns: string[] = [];

	/**
	 * Diccionario de templates personalizados por columna.
	 * La clave es el `def` de la columna, y el valor un TemplateRef.
	 */
	@Input() customTemplates: Record<string, TemplateRef<unknown>> = {};

	/**
	 * Evento que se emite cada vez que cambia el valor del campo de búsqueda.
	 * El string emitido representa el texto ingresado.
	 */
	@Output() searchChanged = new EventEmitter<string>();

	/**
	 * Referencia al componente de paginación de Angular Material.
	 * Se vincula al datasource en `ngAfterViewInit`.
	 */
	@ViewChild(MatPaginator) paginator?: MatPaginator;

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
	 * Captura el evento del input de búsqueda y emite el valor ingresado
	 * a través del Output `searchChanged`.
	 *
	 * @param {Event} event Evento de entrada proveniente del campo de búsqueda.
	 * @returns {void} No retorna ningún valor.
	 */
	onSearchChanged(event: Event): void {
		const value = (event.target as HTMLInputElement).value;
		this.searchChanged.emit(value);
	}
}
