import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInvoiceLegalEntityComponent } from './add-invoice-legal-entity.component';

describe('AddInvoiceLegalEntityComponent', () => {
  let component: AddInvoiceLegalEntityComponent;
  let fixture: ComponentFixture<AddInvoiceLegalEntityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddInvoiceLegalEntityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddInvoiceLegalEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
