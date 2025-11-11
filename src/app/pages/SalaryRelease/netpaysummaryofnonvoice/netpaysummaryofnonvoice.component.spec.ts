import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetpaysummaryofnonvoiceComponent } from './netpaysummaryofnonvoice.component';

describe('NetpaysummaryofnonvoiceComponent', () => {
  let component: NetpaysummaryofnonvoiceComponent;
  let fixture: ComponentFixture<NetpaysummaryofnonvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NetpaysummaryofnonvoiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetpaysummaryofnonvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
