import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddServiceChargeComponent } from './add-service-charge.component';

describe('AddServiceChargeComponent', () => {
  let component: AddServiceChargeComponent;
  let fixture: ComponentFixture<AddServiceChargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddServiceChargeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddServiceChargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
