import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimatetimeValidationComponent } from './estimatetime-validation.component';

describe('EstimatetimeValidationComponent', () => {
  let component: EstimatetimeValidationComponent;
  let fixture: ComponentFixture<EstimatetimeValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstimatetimeValidationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EstimatetimeValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
