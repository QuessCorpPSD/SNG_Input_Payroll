import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSalarydetailsComponent } from './employee-salarydetails.component';

describe('EmployeeSalarydetailsComponent', () => {
  let component: EmployeeSalarydetailsComponent;
  let fixture: ComponentFixture<EmployeeSalarydetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeSalarydetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeSalarydetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
