import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesalaryreleaseComponent } from './employeesalaryrelease.component';

describe('EmployeesalaryreleaseComponent', () => {
  let component: EmployeesalaryreleaseComponent;
  let fixture: ComponentFixture<EmployeesalaryreleaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeesalaryreleaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeesalaryreleaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
