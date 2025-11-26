import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaytransactionComponent } from './paytransaction.component';

describe('PaytransactionComponent', () => {
  let component: PaytransactionComponent;
  let fixture: ComponentFixture<PaytransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaytransactionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaytransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
