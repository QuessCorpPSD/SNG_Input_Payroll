import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankconsolidatedreportComponent } from './bankconsolidatedreport.component';

describe('BankconsolidatedreportComponent', () => {
  let component: BankconsolidatedreportComponent;
  let fixture: ComponentFixture<BankconsolidatedreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankconsolidatedreportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankconsolidatedreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
