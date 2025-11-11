import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewJoineeExistingEmployeeBankVerifiedReportComponent } from './new-joinee-existing-employee-bank-verified-report.component';

describe('NewJoineeExistingEmployeeBankVerifiedReportComponent', () => {
  let component: NewJoineeExistingEmployeeBankVerifiedReportComponent;
  let fixture: ComponentFixture<NewJoineeExistingEmployeeBankVerifiedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewJoineeExistingEmployeeBankVerifiedReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewJoineeExistingEmployeeBankVerifiedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
