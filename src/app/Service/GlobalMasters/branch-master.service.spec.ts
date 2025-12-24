import { TestBed } from '@angular/core/testing';

import { BranchMasterService } from './branch-master.service';

describe('BranchMasterService', () => {
  let service: BranchMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BranchMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
