import { NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

@Component({
	selector: 'app-kpi-card',
	standalone: true,
	imports: [MatCardModule, MatIcon, NgStyle],
	templateUrl: './kpi-card.component.html',
	styleUrl: './kpi-card.component.scss',
})
export class KpiCardComponent {
	@Input() kpiIcon: string = '';
	@Input() kpiValue: string = '';
	@Input() kpiText: string = '';

	@Input() kpiCircleColor: string = '--primary';
	@Input() kpiIconColor: string = '--primary-light';
}
