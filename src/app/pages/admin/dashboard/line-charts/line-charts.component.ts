import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { NetProfitInsightComponent } from './net-profit-insight/net-profit-insight.component';
import { NewUsersInsightComponent } from './new-users-insight/new-users-insight.component';
import { TotalSalesInsightComponent } from './total-sales-insight/total-sales-insight.component';

@Component({
	selector: 'app-line-charts',
	standalone: true,
	imports: [
		MatTabsModule,
		MatCardModule,
		TotalSalesInsightComponent,
		NetProfitInsightComponent,
		NewUsersInsightComponent,
	],
	templateUrl: './line-charts.component.html',
	styleUrl: './line-charts.component.scss',
})
export class LineChartsComponent {}
