import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GstinvoiceComponent } from './gstinvoice.component';

describe('GstinvoiceComponent', () => {
  let component: GstinvoiceComponent;
  let fixture: ComponentFixture<GstinvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GstinvoiceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GstinvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
