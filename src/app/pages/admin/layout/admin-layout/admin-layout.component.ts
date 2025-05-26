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
	styleUrl: './admin-layout.component.css',
})
export class AdminLayoutComponent {
	sidenavCollapsed: WritableSignal<boolean> = signal(false);

	/**
	 * Ancho dinámico del sidenav, calculado en funcón del estado `sidenavCollapsed`.
	 * Si está colapsado, el ancho será 65px; de lo contrario, 250px.
	 */
	sidenavWidth: Signal<'65px' | '250px'> = computed(() =>
		this.sidenavCollapsed() ? '65px' : '250px',
	);

	/**
	 * Alterna el estado del sidenav entre colapsado y expandido.
	 *
	 * Este método invierte el valor actual de `sidenavCollapsed`, lo que a su vez actualiza automáticamente el ancho calculado `sidenavWidth`.
	 */
	toggleSidenav() {
		this.sidenavCollapsed.set(!this.sidenavCollapsed());
	}
}
