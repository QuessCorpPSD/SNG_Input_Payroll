import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyprovidedbenefitsComponent } from './companyprovidedbenefits.component';

describe('CompanyprovidedbenefitsComponent', () => {
  let component: CompanyprovidedbenefitsComponent;
  let fixture: ComponentFixture<CompanyprovidedbenefitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyprovidedbenefitsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompanyprovidedbenefitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
