import { TestBed } from '@angular/core/testing';

import { OffercreationService } from './offercreation.service';

describe('OffercreationService', () => {
  let service: OffercreationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OffercreationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
