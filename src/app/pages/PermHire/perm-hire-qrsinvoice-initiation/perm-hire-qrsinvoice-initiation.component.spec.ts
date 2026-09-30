import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermHireQRSInvoiceInitiationComponent } from './perm-hire-qrsinvoice-initiation.component';

describe('PermHireQRSInvoiceInitiationComponent', () => {
  let component: PermHireQRSInvoiceInitiationComponent;
  let fixture: ComponentFixture<PermHireQRSInvoiceInitiationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermHireQRSInvoiceInitiationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PermHireQRSInvoiceInitiationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
