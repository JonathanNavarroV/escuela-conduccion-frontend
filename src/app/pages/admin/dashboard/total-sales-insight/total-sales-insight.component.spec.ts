import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalSalesInsightComponent } from './total-sales-insight.component';

describe('TotalSalesInsightComponent', () => {
	let component: TotalSalesInsightComponent;
	let fixture: ComponentFixture<TotalSalesInsightComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TotalSalesInsightComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(TotalSalesInsightComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
