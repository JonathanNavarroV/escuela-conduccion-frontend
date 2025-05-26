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
	styleUrl: './header.component.css',
})
export class HeaderComponent {
	/**
	 *	Indica si el sidenav está colapsado.
	 */
	@Input() sidenavCollapsed!: Signal<boolean>;

	/**
	 * Evento emitido cuando el usuario hace click en el botón para colapsar/expandir el sidenav.
	 */
	@Output() sidenavToggle = new EventEmitter<void>();

	/**
	 * Maneja el click del botón del menú
	 *
	 * Emite un evento para indicar que se desea alternar el estado del sidenav.
	 */
	onToggleSidenav(): void {
		this.sidenavToggle.emit();
	}
}
