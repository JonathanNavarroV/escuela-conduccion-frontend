import { Routes } from '@angular/router';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
	{
		path: '',
		loadChildren: () =>
			import('./pages/auth/auth.routes').then((m) => m.authRoutes),
		canActivate: [guestGuard],
	},
	{
		path: 'admin',
		loadChildren: () =>
			import('./pages/admin/admin.routes').then((m) => m.adminRoutes),
		// canActivate: [authGuard],
	},
	{
		path: '**',
		redirectTo: '',
	},
];
