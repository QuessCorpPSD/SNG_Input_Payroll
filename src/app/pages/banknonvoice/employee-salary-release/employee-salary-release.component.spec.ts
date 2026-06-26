import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSalaryReleaseComponent } from './employee-salary-release.component';

describe('EmployeeSalaryReleaseComponent', () => {
  let component: EmployeeSalaryReleaseComponent;
  let fixture: ComponentFixture<EmployeeSalaryReleaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeSalaryReleaseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeSalaryReleaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
