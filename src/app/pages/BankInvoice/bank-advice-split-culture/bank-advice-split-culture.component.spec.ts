import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankAdviceSplitCultureComponent } from './bank-advice-split-culture.component';

describe('BankAdviceSplitCultureComponent', () => {
  let component: BankAdviceSplitCultureComponent;
  let fixture: ComponentFixture<BankAdviceSplitCultureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankAdviceSplitCultureComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BankAdviceSplitCultureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
