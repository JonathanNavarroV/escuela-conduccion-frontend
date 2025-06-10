import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { EChartsCoreOption } from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';

@Component({
	selector: 'app-top-course-insight',
	standalone: true,
	imports: [MatCardModule, NgxEchartsModule],
	templateUrl: './top-course-insight.component.html',
	styleUrl: './top-course-insight.component.scss',
})
export class TopCourseInsightComponent {
	protected chartOption: EChartsCoreOption = {
		tooltip: {
			trigger: 'item',
		},
		legend: {
			orient: 'vertical',
			left: 'right',
		},
		series: [
			{
				name: 'Curso',
				type: 'pie',
				radius: '50%',
				data: [
					{ value: 1048, name: 'Curso 1' },
					{ value: 735, name: 'Curso 2' },
					{ value: 580, name: 'Curso 3' },
					{ value: 484, name: 'Curso 4' },
					{ value: 300, name: 'Curso 5' },
				],
				emphasis: {
					itemStyle: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)',
					},
				},
			},
		],
	};
}
