import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostCenterMappingComponent } from './cost-center-mapping.component';

describe('CostCenterMappingComponent', () => {
  let component: CostCenterMappingComponent;
  let fixture: ComponentFixture<CostCenterMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CostCenterMappingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CostCenterMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
