import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LtacalculationComponent } from './ltacalculation.component';

describe('LtacalculationComponent', () => {
  let component: LtacalculationComponent;
  let fixture: ComponentFixture<LtacalculationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LtacalculationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LtacalculationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
