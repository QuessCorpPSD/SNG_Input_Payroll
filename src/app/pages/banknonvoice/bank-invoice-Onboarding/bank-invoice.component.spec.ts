import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankInvoiceComponent } from './bank-invoice.component';

describe('BankInvoiceComponent', () => {
  let component: BankInvoiceComponent;
  let fixture: ComponentFixture<BankInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankInvoiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
