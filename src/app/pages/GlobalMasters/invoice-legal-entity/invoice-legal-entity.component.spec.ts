import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceLegalEntityComponent } from './invoice-legal-entity.component';

describe('InvoiceLegalEntityComponent', () => {
  let component: InvoiceLegalEntityComponent;
  let fixture: ComponentFixture<InvoiceLegalEntityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceLegalEntityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InvoiceLegalEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
