import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeductionPayoutComponent } from './deduction-payout.component';

describe('DeductionPayoutComponent', () => {
  let component: DeductionPayoutComponent;
  let fixture: ComponentFixture<DeductionPayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeductionPayoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeductionPayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
