import { TestBed } from '@angular/core/testing';

import { SgpayregisterService } from './sgpayregister.service';

describe('SgpayregisterService', () => {
  let service: SgpayregisterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SgpayregisterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
