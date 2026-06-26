import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BanknonvoicenavigationComponent } from './banknonvoicenavigation.component';

describe('BanknonvoicenavigationComponent', () => {
  let component: BanknonvoicenavigationComponent;
  let fixture: ComponentFixture<BanknonvoicenavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BanknonvoicenavigationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BanknonvoicenavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
