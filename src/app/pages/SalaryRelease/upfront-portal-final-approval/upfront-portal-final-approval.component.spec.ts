import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpfrontPortalFinalApprovalComponent } from './upfront-portal-final-approval.component';

describe('UpfrontPortalFinalApprovalComponent', () => {
  let component: UpfrontPortalFinalApprovalComponent;
  let fixture: ComponentFixture<UpfrontPortalFinalApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpfrontPortalFinalApprovalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpfrontPortalFinalApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
