import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaycodeComponent } from './paycode.component';

describe('PaycodeComponent', () => {
  let component: PaycodeComponent;
  let fixture: ComponentFixture<PaycodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaycodeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaycodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
