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
	protected recentCourses: RecentCourse[] = [
		{
			id: 'a1',
			courseName: 'Curso 1',
			saleAmount: 13000,
			soldDate: new Date(new Date().toISOString()),
			userEmail: 'jonathan.d.navarro.v@gmail.com',
		},
		{
			id: 'a2',
			courseName: 'Curso 2',
			saleAmount: 13000,
			soldDate: new Date(new Date().toISOString()),
			userEmail: 'jonathan.d.navarro.v@gmail.com',
		},
		{
			id: 'a3',
			courseName: 'Curso 3',
			saleAmount: 13000,
			soldDate: new Date(new Date().toISOString()),
			userEmail: 'jonathan.d.navarro.v@gmail.com',
		},
		{
			id: 'a4',
			courseName: 'Curso 4',
			saleAmount: 13000,
			soldDate: new Date(new Date().toISOString()),
			userEmail: 'jonathan.d.navarro.v@gmail.com',
		},
		{
			id: 'a5',
			courseName: 'Curso 5',
			saleAmount: 13000,
			soldDate: new Date(new Date().toISOString()),
			userEmail: 'jonathan.d.navarro.v@gmail.com',
		},
		{
			id: 'a6',
			courseName: 'Curso 6',
			saleAmount: 13000,
			soldDate: new Date(new Date().toISOString()),
			userEmail: 'jonathan.d.navarro.v@gmail.com',
		},
	];

	protected displayedColumns: string[] = [
		'courseName',
		'saleAmount',
		'soldDate',
		'userEmail',
	];
}
