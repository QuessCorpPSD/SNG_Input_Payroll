import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePersonaldetailComponent } from './employee-personaldetail.component';

describe('EmployeePersonaldetailComponent', () => {
  let component: EmployeePersonaldetailComponent;
  let fixture: ComponentFixture<EmployeePersonaldetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeePersonaldetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeePersonaldetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
