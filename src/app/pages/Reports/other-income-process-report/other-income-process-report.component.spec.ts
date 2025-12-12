import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherIncomeProcessReportComponent } from './other-income-process-report.component';

describe('OtherIncomeProcessReportComponent', () => {
  let component: OtherIncomeProcessReportComponent;
  let fixture: ComponentFixture<OtherIncomeProcessReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtherIncomeProcessReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OtherIncomeProcessReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
