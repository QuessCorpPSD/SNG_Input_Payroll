import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyinvoiceformatComponent } from './companyinvoiceformat.component';

describe('CompanyinvoiceformatComponent', () => {
  let component: CompanyinvoiceformatComponent;
  let fixture: ComponentFixture<CompanyinvoiceformatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyinvoiceformatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompanyinvoiceformatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
