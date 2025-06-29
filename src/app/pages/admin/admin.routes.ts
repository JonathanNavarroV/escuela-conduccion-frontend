import { Routes } from '@angular/router';
import { BranchesComponent } from './branches/branches.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { UsersComponent } from './users/users.component';

export const adminRoutes: Routes = [
	{
		path: '',
		component: AdminLayoutComponent,
		children: [
			{
				path: '',
				redirectTo: 'dashboard',
				pathMatch: 'full',
			},
			{
				path: 'dashboard',
				component: DashboardComponent,
			},
			{
				path: 'users',
				component: UsersComponent,
			},
			{
				path: 'branches',
				component: BranchesComponent,
			},
		],
	},
];
