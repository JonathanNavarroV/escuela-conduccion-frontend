import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { RecentCourse } from '../../../../../core/models/dashboard/recent-course.model';

@Component({
	selector: 'app-recent-courses-table',
	standalone: true,
	imports: [CommonModule, MatTableModule],
	templateUrl: './recent-courses-table.component.html',
	styleUrl: './recent-courses-table.component.scss',
})
export class RecentCoursesTableComponent {
	recentCourses: RecentCourse[] = [
		{
			id: 'a1',
			courseName: 'Curso 1',
			userEmail: 'jonathan.d.navarro.v@gmail.com',
			soldDate: new Date(new Date().toISOString()),
			saleAmount: 13000,
		},
		{
			id: 'a2',
			courseName: 'Curso 1',
			userEmail: 'jonathan.d.navarro.v@gmail.com',
			soldDate: new Date(new Date().toISOString()),
			saleAmount: 13000,
		},
		{
			id: 'a3',
			courseName: 'Curso 1',
			userEmail: 'jonathan.d.navarro.v@gmail.com',
			soldDate: new Date(new Date().toISOString()),
			saleAmount: 13000,
		},
		{
			id: 'a4',
			courseName: 'Curso 1',
			userEmail: 'jonathan.d.navarro.v@gmail.com',
			soldDate: new Date(new Date().toISOString()),
			saleAmount: 13000,
		},
		{
			id: 'a5',
			courseName: 'Curso 1',
			userEmail: 'jonathan.d.navarro.v@gmail.com',
			soldDate: new Date(new Date().toISOString()),
			saleAmount: 13000,
		},
		{
			id: 'a6',
			courseName: 'Curso 1',
			userEmail: 'jonathan.d.navarro.v@gmail.com',
			soldDate: new Date(new Date().toISOString()),
			saleAmount: 13000,
		},
		{
			id: 'a7',
			courseName: 'Curso 1',
			userEmail: 'jonathan.d.navarro.v@gmail.com',
			soldDate: new Date(new Date().toISOString()),
			saleAmount: 13000,
		},
		{
			id: 'a8',
			courseName: 'Curso 1',
			userEmail: 'jonathan.d.navarro.v@gmail.com',
			soldDate: new Date(new Date().toISOString()),
			saleAmount: 13000,
		},
		{
			id: 'a9',
			courseName: 'Curso 1',
			userEmail: 'jonathan.d.navarro.v@gmail.com',
			soldDate: new Date(new Date().toISOString()),
			saleAmount: 13000,
		},
		{
			id: 'a10',
			courseName: 'Curso 1',
			userEmail: 'jonathan.d.navarro.v@gmail.com',
			soldDate: new Date(new Date().toISOString()),
			saleAmount: 13000,
		},
	];

	displayedColumns: string[] = [
		'courseName',
		'userEmail',
		'soldDate',
		'saleAmount',
	];
}
