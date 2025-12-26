import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpfrontApprovalComponent } from './upfront-approval.component';

describe('UpfrontApprovalComponent', () => {
  let component: UpfrontApprovalComponent;
  let fixture: ComponentFixture<UpfrontApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpfrontApprovalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpfrontApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
