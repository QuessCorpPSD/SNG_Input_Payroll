import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceSlabComponent } from './service-slab.component';

describe('ServiceSlabComponent', () => {
  let component: ServiceSlabComponent;
  let fixture: ComponentFixture<ServiceSlabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceSlabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServiceSlabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
