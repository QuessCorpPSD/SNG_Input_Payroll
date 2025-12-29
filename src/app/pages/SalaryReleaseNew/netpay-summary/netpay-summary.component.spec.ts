import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetpaySummaryComponent } from './netpay-summary.component';

describe('NetpaySummaryComponent', () => {
  let component: NetpaySummaryComponent;
  let fixture: ComponentFixture<NetpaySummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NetpaySummaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NetpaySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
