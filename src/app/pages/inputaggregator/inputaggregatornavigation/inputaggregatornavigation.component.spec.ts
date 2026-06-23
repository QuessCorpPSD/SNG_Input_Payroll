import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputaggregatornavigationComponent } from './inputaggregatornavigation.component';

describe('InputaggregatornavigationComponent', () => {
  let component: InputaggregatornavigationComponent;
  let fixture: ComponentFixture<InputaggregatornavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputaggregatornavigationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InputaggregatornavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
