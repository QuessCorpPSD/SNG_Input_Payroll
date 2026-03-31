import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankInvoiceNavigationComponent } from './bank-invoice-navigation.component';

describe('BankInvoiceNavigationComponent', () => {
  let component: BankInvoiceNavigationComponent;
  let fixture: ComponentFixture<BankInvoiceNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankInvoiceNavigationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BankInvoiceNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
