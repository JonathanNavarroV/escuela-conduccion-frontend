import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { RecentCoursesTableComponent } from './recent-courses-table/recent-courses-table.component';
import { RecentUsersTableComponent } from './recent-users-table/recent-users-table.component';

@Component({
	selector: 'app-dashboard-tables',
	standalone: true,
	imports: [
		MatCardModule,
		MatTabsModule,
		RecentUsersTableComponent,
		RecentCoursesTableComponent,
	],
	templateUrl: './dashboard-tables.component.html',
	styleUrl: './dashboard-tables.component.scss',
})
export class DashboardTablesComponent {}
