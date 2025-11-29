import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingpayfrequencyAddComponent } from './billingpayfrequency-add.component';

describe('BillingpayfrequencyAddComponent', () => {
  let component: BillingpayfrequencyAddComponent;
  let fixture: ComponentFixture<BillingpayfrequencyAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillingpayfrequencyAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BillingpayfrequencyAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
