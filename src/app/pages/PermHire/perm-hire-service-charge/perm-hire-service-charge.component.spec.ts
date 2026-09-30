import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermHireServiceChargeComponent } from './perm-hire-service-charge.component';

describe('PermHireServiceChargeComponent', () => {
  let component: PermHireServiceChargeComponent;
  let fixture: ComponentFixture<PermHireServiceChargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermHireServiceChargeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PermHireServiceChargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
