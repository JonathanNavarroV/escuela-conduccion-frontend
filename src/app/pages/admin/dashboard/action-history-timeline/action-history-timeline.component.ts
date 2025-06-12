import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
	selector: 'app-action-history-timeline',
	standalone: true,
	imports: [MatCardModule, NgFor, CommonModule],
	templateUrl: './action-history-timeline.component.html',
	styleUrl: './action-history-timeline.component.scss',
})
export class ActionHistoryTimelineComponent {
	protected value = [
		{
			date: new Date(),
			content: 'Evento 1',
		},
		{
			date: new Date(),
			content: 'Evento 2',
		},
		{
			date: new Date(),
			content: 'Evento 3',
		},
		{
			date: new Date(),
			content: 'Evento 4',
		},
		{
			date: new Date(),
			content: 'Evento 5',
		},
		{
			date: new Date(),
			content: 'Evento 6',
		},
	];
}
