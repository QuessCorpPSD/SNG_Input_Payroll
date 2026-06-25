import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingaggregatorComponent } from './billingaggregator.component';

describe('BillingaggregatorComponent', () => {
  let component: BillingaggregatorComponent;
  let fixture: ComponentFixture<BillingaggregatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillingaggregatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BillingaggregatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
