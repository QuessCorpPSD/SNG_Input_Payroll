import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanygstinvoiceComponent } from './companygstinvoice.component';

describe('CompanygstinvoiceComponent', () => {
  let component: CompanygstinvoiceComponent;
  let fixture: ComponentFixture<CompanygstinvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanygstinvoiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanygstinvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
