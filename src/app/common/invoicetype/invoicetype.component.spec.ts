import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicetypeComponent } from './invoicetype.component';

describe('InvoicetypeComponent', () => {
  let component: InvoicetypeComponent;
  let fixture: ComponentFixture<InvoicetypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoicetypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InvoicetypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
