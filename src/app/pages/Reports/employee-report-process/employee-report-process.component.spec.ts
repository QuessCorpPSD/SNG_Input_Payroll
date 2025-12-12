import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeReportProcessComponent } from './employee-report-process.component';

describe('EmployeeReportProcessComponent', () => {
  let component: EmployeeReportProcessComponent;
  let fixture: ComponentFixture<EmployeeReportProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeReportProcessComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeReportProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
