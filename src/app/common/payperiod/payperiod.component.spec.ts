import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PayPeriodComponent } from './payperiod.component';

describe('PayperiodComponent', () => {
  let component: PayPeriodComponent;
  let fixture: ComponentFixture<PayPeriodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayPeriodComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
