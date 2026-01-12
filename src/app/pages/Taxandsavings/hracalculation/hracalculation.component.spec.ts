import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HRAcalculationComponent } from './hracalculation.component';

describe('HRAcalculationComponent', () => {
  let component: HRAcalculationComponent;
  let fixture: ComponentFixture<HRAcalculationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HRAcalculationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HRAcalculationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
