import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentCoursesTableComponent } from './recent-courses-table.component';

describe('RecentCoursesTableComponent', () => {
	let component: RecentCoursesTableComponent;
	let fixture: ComponentFixture<RecentCoursesTableComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [RecentCoursesTableComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(RecentCoursesTableComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
