import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoldEmployeeSalaryComponent } from './hold-employee-salary.component';

describe('HoldEmployeeSalaryComponent', () => {
  let component: HoldEmployeeSalaryComponent;
  let fixture: ComponentFixture<HoldEmployeeSalaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HoldEmployeeSalaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HoldEmployeeSalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
