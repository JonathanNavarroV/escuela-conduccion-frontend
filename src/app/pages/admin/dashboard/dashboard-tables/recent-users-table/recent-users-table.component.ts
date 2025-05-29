import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { RecentUser } from '../../../../../core/models/dashboard/recent-user.model';

@Component({
	selector: 'app-recent-users-table',
	standalone: true,
	imports: [CommonModule, MatTableModule],
	templateUrl: './recent-users-table.component.html',
	styleUrl: './recent-users-table.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentUsersTableComponent {
	recentUsers: RecentUser[] = [
		{
			id: 'a1',
			fullName: 'Jonathan Damián Navarro Vega',
			email: 'jonathan.d.navarro.v@gmail.com',
			registrationDate: new Date(new Date().toISOString()),
		},
		{
			id: 'a2',
			fullName: 'Jonathan Damián Navarro Vega',
			email: 'jonathan.d.navarro.v@gmail.com',
			registrationDate: new Date(new Date().toISOString()),
		},
		{
			id: 'a3',
			fullName: 'Jonathan Damián Navarro Vega',
			email: 'jonathan.d.navarro.v@gmail.com',
			registrationDate: new Date(new Date().toISOString()),
		},
		{
			id: 'a4',
			fullName: 'Jonathan Damián Navarro Vega',
			email: 'jonathan.d.navarro.v@gmail.com',
			registrationDate: new Date(new Date().toISOString()),
		},
		{
			id: 'a5',
			fullName: 'Jonathan Damián Navarro Vega',
			email: 'jonathan.d.navarro.v@gmail.com',
			registrationDate: new Date(new Date().toISOString()),
		},
		{
			id: 'a6',
			fullName: 'Jonathan Damián Navarro Vega',
			email: 'jonathan.d.navarro.v@gmail.com',
			registrationDate: new Date(new Date().toISOString()),
		},
		{
			id: 'a7',
			fullName: 'Jonathan Damián Navarro Vega',
			email: 'jonathan.d.navarro.v@gmail.com',
			registrationDate: new Date(new Date().toISOString()),
		},
		{
			id: 'a8',
			fullName: 'Jonathan Damián Navarro Vega',
			email: 'jonathan.d.navarro.v@gmail.com',
			registrationDate: new Date(new Date().toISOString()),
		},
		{
			id: 'a9',
			fullName: 'Jonathan Damián Navarro Vega',
			email: 'jonathan.d.navarro.v@gmail.com',
			registrationDate: new Date(new Date().toISOString()),
		},
		{
			id: 'a10',
			fullName: 'Jonathan Damián Navarro Vega',
			email: 'jonathan.d.navarro.v@gmail.com',
			registrationDate: new Date(new Date().toISOString()),
		},
	];

	displayedColumns: string[] = ['fullName', 'email', 'registrationDate'];
}
