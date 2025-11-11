import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayperiodsequenceComponent } from './payperiodsequence.component';

describe('PayperiodsequenceComponent', () => {
  let component: PayperiodsequenceComponent;
  let fixture: ComponentFixture<PayperiodsequenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayperiodsequenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayperiodsequenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
