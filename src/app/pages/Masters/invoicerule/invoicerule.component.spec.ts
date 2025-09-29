import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceruleComponent } from './invoicerule.component';

describe('InvoiceruleComponent', () => {
  let component: InvoiceruleComponent;
  let fixture: ComponentFixture<InvoiceruleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceruleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceruleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
