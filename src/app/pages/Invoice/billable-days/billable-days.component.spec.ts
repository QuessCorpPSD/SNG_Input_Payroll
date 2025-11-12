import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillableDaysComponent } from './billable-days.component';

describe('BillableDaysComponent', () => {
  let component: BillableDaysComponent;
  let fixture: ComponentFixture<BillableDaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillableDaysComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillableDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
