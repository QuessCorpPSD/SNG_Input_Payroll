import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonusPayoutComponent } from './bonus-payout.component';

describe('BonusPayoutComponent', () => {
  let component: BonusPayoutComponent;
  let fixture: ComponentFixture<BonusPayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BonusPayoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BonusPayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
