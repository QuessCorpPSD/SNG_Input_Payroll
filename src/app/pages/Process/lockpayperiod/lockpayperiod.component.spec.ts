import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LockpayperiodComponent } from './lockpayperiod.component';

describe('LockpayperiodComponent', () => {
  let component: LockpayperiodComponent;
  let fixture: ComponentFixture<LockpayperiodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LockpayperiodComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LockpayperiodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
