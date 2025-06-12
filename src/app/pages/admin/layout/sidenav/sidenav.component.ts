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
	/**
	 * Controla internamente si el sidenav está colapsado (`true`) o expandido (`false`).
	 */
	protected collapsed: WritableSignal<boolean> = signal(false);

	/**
	 * Setter del `@Input()` que actualiza el estado colapsado del sidenav.
	 * Este valor lo recibe desde el componente padre.
	 *
	 * @param val - Valor booleano que indica si el sidenav debe estar colapsado.
	 */
	@Input() public set sidenavCollapsed(val: boolean) {
		this.collapsed.set(val);
	}

	/**
	 * Elementos que se mostrarán en el menú lateral.
	 * Cada ítem contiene un icono, una etiqueta y una ruta asociada.
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
	];

	/**
	 * Tamaño dinámico de la imagen de perfil.
	 * Si el sidenav está colapsado, la imagen se reduce 32px; si está expandido, se muestra en 125px.
	 */
	protected profileImgSize: Signal<'32' | '125'> = computed(() =>
		this.collapsed() ? '32' : '125',
	);
}
