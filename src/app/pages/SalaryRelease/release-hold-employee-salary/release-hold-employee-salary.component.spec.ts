import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseHoldEmployeeSalaryComponent } from './release-hold-employee-salary.component';

describe('ReleaseHoldEmployeeSalaryComponent', () => {
  let component: ReleaseHoldEmployeeSalaryComponent;
  let fixture: ComponentFixture<ReleaseHoldEmployeeSalaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReleaseHoldEmployeeSalaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReleaseHoldEmployeeSalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
