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
	styleUrl: './sidenav.component.css',
})
export class SidenavComponent {
	collapsed: WritableSignal<boolean> = signal(false);
	@Input() set sidenavCollapsed(val: boolean) {
		this.collapsed.set(val);
	}

	menuItems: SidenavItem[] = [
		{
			icon: 'dashboard',
			label: 'Dashboard',
			route: '',
		},
	];

	profileImgSize: Signal<'32' | '125'> = computed(() =>
		this.collapsed() ? '32' : '125',
	);
}
