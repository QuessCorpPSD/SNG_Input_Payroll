import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicenavigationComponent } from './invoicenavigation.component';

describe('InvoicenavigationComponent', () => {
  let component: InvoicenavigationComponent;
  let fixture: ComponentFixture<InvoicenavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoicenavigationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InvoicenavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
