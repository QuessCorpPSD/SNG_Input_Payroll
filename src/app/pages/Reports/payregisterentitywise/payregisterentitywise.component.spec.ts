import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayregisterentitywiseComponent } from './payregisterentitywise.component';

describe('PayregisterentitywiseComponent', () => {
  let component: PayregisterentitywiseComponent;
  let fixture: ComponentFixture<PayregisterentitywiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayregisterentitywiseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PayregisterentitywiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
