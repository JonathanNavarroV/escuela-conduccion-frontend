import {
	Component,
	computed,
	Signal,
	signal,
	WritableSignal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { SidenavComponent } from '../sidenav/sidenav.component';

@Component({
	selector: 'app-admin-layout',
	standalone: true,
	imports: [
		SidenavComponent,
		RouterOutlet,
		MatIconModule,
		MatToolbarModule,
		MatButtonModule,
		MatSidenavModule,
	],
	templateUrl: './admin-layout.component.html',
	styleUrl: './admin-layout.component.css',
})
export class AdminLayoutComponent {
	sidenavCollapsed: WritableSignal<boolean> = signal(false);

	sidenavWidth: Signal<'65px' | '250px'> = computed(() =>
		this.sidenavCollapsed() ? '65px' : '250px',
	);
}
