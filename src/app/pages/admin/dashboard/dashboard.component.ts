import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { EChartsCoreOption } from 'echarts/core';
import { NgxEchartsModule } from 'ngx-echarts';

@Component({
	selector: 'app-dashboard',
	standalone: true,
	imports: [
		MatCardModule,
		MatIconModule,
		MatProgressBarModule,
		NgxEchartsModule,
	],
	templateUrl: './dashboard.component.html',
	styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
	chartOption: EChartsCoreOption = {
		xAxis: {
			type: 'category',
			data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
		},
		yAxis: {
			type: 'value',
		},
		series: [
			{
				data: [820, 932, 901, 934, 1290, 1330, 1320],
				type: 'line',
			},
		],
	};
}
