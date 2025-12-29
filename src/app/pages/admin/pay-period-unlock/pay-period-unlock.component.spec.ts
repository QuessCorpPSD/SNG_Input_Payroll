import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayPeriodUnlockComponent } from './pay-period-unlock.component';

describe('PayPeriodUnlockComponent', () => {
  let component: PayPeriodUnlockComponent;
  let fixture: ComponentFixture<PayPeriodUnlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayPeriodUnlockComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PayPeriodUnlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
