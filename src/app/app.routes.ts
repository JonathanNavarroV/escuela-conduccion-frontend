import { Routes } from '@angular/router';

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
	},
	{
		path: '**',
		redirectTo: '',
	},
];
