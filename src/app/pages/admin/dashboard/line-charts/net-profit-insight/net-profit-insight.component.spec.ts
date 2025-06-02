import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetProfitInsightComponent } from './net-profit-insight.component';

describe('NetProfitInsightComponent', () => {
	let component: NetProfitInsightComponent;
	let fixture: ComponentFixture<NetProfitInsightComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [NetProfitInsightComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(NetProfitInsightComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
