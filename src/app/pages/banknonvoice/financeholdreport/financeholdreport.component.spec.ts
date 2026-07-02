import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceholdreportComponent } from './financeholdreport.component';

describe('FinanceholdreportComponent', () => {
  let component: FinanceholdreportComponent;
  let fixture: ComponentFixture<FinanceholdreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinanceholdreportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceholdreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
