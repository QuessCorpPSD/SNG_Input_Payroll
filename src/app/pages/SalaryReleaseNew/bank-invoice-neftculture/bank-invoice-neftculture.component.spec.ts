import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankInvoiceNEFTCultureComponent } from './bank-invoice-neftculture.component';

describe('BankInvoiceNEFTCultureComponent', () => {
  let component: BankInvoiceNEFTCultureComponent;
  let fixture: ComponentFixture<BankInvoiceNEFTCultureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankInvoiceNEFTCultureComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BankInvoiceNEFTCultureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
