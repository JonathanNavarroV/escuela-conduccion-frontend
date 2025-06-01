import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { EChartsCoreOption } from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';

@Component({
	selector: 'app-total-sales-insight',
	standalone: true,
	imports: [MatCardModule, NgxEchartsModule],
	templateUrl: './total-sales-insight.component.html',
	styleUrl: './total-sales-insight.component.scss',
})
export class TotalSalesInsightComponent {
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
