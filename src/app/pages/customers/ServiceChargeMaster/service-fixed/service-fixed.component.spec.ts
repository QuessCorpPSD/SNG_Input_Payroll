import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceFixedComponent } from './service-fixed.component';

describe('ServiceFixedComponent', () => {
  let component: ServiceFixedComponent;
  let fixture: ComponentFixture<ServiceFixedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceFixedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServiceFixedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
