import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorEmployeeComponent } from './vendor-employee.component';

describe('VendorEmployeeComponent', () => {
  let component: VendorEmployeeComponent;
  let fixture: ComponentFixture<VendorEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorEmployeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
