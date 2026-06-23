import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputaggregatoronboardingComponent } from './inputaggregatoronboarding.component';

describe('InputaggregatoronboardingComponent', () => {
  let component: InputaggregatoronboardingComponent;
  let fixture: ComponentFixture<InputaggregatoronboardingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputaggregatoronboardingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InputaggregatoronboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
