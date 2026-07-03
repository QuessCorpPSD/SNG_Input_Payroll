import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartialHoldReleaseEmployeeSalaryComponent } from './partial-hold-release-employee-salary.component';

describe('PartialHoldReleaseEmployeeSalaryComponent', () => {
  let component: PartialHoldReleaseEmployeeSalaryComponent;
  let fixture: ComponentFixture<PartialHoldReleaseEmployeeSalaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartialHoldReleaseEmployeeSalaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PartialHoldReleaseEmployeeSalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
