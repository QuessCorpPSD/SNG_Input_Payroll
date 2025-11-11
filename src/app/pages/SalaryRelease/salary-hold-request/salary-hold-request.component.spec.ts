import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryHoldRequestComponent } from './salary-hold-request.component';

describe('SalaryHoldRequestComponent', () => {
  let component: SalaryHoldRequestComponent;
  let fixture: ComponentFixture<SalaryHoldRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryHoldRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryHoldRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
