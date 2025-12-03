import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeBankdetailsComponent } from './employee-bankdetails.component';

describe('EmployeeBankdetailsComponent', () => {
  let component: EmployeeBankdetailsComponent;
  let fixture: ComponentFixture<EmployeeBankdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeBankdetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeBankdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
