import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseholdEmployeesalaryComponent } from './releasehold-employeesalary.component';

describe('ReleaseholdEmployeesalaryComponent', () => {
  let component: ReleaseholdEmployeesalaryComponent;
  let fixture: ComponentFixture<ReleaseholdEmployeesalaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReleaseholdEmployeesalaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReleaseholdEmployeesalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
