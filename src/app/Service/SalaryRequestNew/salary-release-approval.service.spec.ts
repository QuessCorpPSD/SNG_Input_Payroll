import { TestBed } from '@angular/core/testing';

import { SalaryReleaseApprovalService } from './salary-release-approval.service';

describe('SalaryReleaseApprovalService', () => {
  let service: SalaryReleaseApprovalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalaryReleaseApprovalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
