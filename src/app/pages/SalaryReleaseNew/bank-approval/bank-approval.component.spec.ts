import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankApprovalComponent } from './bank-approval.component';

describe('BankApprovalComponent', () => {
  let component: BankApprovalComponent;
  let fixture: ComponentFixture<BankApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankApprovalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BankApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
