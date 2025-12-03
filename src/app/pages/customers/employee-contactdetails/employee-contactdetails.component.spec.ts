import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeContactdetailsComponent } from './employee-contactdetails.component';

describe('EmployeeContactdetailsComponent', () => {
  let component: EmployeeContactdetailsComponent;
  let fixture: ComponentFixture<EmployeeContactdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeContactdetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeContactdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
