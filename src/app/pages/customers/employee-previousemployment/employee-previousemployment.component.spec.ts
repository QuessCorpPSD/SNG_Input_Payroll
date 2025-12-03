import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePreviousemploymentComponent } from './employee-previousemployment.component';

describe('EmployeePreviousemploymentComponent', () => {
  let component: EmployeePreviousemploymentComponent;
  let fixture: ComponentFixture<EmployeePreviousemploymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeePreviousemploymentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeePreviousemploymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
