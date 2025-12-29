import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearlyPayoutComponent } from './yearly-payout.component';

describe('YearlyPayoutComponent', () => {
  let component: YearlyPayoutComponent;
  let fixture: ComponentFixture<YearlyPayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YearlyPayoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(YearlyPayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
