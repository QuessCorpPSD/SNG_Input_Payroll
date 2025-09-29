import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveOpeningBalanceUploadComponent } from './leave-opening-balance-upload.component';

describe('LeaveOpeningBalanceUploadComponent', () => {
  let component: LeaveOpeningBalanceUploadComponent;
  let fixture: ComponentFixture<LeaveOpeningBalanceUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveOpeningBalanceUploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveOpeningBalanceUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
