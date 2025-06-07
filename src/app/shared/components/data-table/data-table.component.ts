import { CommonModule } from '@angular/common';
import {
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
export class DataTableComponent<T> {
	@Input() searchPlaceholder?: string;
	@Input() headerActionsTemplate?: TemplateRef<any>;
	@Input() dataSource: MatTableDataSource<T> = new MatTableDataSource<T>();
	@Input() columns: Array<{ def: string; header: string }> = [];
	@Input() displayedColumns: Array<string> = [];
	@Input() customTemplates: { [columnDef: string]: TemplateRef<any> } = {};

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
