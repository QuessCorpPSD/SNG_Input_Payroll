import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OTPValidateComponent } from './otpvalidate.component';

describe('OTPValidateComponent', () => {
  let component: OTPValidateComponent;
  let fixture: ComponentFixture<OTPValidateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OTPValidateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OTPValidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
