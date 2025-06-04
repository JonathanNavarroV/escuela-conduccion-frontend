import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionHistoryTimelineComponent } from './action-history-timeline.component';

describe('ActionHistoryTimelineComponent', () => {
	let component: ActionHistoryTimelineComponent;
	let fixture: ComponentFixture<ActionHistoryTimelineComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ActionHistoryTimelineComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(ActionHistoryTimelineComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
