import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermhireGSTInvoiceComponent } from './permhire-gstinvoice.component';

describe('PermhireGSTInvoiceComponent', () => {
  let component: PermhireGSTInvoiceComponent;
  let fixture: ComponentFixture<PermhireGSTInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermhireGSTInvoiceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PermhireGSTInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
