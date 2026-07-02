import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankadvicesplitcultureComponent } from './bankadvicesplitculture.component';

describe('BankadvicesplitcultureComponent', () => {
  let component: BankadvicesplitcultureComponent;
  let fixture: ComponentFixture<BankadvicesplitcultureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankadvicesplitcultureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankadvicesplitcultureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
