import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputaggregatorattendanceComponent } from './inputaggregatorattendance.component';

describe('InputaggregatorattendanceComponent', () => {
  let component: InputaggregatorattendanceComponent;
  let fixture: ComponentFixture<InputaggregatorattendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputaggregatorattendanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InputaggregatorattendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
