import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonusaccumulatedreportnonvoiceComponent } from './bonusaccumulatedreportnonvoice.component';

describe('BonusaccumulatedreportnonvoiceComponent', () => {
  let component: BonusaccumulatedreportnonvoiceComponent;
  let fixture: ComponentFixture<BonusaccumulatedreportnonvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BonusaccumulatedreportnonvoiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BonusaccumulatedreportnonvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
