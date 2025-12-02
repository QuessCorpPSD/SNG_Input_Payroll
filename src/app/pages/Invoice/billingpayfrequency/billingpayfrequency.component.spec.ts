import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingpayfrequencyComponent } from './billingpayfrequency.component';

describe('BillingpayfrequencyComponent', () => {
  let component: BillingpayfrequencyComponent;
  let fixture: ComponentFixture<BillingpayfrequencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillingpayfrequencyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BillingpayfrequencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
