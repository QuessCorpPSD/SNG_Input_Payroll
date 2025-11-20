import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LockpayperiodaddComponent } from './lockpayperiodadd.component';

describe('LockpayperiodaddComponent', () => {
  let component: LockpayperiodaddComponent;
  let fixture: ComponentFixture<LockpayperiodaddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LockpayperiodaddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LockpayperiodaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
