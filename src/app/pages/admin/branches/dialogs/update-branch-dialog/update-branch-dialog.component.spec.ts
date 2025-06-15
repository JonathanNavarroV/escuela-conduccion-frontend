import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateBranchDialogComponent } from './update-branch-dialog.component';

describe('UpdateBranchDialogComponent', () => {
	let component: UpdateBranchDialogComponent;
	let fixture: ComponentFixture<UpdateBranchDialogComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [UpdateBranchDialogComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(UpdateBranchDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
