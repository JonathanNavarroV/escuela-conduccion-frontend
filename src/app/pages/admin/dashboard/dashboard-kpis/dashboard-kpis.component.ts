import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { KpiCardComponent } from './kpi-card/kpi-card.component';

@Component({
	selector: 'app-dashboard-kpis',
	standalone: true,
	imports: [
		MatTabsModule,
		MatFormFieldModule,
		MatSelectModule,
		KpiCardComponent,
	],
	templateUrl: './dashboard-kpis.component.html',
	styleUrl: './dashboard-kpis.component.scss',
})
export class DashboardKpisComponent {}
