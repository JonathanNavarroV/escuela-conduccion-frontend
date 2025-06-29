import {
	Component,
	computed,
	Signal,
	signal,
	WritableSignal,
} from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidenavComponent } from '../sidenav/sidenav.component';

@Component({
	selector: 'app-admin-layout',
	standalone: true,
	imports: [HeaderComponent, SidenavComponent, RouterOutlet, MatSidenavModule],
	templateUrl: './admin-layout.component.html',
	styleUrl: './admin-layout.component.scss',
})
export class AdminLayoutComponent {
	protected sidenavCollapsed: WritableSignal<boolean> = signal(false);

	/**
	 * Ancho actual del menú lateral (`sidenav`) en función de su estado.
	 *
	 * Descripción detallada:
	 * - Retorna el ancho del `sidenav` según si está colapsado o expandido.
	 * - Si está colapsado, devuelve `'65px'`; si está expandido, `'250px'`.
	 * - Se actualiza automáticamente al cambiar el estado de `sidenavCollapsed`.
	 *
	 * @returns {Signal<'65px' | '250px'>} Señal reactiva con el valor actual del ancho del menú lateral.
	 */
	protected sidenavWidth: Signal<'65px' | '250px'> = computed(() =>
		this.sidenavCollapsed() ? '65px' : '250px',
	);

	/**
	 * Alterna el estado del menú lateral (`sidenav`) entre colapsado y expandido.
	 *
	 * Descripción detallada:
	 * - Cambia el valor de `sidenavCollapsed` al valor opuesto.
	 * - Altera visualmente el ancho del menú lateral mediante señales reactivas.
	 */
	protected toggleSidenav() {
		this.sidenavCollapsed.set(!this.sidenavCollapsed());
	}
}
