import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftinvoicenewComponent } from './draftinvoicenew.component';

describe('DraftinvoicenewComponent', () => {
  let component: DraftinvoicenewComponent;
  let fixture: ComponentFixture<DraftinvoicenewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DraftinvoicenewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DraftinvoicenewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
