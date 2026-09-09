import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayHistoryReportComponent } from './pay-history-report.component';

describe('PayHistoryReportComponent', () => {
  let component: PayHistoryReportComponent;
  let fixture: ComponentFixture<PayHistoryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayHistoryReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PayHistoryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
