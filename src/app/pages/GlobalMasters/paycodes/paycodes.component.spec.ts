import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaycodesComponent } from './paycodes.component';

describe('PaycodesComponent', () => {
  let component: PaycodesComponent;
  let fixture: ComponentFixture<PaycodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaycodesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaycodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
