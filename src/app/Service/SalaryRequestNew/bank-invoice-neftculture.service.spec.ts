import { TestBed } from '@angular/core/testing';

import { BankInvoiceNEFTCultureService } from './bank-invoice-neftculture.service';

describe('BankInvoiceNEFTCultureService', () => {
  let service: BankInvoiceNEFTCultureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BankInvoiceNEFTCultureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
