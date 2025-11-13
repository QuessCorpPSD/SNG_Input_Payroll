import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryadvacerequestAddComponent } from './salaryadvacerequest-add.component';

describe('SalaryadvacerequestAddComponent', () => {
  let component: SalaryadvacerequestAddComponent;
  let fixture: ComponentFixture<SalaryadvacerequestAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryadvacerequestAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalaryadvacerequestAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
