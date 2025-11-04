import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePOComponent } from './employee-po.component';

describe('EmployeePOComponent', () => {
  let component: EmployeePOComponent;
  let fixture: ComponentFixture<EmployeePOComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeePOComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeePOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
