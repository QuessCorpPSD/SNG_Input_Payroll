import { TestBed } from '@angular/core/testing';

import { ProfomaImportService } from './profoma-import.service';

describe('ProfomaImportService', () => {
  let service: ProfomaImportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfomaImportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
