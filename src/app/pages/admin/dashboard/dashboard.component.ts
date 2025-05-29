import { Component } from '@angular/core';
import { DashboardKpisComponent } from './dashboard-kpis/dashboard-kpis.component';
import { DashboardTablesComponent } from './dashboard-tables/dashboard-tables.component';

@Component({
	selector: 'app-dashboard',
	standalone: true,
	imports: [DashboardKpisComponent, DashboardTablesComponent],
	templateUrl: './dashboard.component.html',
	styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {}
