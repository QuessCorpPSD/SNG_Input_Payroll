import { TestBed } from '@angular/core/testing';

import { DynamicRemoveService } from './dynamic-remove.service';

describe('DynamicRemoveService', () => {
  let service: DynamicRemoveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamicRemoveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
