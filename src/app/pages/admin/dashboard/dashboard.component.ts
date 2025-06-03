import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TimeRangeOption } from '../../../core/models/common/time-range-option.model';

import { ActionHistoryTimelineComponent } from './action-history-timeline/action-history-timeline.component';
import { DashboardKpisComponent } from './dashboard-kpis/dashboard-kpis.component';
import { DashboardTablesComponent } from './dashboard-tables/dashboard-tables.component';
import { LineChartsComponent } from './line-charts/line-charts.component';
import { TopCourseInsightComponent } from './top-course-insight/top-course-insight.component';

@Component({
	selector: 'app-dashboard',
	standalone: true,
	imports: [
		MatFormFieldModule,
		MatSelectModule,
		NgFor,
		DashboardKpisComponent,
		LineChartsComponent,
		TopCourseInsightComponent,
		DashboardTablesComponent,
		ActionHistoryTimelineComponent,
	],
	templateUrl: './dashboard.component.html',
	styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
	timeRanges: TimeRangeOption[] = [
		{ label: 'Últimos 7 días', value: 'last7', group: 'Relativos' },
		{ label: 'Últimos 30 días', value: 'last30', group: 'Relativos' },
		{ label: 'Últimos 90 días', value: 'last90', group: 'Relativos' },
		{ label: 'Últimos 365 días', value: 'last365', group: 'Relativos' },

		{ label: 'Mayo 2025', value: '2025-05', group: 'Meses' },
		{ label: 'Abril 2025', value: '2025-04', group: 'Meses' },
		{ label: 'Marzo 2025', value: '2025-03', group: 'Meses' },

		{ label: '2025', value: '2025', group: 'Años' },
		{ label: '2024', value: '2024', group: 'Años' },
	];

	selectedRange: string = 'last7';

	get timeRangeGroups(): string[] {
		return [...new Set(this.timeRanges.map((opt) => opt.group))];
	}

	getOptionsByGroup(group: string): TimeRangeOption[] {
		return this.timeRanges.filter((opt) => opt.group === group);
	}
}
