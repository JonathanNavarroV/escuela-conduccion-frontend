import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { DashboardKpisComponent } from './dashboard-kpis/dashboard-kpis.component';

@Component({
	selector: 'app-dashboard',
	standalone: true,
	imports: [
		MatCardModule,
		MatIconModule,
		MatTabsModule,
		MatFormFieldModule,
		MatSelectModule,
		DashboardKpisComponent,
	],
	templateUrl: './dashboard.component.html',
	styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {}
