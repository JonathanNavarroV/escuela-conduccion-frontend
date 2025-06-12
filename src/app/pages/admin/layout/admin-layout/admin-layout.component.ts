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
	 * Ancho dinámico del sidenav, calculado en funcón del estado `sidenavCollapsed`.
	 * Si está colapsado, el ancho será 65px; de lo contrario, 250px.
	 */
	protected sidenavWidth: Signal<'65px' | '250px'> = computed(() =>
		this.sidenavCollapsed() ? '65px' : '250px',
	);

	/**
	 * Alterna el estado del sidenav entre colapsado y expandido.
	 *
	 * Este método invierte el valor actual de `sidenavCollapsed`, lo que a su vez actualiza automáticamente el ancho calculado `sidenavWidth`.
	 */
	protected toggleSidenav() {
		this.sidenavCollapsed.set(!this.sidenavCollapsed());
	}
}
