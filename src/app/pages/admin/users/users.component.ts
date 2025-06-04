import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
	selector: 'app-users',
	standalone: true,
	imports: [
		MatFormField,
		MatInputModule,
		MatTableModule,
		MatMenuModule,
		MatButtonModule,
		MatIconModule,
		MatPaginatorModule,
		CommonModule,
	],
	templateUrl: './users.component.html',
	styleUrl: './users.component.scss',
})
export class UsersComponent {
	recentUsers: any[] = [
		{
			id: 'a1',
			photo:
				'https://yt3.googleusercontent.com/ytc/AIdro_lvA7IhwlBwglWjVEwHjzQAqyvAC9cb1Ei_U9KYCEhRVgs=s72-c-k-c0x00ffffff-no-rj',
			fullName: 'Jonathan Damián Navarro Vega',
			email: 'jonathan.d.navarro.v@gmail.com',
			role: 'Super administrador',
		},
		{
			id: 'a2',
			photo: null,
			fullName: 'Jonathan Damián Navarro Vega',
			email: 'jonathan.d.navarro.v@gmail.com',
			role: 'Administrativo',
		},
		{
			id: 'a3',
			photo: null,
			fullName: 'Jonathan Damián Navarro Vega',
			email: 'jonathan.d.navarro.v@gmail.com',
			role: 'Administrativo',
		},
	];

	displayedColumns: string[] = ['user', 'email', 'role', 'actions'];

	dataSource = new MatTableDataSource<any>(this.recentUsers);

	@ViewChild(MatPaginator) paginator!: MatPaginator;

	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
	}
}
