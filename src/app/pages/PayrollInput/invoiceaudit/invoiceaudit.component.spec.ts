import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceauditComponent } from './invoiceaudit.component';

describe('InvoiceauditComponent', () => {
  let component: InvoiceauditComponent;
  let fixture: ComponentFixture<InvoiceauditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceauditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InvoiceauditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
