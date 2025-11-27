import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvisionalinvoiceComponent } from './provisionalinvoice.component';

describe('ProvisionalinvoiceComponent', () => {
  let component: ProvisionalinvoiceComponent;
  let fixture: ComponentFixture<ProvisionalinvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProvisionalinvoiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProvisionalinvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
