import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceBillToRateComponent } from './service-bill-to-rate.component';

describe('ServiceBillToRateComponent', () => {
  let component: ServiceBillToRateComponent;
  let fixture: ComponentFixture<ServiceBillToRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceBillToRateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServiceBillToRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
