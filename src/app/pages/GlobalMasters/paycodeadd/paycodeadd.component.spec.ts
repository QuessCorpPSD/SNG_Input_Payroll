import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaycodeaddComponent } from './paycodeadd.component';

describe('PaycodeaddComponent', () => {
  let component: PaycodeaddComponent;
  let fixture: ComponentFixture<PaycodeaddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaycodeaddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaycodeaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
