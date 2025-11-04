import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceLeaveBalanceReportComponent } from './invoice-leave-balance-report.component';

describe('InvoiceLeaveBalanceReportComponent', () => {
  let component: InvoiceLeaveBalanceReportComponent;
  let fixture: ComponentFixture<InvoiceLeaveBalanceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceLeaveBalanceReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceLeaveBalanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
