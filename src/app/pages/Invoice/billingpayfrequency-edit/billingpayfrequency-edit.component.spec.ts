import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingpayfrequencyEditComponent } from './billingpayfrequency-edit.component';

describe('BillingpayfrequencyEditComponent', () => {
  let component: BillingpayfrequencyEditComponent;
  let fixture: ComponentFixture<BillingpayfrequencyEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillingpayfrequencyEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BillingpayfrequencyEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
