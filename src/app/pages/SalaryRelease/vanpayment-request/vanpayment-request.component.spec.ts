import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VANPaymentRequestComponent } from './vanpayment-request.component';

describe('VANPaymentRequestComponent', () => {
  let component: VANPaymentRequestComponent;
  let fixture: ComponentFixture<VANPaymentRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VANPaymentRequestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VANPaymentRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
