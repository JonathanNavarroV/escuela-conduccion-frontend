import { Component, EventEmitter, Input, Output, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
	selector: 'app-header',
	standalone: true,
	imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatMenuModule],
	templateUrl: './header.component.html',
	styleUrl: './header.component.scss',
})
export class HeaderComponent {
	/**	Indica si el sidenav está colapsado. */
	@Input() public sidenavCollapsed!: Signal<boolean>;

	/** Evento emitido cuando el usuario hace click en el botón para colapsar/expandir el sidenav. */
	@Output() private sidenavToggle = new EventEmitter<void>();

	/**
	 * Emite un evento para notificar el cambio de estado del `sidenav`.
	 *
	 * Descripción detallada:
	 * - Utiliza `sidenavToggle.emit()` para comunicar a componentes padres que se debe alternar el menú lateral.
	 */
	protected onToggleSidenav(): void {
		this.sidenavToggle.emit();
	}
}
