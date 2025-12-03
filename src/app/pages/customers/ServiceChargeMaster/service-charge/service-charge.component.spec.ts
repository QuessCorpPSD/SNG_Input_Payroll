import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceChargeComponent } from './service-charge.component';

describe('ServiceChargeComponent', () => {
  let component: ServiceChargeComponent;
  let fixture: ComponentFixture<ServiceChargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceChargeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServiceChargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
