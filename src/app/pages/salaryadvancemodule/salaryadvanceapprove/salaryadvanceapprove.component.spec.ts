import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryadvanceapproveComponent } from './salaryadvanceapprove.component';

describe('SalaryadvanceapproveComponent', () => {
  let component: SalaryadvanceapproveComponent;
  let fixture: ComponentFixture<SalaryadvanceapproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryadvanceapproveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalaryadvanceapproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
