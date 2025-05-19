import { Routes } from '@angular/router';
import { loggedGuard } from './core/guards/logged.guard';

export const routes: Routes = [
	{
		path: '',
		loadChildren: () =>
			import('./pages/auth/auth.routes').then((m) => m.authRoutes),
	},
	{
		path: 'admin',
		loadChildren: () =>
			import('./pages/admin/admin.routes').then((m) => m.adminRoutes),
		canActivate: [loggedGuard],
	},
	{
		path: '**',
		redirectTo: '',
	},
];
