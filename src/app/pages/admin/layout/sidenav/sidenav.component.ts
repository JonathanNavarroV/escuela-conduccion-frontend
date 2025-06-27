import { NgFor, NgIf } from '@angular/common';
import {
	Component,
	computed,
	Input,
	Signal,
	signal,
	WritableSignal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { SidenavItem } from '../../../../core/models/common/sidenav-item.model';

@Component({
	selector: 'app-sidenav',
	standalone: true,
	imports: [MatIconModule, MatListModule, NgFor, NgIf, RouterModule],
	templateUrl: './sidenav.component.html',
	styleUrl: './sidenav.component.scss',
})
export class SidenavComponent {
	/** Controla internamente si el sidenav está colapsado (`true`) o expandido (`false`). */
	protected collapsed: WritableSignal<boolean> = signal(false);

	/**
	 * Establece el estado colapsado del menú lateral (`sidenav`).
	 *
	 * Descripción detallada:
	 * - Recibe un valor booleano desde un componente padre mediante `@Input()`.
	 * - Actualiza internamente la señal `collapsed` con el valor recibido.
	 *
	 * @param {boolean} val - Indica si el `sidenav` debe estar colapsado (`true`) o expandido (`false`).
	 */
	@Input() public set sidenavCollapsed(val: boolean) {
		this.collapsed.set(val);
	}

	/**
	 * Elementos que se mostrarán en el menú lateral (`sidenav`).
	 *
	 * Descripción detallada:
	 * - Cada ítem contiene un ícono, una etiqueta visible y una ruta asociada para la navegación.
	 */
	protected menuItems: SidenavItem[] = [
		{
			icon: 'dashboard',
			label: 'Panel general',
			route: 'dashboard',
		},
		{
			icon: 'group',
			label: 'Usuarios',
			route: 'users',
		},
		{
			icon: 'business',
			label: 'Sedes',
			route: 'branches',
		},
	];

	/**
	 * Tamaño actual de la imagen de perfil según el estado del menú lateral.
	 *
	 * Descripción detallada:
	 * - Si el menú lateral está colapsado, retorna `'32'`.
	 * - Si está expandido, retorna `'125'`.
	 * - Se actualiza automáticamente al cambiar la señal `collapsed`.
	 *
	 * @returns {Signal<'32' | '125'>} Señal reactiva con el tamaño de la imagen de perfil.
	 */
	protected profileImgSize: Signal<'32' | '125'> = computed(() =>
		this.collapsed() ? '32' : '125',
	);
}
