import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingpayfrequencyCopyComponent } from './billingpayfrequency-copy.component';

describe('BillingpayfrequencyCopyComponent', () => {
  let component: BillingpayfrequencyCopyComponent;
  let fixture: ComponentFixture<BillingpayfrequencyCopyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillingpayfrequencyCopyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BillingpayfrequencyCopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
