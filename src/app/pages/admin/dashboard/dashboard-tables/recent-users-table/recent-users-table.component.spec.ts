import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentUsersTableComponent } from './recent-users-table.component';

describe('RecentUsersTableComponent', () => {
	let component: RecentUsersTableComponent;
	let fixture: ComponentFixture<RecentUsersTableComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [RecentUsersTableComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(RecentUsersTableComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
