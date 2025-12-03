import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceCultureAddpoComponent } from './invoice-culture-addpo.component';

describe('InvoiceCultureAddpoComponent', () => {
  let component: InvoiceCultureAddpoComponent;
  let fixture: ComponentFixture<InvoiceCultureAddpoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceCultureAddpoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InvoiceCultureAddpoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
