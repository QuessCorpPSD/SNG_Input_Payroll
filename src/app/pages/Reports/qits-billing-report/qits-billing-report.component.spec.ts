import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QITSBillingReportComponent } from './qits-billing-report.component';

describe('QITSBillingReportComponent', () => {
  let component: QITSBillingReportComponent;
  let fixture: ComponentFixture<QITSBillingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QITSBillingReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QITSBillingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
