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
	@Input() kpiIcon = '';
	@Input() kpiValue = '';
	@Input() kpiText = '';

	@Input() kpiCircleColor = '--primary';
	@Input() kpiIconColor = '--primary-light';
}
