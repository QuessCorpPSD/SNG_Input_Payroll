import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayperiodSalaryComponent } from './payperiod-salary.component';

describe('PayperiodSalaryComponent', () => {
  let component: PayperiodSalaryComponent;
  let fixture: ComponentFixture<PayperiodSalaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayperiodSalaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayperiodSalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
