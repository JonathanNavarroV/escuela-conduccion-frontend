import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBranchDialogComponent } from './create-branch-dialog.component';

describe('CreateBranchDialogComponent', () => {
	let component: CreateBranchDialogComponent;
	let fixture: ComponentFixture<CreateBranchDialogComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [CreateBranchDialogComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(CreateBranchDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
