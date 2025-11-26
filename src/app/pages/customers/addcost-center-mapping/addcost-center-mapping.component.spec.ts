import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcostCenterMappingComponent } from './addcost-center-mapping.component';

describe('AddcostCenterMappingComponent', () => {
  let component: AddcostCenterMappingComponent;
  let fixture: ComponentFixture<AddcostCenterMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddcostCenterMappingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddcostCenterMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
