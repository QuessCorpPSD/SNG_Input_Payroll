import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaytransactionaddComponent } from './paytransactionadd.component';

describe('PaytransactionaddComponent', () => {
  let component: PaytransactionaddComponent;
  let fixture: ComponentFixture<PaytransactionaddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaytransactionaddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaytransactionaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
