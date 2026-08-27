import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceInitiateAgainstProfomaComponent } from './invoice-initiate-against-profoma.component';

describe('InvoiceInitiateAgainstProfomaComponent', () => {
  let component: InvoiceInitiateAgainstProfomaComponent;
  let fixture: ComponentFixture<InvoiceInitiateAgainstProfomaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceInitiateAgainstProfomaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InvoiceInitiateAgainstProfomaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
