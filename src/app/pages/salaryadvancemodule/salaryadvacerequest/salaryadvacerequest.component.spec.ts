import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryadvacerequestComponent } from './salaryadvacerequest.component';

describe('SalaryadvacerequestComponent', () => {
  let component: SalaryadvacerequestComponent;
  let fixture: ComponentFixture<SalaryadvacerequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryadvacerequestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalaryadvacerequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
