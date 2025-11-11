import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryAdvanceRequestComponent } from './salary-advance-request.component';

describe('SalaryAdvanceRequestComponent', () => {
  let component: SalaryAdvanceRequestComponent;
  let fixture: ComponentFixture<SalaryAdvanceRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryAdvanceRequestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalaryAdvanceRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
