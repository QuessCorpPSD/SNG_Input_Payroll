import { TestBed } from '@angular/core/testing';

import { PermhireservicechargetypeService } from './permhireservicechargetype.service';

describe('PermhireservicechargetypeService', () => {
  let service: PermhireservicechargetypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermhireservicechargetypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
