import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewUsersInsightComponent } from './new-users-insight.component';

describe('NewUsersInsightComponent', () => {
	let component: NewUsersInsightComponent;
	let fixture: ComponentFixture<NewUsersInsightComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [NewUsersInsightComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(NewUsersInsightComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
