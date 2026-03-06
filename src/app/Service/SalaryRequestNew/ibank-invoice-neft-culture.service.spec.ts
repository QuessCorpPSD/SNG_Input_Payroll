import { TestBed } from '@angular/core/testing';

import { IBankInvoiceNeftCultureService } from './ibank-invoice-neft-culture.service';

describe('IBankInvoiceNeftCultureService', () => {
  let service: IBankInvoiceNeftCultureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IBankInvoiceNeftCultureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
