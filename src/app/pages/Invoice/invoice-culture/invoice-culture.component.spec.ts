import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceCultureComponent } from './invoice-culture.component';

describe('InvoiceCultureComponent', () => {
  let component: InvoiceCultureComponent;
  let fixture: ComponentFixture<InvoiceCultureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceCultureComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InvoiceCultureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
