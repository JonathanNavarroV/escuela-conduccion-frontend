import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopCourseInsightComponent } from './top-course-insight.component';

describe('TopCourseInsightComponent', () => {
	let component: TopCourseInsightComponent;
	let fixture: ComponentFixture<TopCourseInsightComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TopCourseInsightComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(TopCourseInsightComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
