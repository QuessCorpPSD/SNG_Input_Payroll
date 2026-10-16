import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterCompanyInvoiceComponent } from './inter-company-invoice.component';

describe('InterCompanyInvoiceComponent', () => {
  let component: InterCompanyInvoiceComponent;
  let fixture: ComponentFixture<InterCompanyInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterCompanyInvoiceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InterCompanyInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
