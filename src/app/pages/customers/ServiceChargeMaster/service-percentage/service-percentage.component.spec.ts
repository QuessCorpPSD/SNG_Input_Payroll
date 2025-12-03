import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicePercentageComponent } from './service-percentage.component';

describe('ServicePercentageComponent', () => {
  let component: ServicePercentageComponent;
  let fixture: ComponentFixture<ServicePercentageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicePercentageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServicePercentageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
