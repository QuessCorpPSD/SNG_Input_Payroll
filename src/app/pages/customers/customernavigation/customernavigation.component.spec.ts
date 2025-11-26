import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomernavigationComponent } from './customernavigation.component';

describe('CustomernavigationComponent', () => {
  let component: CustomernavigationComponent;
  let fixture: ComponentFixture<CustomernavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomernavigationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomernavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
